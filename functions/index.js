const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const api = express();
const moment = require('moment-timezone');

/**
 * ENTITIES
 */
const entity_patients = 'patients';
const entity_physicians = 'physicians';
const entity_scheduling = 'scheduling';
const entity_specialty = 'specialty';
const entity_user = 'user';

const validateFirebaseIdToken = (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !req.cookies.__session) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>',
            'or by passing a "__session" cookie.');
        res.status(403).json({ type: 'error', message: 'Unauthorized' });
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    }
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
        console.log('ID Token correctly decoded', decodedIdToken);
        req.user = decodedIdToken;
        next();
    }).catch(error => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).json({ type: 'error', message: 'Unauthorized' });
    });
};

api.use(cors);
api.use(cookieParser);
api.use(validateFirebaseIdToken);

/**
 * @param body {name:String, gender:String, specialty:String, crm:String}
 * @returns Returns uid and created at.
 */
api.post('/addPhysician', (req, res) => {
    if (req.body === undefined) {
        res.status(400).json({ type: 'error', message: 'No physician defined!' });
    } else {
        let create = moment().tz("America/Sao_Paulo").format();

        admin.database().ref('/'.concat(entity_physicians)).push({
            name: req.body.name,
            gender: req.body.gender,
            specialty: req.body.specialty,
            crm: req.body.crm,
            about: req.body.about,
            accept_insurance: req.body.accept_insurance,
            accept_card: req.body.accept_card,
            accept_money: req.body.accept_money,
            createdAt: create
        }).then(snapshot => {
            res.status(200).json({
                uid: snapshot.key,
                createdAt: create
            });
        });
    }
});

api.post('/addSpecialty', (req, res) => {
    if (req.body === undefined) {
        res.status(400).json({ type: 'error', message: 'No specialty defined!' });
    } else {
        let create = moment().tz("America/Sao_Paulo").format();

        admin.database().ref('/'.concat(entity_specialty)).push({
            name: req.body.name,
            createdAt: create
        }).then(snapshot => {
            res.status(200).json({
                uid: snapshot.key,
                createdAt: create
            });
        });
    }
});

api.post('/addPatient', (req, res) => {
    if (req.body === undefined) {
        res.status(400).json({ type: 'error', message: 'No patient defined!' });
    } else {
        let create = moment().tz("America/Sao_Paulo").format();

        admin.database().ref('/'.concat(entity_patients)).push({
            name: req.body.name,
            birth: req.body.birth,
            gender: req.body.gender,
            createdAt: create
        }).then(snapshot => {
            res.status(200).json({
                uid: snapshot.key,
                createdAt: create
            });
        });
    }
});

api.post('/addScheduling', (req, res) => {
    if (req.body === undefined) {
        res.status(400).json({ type: 'error', message: 'No scheduling defined!' });
    } else {
        let create = moment().tz("America/Sao_Paulo").format();

        admin.database().ref('/'.concat(entity_scheduling)).push({
            type: req.body.type,
            physician: req.body.physician,
            patient: req.body.patient,
            status: req.body.status,
            scheduledTo: req.body.scheduledTo,
            createdAt: create
        }).then(snapshot => {
            res.status(200).json({
                uid: snapshot.key,
                createdAt: create
            });
        });
    }
});

api.get('/getSchedulings', (req, res) => {
    var db;
    if (req.query.uid === undefined) {
        db = admin.database().ref(entity_specialty);
    } else {
        db = admin.database().ref(entity_specialty).child(req.query.uid);
    }
    db.once('value').then(function(snap) {

        res.status(200).json(snapshotToArray(snap));
    });
});

/**
 * @param query {uid?String}
 * @returns Returns list or unique physician.
 */
api.get('/getPhysicians', (req, res) => {
    var db;
    if (req.query.uid === undefined) {
        db = admin.database().ref(entity_physicians);
    } else {
        db = admin.database().ref(entity_physicians).child(req.query.uid);
    }
    db.once('value').then(function(snap) {

        res.status(200).json(snapshotToArray(snap));
    });
});

exports.api = functions.https.onRequest(api);

exports.getSpecialties = functions.https.onRequest((req, res) => {
    var db;
    if (req.query.uid === undefined) {
        db = admin.database().ref(entity_specialty);
        db.once('value').then(function(snap) {
            res.status(200).json(snapshotToArray(snap));
        });
    }
});

exports.addUser = functions.https.onRequest((req, res) => {
    if (req.body === undefined) {
        res.status(400).json({ type: 'error', message: 'No user defined!' });
    } else {
        let ref = admin.database().ref(entity_user);
        let create = moment().tz("America/Sao_Paulo").format();
        ref.child(req.body.uid)
            .set({
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                gender: req.body.gender,
                loginType: req.body.loginType,
                fcmToken: req.body.fcmToken,
                photoUrl: req.body.photoUrl,
                isFirstAccess: req.body.isFirstAccess,
                isEmailVerified: req.body.isEmailVerified,
                createdAt: create
            }).then(snapshot => {
                res.status(200).json({
                    uid: req.body.uid,
                    createdAt: create
                });
            });;
    }
});

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.uid = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

/** TODO:
 * const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.foo = functions.database.ref('/bar').onWrite(event => {
  const tokens = ...;
  const payload = ...;
  return return admin.messaging().sendToDevice(tokens, payload);  
})
 * 
 */
# **POST** - **/api/addSpecialty**

**Description**

Uses to add new specialty.

**Request**
- Content-Type : Application/json
- Authorization: Bearer + auth_token
- Body parameters:
```json
{
    "name": "Pediatra"
}
```
**Response**
- Content-Type : Application/json
- Body response:
```json
{
    "uid": "-LAZ0b7vEyk7XlMOKkg6",
    "createdAt": "2018-04-20T14:07:30-03:00"
}
```

# **GET** - **/getSpecialties**

**Description**

Uses to get specialties.

**Request**
- Content-Type : Application/json
- Query parameters:
    - uid (optional)

**Response**
- Content-Type : Application/json
- Body response (**passed the parameter**):
```json
{
    "uid": "-LAZ0b7vEyk7XlMOKkg6",
    "createdAt": "2018-04-20T14:07:30-03:00"
}
```
- Body response (**did not pass the parameter**):
```json
[
    {
        "createdAt": "2018-04-20T14:05:42-03:00",
        "name": "Cardiologista",
        "uid": "-LAZ0CK7_Ez9fe8ZfhJY"
    },
    {
        "createdAt": "2018-04-20T14:07:30-03:00",
        "name": "Pediatra",
        "uid": "-LAZ0b7vEyk7XlMOKkg6"
    }
]
```

# **POST** - **/api/addPhysician**

**Description**

Uses to add new phycisian.

**Request**
- Content-Type : Application/json
- Authorization: Bearer + auth_token
- Body parameters:
```json
{   
	"name": "Dr. Name",
	"gender":"female",
	"specialty" : [
		{	
			"name": "Pediatra",
        	"uid": "-LAZ0b7vEyk7XlMOKkg6"
		}
	],
	"crm": "PR8765-1",
	"about": "Especialista em pediatria. Especialista em recém nascidos.",
	"accept_insurance": false,
	"accept_card": true,
	"accept_money": true
}
```
**Response**
- Content-Type : Application/json
- Body response:
```json
{
    "uid": "-LAZU9csqO3i-zepX8ea",
    "createdAt": "2018-04-20T16:16:37-03:00"
}
```

# **GET** - **/api/getPhysicians**

**Description**

Uses to get physicians.

**Request**
- Content-Type : Application/json
- Authorization: Bearer + auth_token
- Query parameters:
    - non parameters (optional)

**Response**
- Content-Type : Application/json
- Body response:
```json
[
    {
        "about": "Especialista em pediatria com espelicalidade em ortopediatria",
        "accept_card": true,
        "accept_insurance": true,
        "accept_money": true,
        "createdAt": "2018-04-20T16:05:23-03:00",
        "crm": "SC87589-9",
        "gender": "male",
        "name": "Dr. Arthur Cordova Stapassoli",
        "specialty": [
            {
                "name": "Cardiologista",
                "uid": "-LAZ0CK7_Ez9fe8ZfhJY"
            },
            {
                "name": "Pediatra",
                "uid": "-LAZ0b7vEyk7XlMOKkg6"
            }
        ],
        "uid": "-LAZRa2Wu36d__yRNQtA"
    }
]
```
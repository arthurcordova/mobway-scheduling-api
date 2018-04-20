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
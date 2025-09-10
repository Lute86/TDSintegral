Proyecto backend para "Desarrollo web (back)"





Api calls validas

http://localhost:3000/dashboard/myprofile/1
{
  "status": 200,
  "statusMsg": "Successful petition",
  "data": {
    "id": 1,
    "nombre": "Ana"
  }
}

http://localhost:3000/dashboard/profiles
{
  "status": 200,
  "statusMsg": "Successful petition",
  "data": [
    {
      "id": 1,
      "nombre": "Ana"
    },
    {
      "id": 2,
      "nombre": "Juan"
    }
  ]
}
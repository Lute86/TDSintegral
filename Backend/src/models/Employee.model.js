//To Do -> 2da entrega
//Validaciones
//Modificar json por MongoDB

export class Employee{
    constructor(id, nombre){//apellido, email, telefono, password
        this.id = id;
        this.nombre = nombre;
    }

    
    toJSON(){
        return {
            id: this.id,
            nombre: this.nombre,
            //etc
        }
    }
}
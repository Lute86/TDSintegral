export class Employee{
  //  Rol: administrador, consultor, supervisor.
  //  Área: SEO/SEM, Social Media, Contenidos, Administración.
  // To do agregar campos: apellido, email, telefono, rol, area, password
  constructor(id, nombre){
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
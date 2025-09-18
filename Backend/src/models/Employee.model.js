export class Employee{
  //  Rol: administrador, consultor, supervisor.
  //  Área: SEO/SEM, Social Media, Contenidos, Administración.
  constructor(id, nombre, apellido = '', email = '', telefono = '', rol = '', area = '', password = ''){
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.rol = rol;
        this.area = area;
        this.password = password;
    }

    
    toJSON(){
        return {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            telefono: this.telefono,
            rol: this.rol,
            area: this.area,
            // No incluir password por seguridad
        }
    }
}
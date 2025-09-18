import { Employee } from "../models/Employee.model.js"

export class EmployeeService{

    static employees = [
        new Employee(1, 'Ana'),
        new Employee(2, 'Juan')
    ];

    static async getAll (){
        try {
            return EmployeeService.employees.map(e => e.toJSON())
        } catch (error) {
            throw new Error("Error del servidor");
        }
    }

    static async getById(id){
        try {
            const employee = EmployeeService.employees.find(e => e.id == id);
            if (!employee) throw new Error("No autorizado");
            return employee.toJSON();
        } catch (error) {
            throw new Error("Error del servidor");
        }
    }

    static async create(employeeData){
        try {
            // Validar datos requeridos
            if (!employeeData.nombre || !employeeData.email) {
                throw new Error("Datos incompletos");
            }

            // Verificar si el email ya existe
            const existingEmployee = EmployeeService.employees.find(e => e.email === employeeData.email);
            if (existingEmployee) {
                throw new Error("Email ya existe");
            }

            // Generar nuevo ID
            const newId = Math.max(...EmployeeService.employees.map(e => e.id)) + 1;

            // Crear nuevo empleado
            const newEmployee = new Employee(
                newId,
                employeeData.nombre,
                employeeData.apellido || '',
                employeeData.email,
                employeeData.telefono || '',
                employeeData.rol || '',
                employeeData.area || '',
                employeeData.password || ''
            );

            // Agregar a la lista
            EmployeeService.employees.push(newEmployee);

            return newEmployee.toJSON();
        } catch (error) {
            throw error;
        }
    }

    static async updatePut(id, employeeData){
        try {
            // Validar datos requeridos
            if (!employeeData.nombre || !employeeData.email) {
                throw new Error("Datos incompletos");
            }

            const employeeIndex = EmployeeService.employees.findIndex(e => e.id == id);
            if (employeeIndex === -1) throw new Error("Empleado no encontrado");

            // Verificar si el email ya existe en otro empleado
            const existingEmployee = EmployeeService.employees.find(e => e.email === employeeData.email && e.id != id);
            if (existingEmployee) {
                throw new Error("Email ya existe");
            }

            // Actualizar completamente el empleado
            const employee = EmployeeService.employees[employeeIndex];
            employee.nombre = employeeData.nombre;
            employee.apellido = employeeData.apellido || '';
            employee.email = employeeData.email;
            employee.telefono = employeeData.telefono || '';
            employee.rol = employeeData.rol || '';
            employee.area = employeeData.area || '';
            employee.password = employeeData.password || '';

            return employee.toJSON();
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData){
        try {
            const employeeIndex = EmployeeService.employees.findIndex(e => e.id == id);
            if (employeeIndex === -1) throw new Error("Empleado no encontrado");
            
            const employee = EmployeeService.employees[employeeIndex];
            
            // Actualizar solo los campos que se envían en el body
            Object.keys(updateData).forEach(key => {
                if (employee.hasOwnProperty(key)) {
                    employee[key] = updateData[key];
                }
            });
            
            return employee.toJSON();
        } catch (error) {
            throw error;
        }
    }


    static async deleteById(id) { // Servicio DELETE
    try {
        const index = EmployeeService.employees.findIndex(e => e.id == id);
        if (index === -1) return null;

        const deleted = EmployeeService.employees.splice(index, 1)[0];
        return deleted.toJSON();
    } catch (error) {
        throw new Error("Error del servidor");
    }
    }
}
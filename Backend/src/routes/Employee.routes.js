import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";

export class EmployeeRoutes{
    
    static getRouter(){
        const router = Router();

        //rutas
        router.get('/profiles', EmployeeController.getAll) // => solo para probar. Pertenece a admin
        router.get('/myprofile/:id', EmployeeController.getById)
        router.post('/profiles', EmployeeController.create)
        router.put('/myprofile/:id', EmployeeController.updatePut)
        router.patch('/myprofile/:id', EmployeeController.update)
        // Agregar delete

        return router;
    }
}
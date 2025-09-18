import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";

export class EmployeeRoutes{
    
    static getRouter(){
        const router = Router();

        //rutas
        router.get('/profiles', EmployeeController.getAll) // => solo para probar. Pertenece a admin
        router.get('/myprofile/:id', EmployeeController.getById)
        // Agregar post,put, patch, delete

        return router;
    }
}
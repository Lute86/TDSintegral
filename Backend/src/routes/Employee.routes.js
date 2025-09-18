import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";

export class EmployeeRoutes{
    
    static getRouter(){
        const router = Router();

        //rutas
        router.get('/profiles', EmployeeController.getAll) // => solo para probar. Pertenece a admin
        router.get('/myprofile/:id', EmployeeController.getById)
        // Agregar post,put, patch, delete

        router.delete('/employee/:id', EmployeeController.deleteById); // ✅ DELETE

        router.get('/views', async (req, res) => {
        try {
        const employees = await EmployeeController.getAllRaw(); // método especial para vista pug
        res.render('index', { employees });
        } 
        catch (error) {
        res.status(500).send('Error al cargar la vista');
    }
    });

        return router;
    

        
    }
}


import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";
import methodOverride from "method-override";
import { EmployeeValidator } from "../middlewares/validators/employee.validator.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";

const auth = [AuthMiddleware.authorize("administrador", "supervisor")];

 class EmployeeRoutes{
    
    static getRouter(){
        const router = Router();
        //rutas
        router.get('/profiles', auth, EmployeeController.getAll)
        router.get('/myprofile/:id', EmployeeController.getById)
        router.post('/register', auth, EmployeeValidator.validateCreate, EmployeeController.create)
        router.put('/myprofile/:id', EmployeeController.updatePut)
        router.patch('/myprofile/:id', EmployeeController.update)
        router.delete('/employee/:id', EmployeeController.deleteById); 

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

export default EmployeeRoutes;
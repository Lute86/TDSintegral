import { Router } from "express";
import { EmployeeController } from "../controllers/Employee.controller.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

 class AuthRoutes{
    
    static getRouter(){
        const router = Router();
        //rutas
        router.post("/login", AuthValidator.validateLogin, AuthController.login);   
        
        return router;
    };
    
}

export default EmployeeRoutes;
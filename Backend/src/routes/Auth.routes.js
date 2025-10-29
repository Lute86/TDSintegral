import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller.js";
import { AuthValidator } from "../middlewares/validators/auth.validator.js";

 class AuthRoutes{
    
    static getRouter(){
        const router = Router();
        //rutas
        router.post("/login", AuthValidator.validateLogin, AuthController.login);   
        
        return router;
    };
    
}

export default AuthRoutes;
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from "./DB.config.js";
import ClientRoutes from "../routes/Client.routes.js";
import EmployeeRoutes from "../routes/Employee.routes.js";
import ProjectRoutes from "../routes/Project.routes.js";
import TaskRoutes from "../routes/Task.routes.js";
import HttpResponse from "../utils/HttpResponse.utils.js";
import methodOverride from "method-override";
import { Passport } from "../config/Passport.config.js";
import { AuthValidator } from "../middlewares/validators/auth.validator.js";
import { AuthController } from "../controllers/Auth.controller.js";
import AuthRoutes from "../routes/Auth.routes.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";


export class Server{
  constructor(){
      this.app = express();
      this.port = process.env.PORT || 3000;
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      this.app.set('views', path.join(__dirname, '../views')); // o '../src/views' si corresponde
      this.app.set('view engine', 'pug'); // permite el uso del pug
      this.middlewares();
      this.routes();      
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true })); // necesario para <form>
    this.app.use(methodOverride('_method')); // habilita PUT/DELETE en formularios
  
    // Inicializar Passport
    const passportConfig = new Passport(process.env.JWT_SECRET);
    this.app.use(passportConfig.initialize());
  }

  routes() {
    // Endpoints públicos
    this.app.use("/auth", AuthValidator.validateLogin, AuthRoutes.getRouter());
  
    this.app.use("/client", ClientRoutes.getRouter());
    
    // Endpoints protegidos
    const auth = [Passport.authenticate(), AuthMiddleware.authorize("administrador", "supervisor", "consultor")];

    this.app.use("/employee", auth, EmployeeRoutes.getRouter());
    this.app.use("/project", auth, ProjectRoutes.getRouter());
    this.app.use("/task", auth, TaskRoutes.getRouter());
    // Vistas o dashboard
    this.app.use('/dashboard', auth, EmployeeRoutes.getRouter());

    //Estado servidor
    this.app.use("/ping", (req, res) => HttpResponse.success(res, { ok: true }));
 
    //404
    this.app.use((req, res) =>
      HttpResponse.notFound(res, `La ruta ${req.path} no existe`)
    );
  }


  async listen() {
    await connectDB();
    this.app.listen(this.port, () => {
      console.log(` Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}
    
    





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
import { Passport } from "./Passport.config.js";
import { AuthValidator } from "../middlewares/validators/auth.validator.js";
import { AuthController } from "../controllers/Auth.controller.js";
import AuthRoutes from "../routes/Auth.routes.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";
import cookieParser from "cookie-parser";
import { Project } from "../models/Project.model.js";
import { Task } from "../models/Task.model.js";
import { Employee } from "../models/Employee.model.js";

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

  this.app.use(cookieParser());
  // Inicializar Passport
  const passportConfig = new Passport(process.env.JWT_SECRET);
  this.app.use(passportConfig.initialize());

  //lo que esté en /src/public puede ser accedido por el navegador
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  this.app.use(express.static(path.join(__dirname, "../public")));

  }

  routes() {
    // Endpoints públicos
  //  this.app.use("/auth", AuthValidator.validateLogin, AuthRoutes.getRouter());
    this.app.use("/client", ClientRoutes.getRouter());

    // Rutas públicas (landing y login/logout)
     this.app.use("/auth", AuthRoutes.getRouter()); 

    // Landing page pública
    this.app.get('/', (req, res) => {
      res.render('landingpage');
    });
    

    // Endpoints protegidos
    const auth = [Passport.authenticate(),AuthMiddleware.authorize("administrador", "empleado", "cliente")];
    const authEmpleados = [Passport.authenticate(),AuthMiddleware.authorize("administrador", "empleado")];
    const authAdmin = [Passport.authenticate(),AuthMiddleware.authorize("administrador")];

    this.app.use("/employee", auth , EmployeeRoutes.getRouter());//auth,
    this.app.use("/project",  auth ,ProjectRoutes.getRouter());// auth,
    this.app.use("/task",  auth ,TaskRoutes.getRouter());//auth,

    
      this.app.get("/dashboard",Passport.authenticate(), AuthMiddleware.authorize("administrador", "empleado"),
      async (req, res) => {
        try {
          const user = req.user;

          // Si es administrador, muestra todo
          let proyectos = [];
          let tareas = [];
          let empleados = [];

          if (user.rol === "administrador") {
            proyectos = await Project.find().populate("clienteId").lean();
            tareas = await Task.find().populate("empleados").lean();
            empleados = await Employee.find().lean();
          }

          // Si es empleado, solo sus proyectos y tareas asignadas
          if (user.rol === "empleado") {
            proyectos = await Project.find({ empleados: user.id })
              .populate("clienteId")
              .lean();
            tareas = await Task.find({ empleados: user.id })
              .populate("project")
              .lean();
          }

          res.render("dashboardempleados", {
            title: "Mi Dashboard",
            user,
            proyectos,
            tareas,
            empleados, 
          });
        } catch (error) {
          console.error("Error al cargar dashboard:", error);
          res.status(500).render("error", {
            message: "Error al cargar el dashboard",
          });
        }
      }
    );

    // Estado del servidor
    this.app.use("/ping", (req, res) => HttpResponse.success(res, { ok: true }));

    // 404
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
    
    





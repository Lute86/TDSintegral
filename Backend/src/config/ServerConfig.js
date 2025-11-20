import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from "./DB.config.js";
import ClientRoutes from "../routes/Client.routes.js";
import EmployeeRoutes from "../routes/Employee.routes.js";
import ProjectRoutes from "../routes/Project.routes.js";
import TaskRoutes from "../routes/Task.routes.js";
import ContactRoutes from "../routes/Contact.routes.js";
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
import { Client } from "../models/Client.model.js";
import { Employee } from "../models/Employee.model.js";
import { Contact } from "../models/Contact.model.js";

export class Server{
  constructor(){
      this.app = express();
      this.port = process.env.PORT || 3000;
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      this.app.set('views', path.join(__dirname, '../views'));
      this.app.set('view engine', 'pug');
      this.middlewares();
      this.routes();      
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(methodOverride('_method'));
    this.app.use(cookieParser());
    
    // Inicializar Passport
    const passportConfig = new Passport(process.env.JWT_SECRET);
    this.app.use(passportConfig.initialize());
    
    // Archivos estáticos
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    this.app.use(express.static(path.join(__dirname, "../public")));
  }

  routes() {
    // Endpoints públicos
    this.app.use("/client", ClientRoutes.getRouter());
    this.app.use("/clientes", ContactRoutes.getRouter());
    this.app.use("/auth", AuthRoutes.getRouter()); 

    // Landing page pública
    this.app.get('/', (req, res) => {
      res.render('landingpage');
    });
    
    // Endpoints protegidos
    const auth = [Passport.authenticate(), AuthMiddleware.authorize("administrador", "empleado", "cliente")];
    const authEmpleados = [Passport.authenticate(), AuthMiddleware.authorize("administrador", "empleado")];
    const authAdmin = [Passport.authenticate(), AuthMiddleware.authorize("administrador")];

    this.app.use("/employee", EmployeeRoutes.getRouter());
    this.app.use("/project", ProjectRoutes.getRouter());
    this.app.use("/tasks", TaskRoutes.getRouter());
    this.app.use("/contacts", ContactRoutes.getRouter());

    // ========== DASHBOARD (CON CONSULTAS) ==========
    this.app.get(
      "/dashboard",
      Passport.authenticate(),
      AuthMiddleware.authorize("administrador", "empleado"),
      async (req, res) => {
        try {
          const user = req.user;

          let proyectos = [];
          let tareas = [];
          let clientes = [];
          let empleados = [];
          let consultas = [];
          let metricas = {
            tareasPendientes: 0,
            tareasEnProceso: 0,
            tareasFinalizadas: 0,
            totalTareas: 0
          };

          if (user.rol === "administrador") {
            proyectos = await Project.find().populate("clienteId").lean();
            tareas = await Task.find().populate("empleados").populate("project").lean();
            clientes = await Client.find().lean();
            empleados = await Employee.find().lean();
            consultas = await Contact.find().sort({ createdAt: -1 }).lean();

            // Calcular métricas
            metricas.totalTareas = tareas.length;
            metricas.tareasPendientes = tareas.filter(t => t.estado === 'pendiente').length;
            metricas.tareasEnProceso = tareas.filter(t => t.estado === 'en proceso').length;
            metricas.tareasFinalizadas = tareas.filter(t => t.estado === 'finalizada').length;
          }

          if (user.rol === "empleado") {
            proyectos = await Project.find({ empleados: user.id })
              .populate("clienteId")
              .lean();

            tareas = await Task.find({ empleados: user.id })
              .populate("project")
              .lean();

            // Calcular métricas para empleado
            metricas.totalTareas = tareas.length;
            metricas.tareasPendientes = tareas.filter(t => t.estado === 'pendiente').length;
            metricas.tareasEnProceso = tareas.filter(t => t.estado === 'en proceso').length;
            metricas.tareasFinalizadas = tareas.filter(t => t.estado === 'finalizada').length;
          }

          console.log('📊 Dashboard cargado:', {
            proyectos: proyectos.length,
            tareas: tareas.length,
            empleados: empleados.length,
            consultas: consultas.length
          });

          res.render("dashboardempleados", {
            title: "Mi Dashboard",
            user,
            proyectos,
            tareas,
            clientes,
            empleados,
            consultas,
            metricas
          });
        } catch (error) {
          console.error("❌ Error al cargar dashboard:", error);
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
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from "./DB.config.js";
import ClientRoutes from "../routes/Client.routes.js";
import EmployeeRoutes from "../routes/Employee.routes.js";
import ProjectRoutes from "../routes/Project.routes.js";
import TaskRoutes from "../routes/Task.routes.js";
import ContactRoutes from "../routes/Contact.routes.js";
import AuthRoutes from "../routes/Auth.routes.js";
import HttpResponse from "../utils/HttpResponse.utils.js";
import methodOverride from "method-override";
import { Passport } from "./Passport.config.js";
import { AuthMiddleware } from "../middlewares/auth/Auth.middleware.js";
import { DashboardController } from "../controllers/Dashboard.controller.js";
import cookieParser from "cookie-parser";

export class Server {
  constructor() {
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
    // ========== RUTAS PÚBLICAS ==========
    this.app.get('/', (req, res) => res.render('landingpage'));
    this.app.use("/auth", AuthRoutes.getRouter());
    this.app.use("/clientes", ContactRoutes.getRouter());

    // ========== RUTAS PROTEGIDAS ==========
    this.app.use("/client", ClientRoutes.getRouter());
    this.app.use("/employee", EmployeeRoutes.getRouter());
    this.app.use("/project", ProjectRoutes.getRouter());
    this.app.use("/tasks", TaskRoutes.getRouter());
    this.app.use("/contacts", ContactRoutes.getRouter());

    // ========== DASHBOARD ==========
    this.app.get(
      "/dashboard",
      Passport.authenticate(),
      AuthMiddleware.authorize("administrador", "empleado"),
      DashboardController.renderDashboard
    );

    // ========== UTILIDADES ==========
    this.app.use("/ping", (req, res) => HttpResponse.success(res, { ok: true }));

    // ========== 404 ==========
    this.app.use((req, res) =>
      HttpResponse.notFound(res, `La ruta ${req.path} no existe`)
    );
  }

  async listen() {
    await connectDB();
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}
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
    }

  /* routes() {
    this.app.use("/client", ClientRoutes);
    //this.app.use("/employee", EmployeeRoutes);
    this.app.use("/employee", EmployeeRoutes.getRouter());
    this.app.use("/project", ProjectRoutes);
    this.app.use('/dashboard', EmployeeRoutes.getRouter()); // ruta del dashboard
    this.app.use((req, res) => HttpResponse.notFound(res, `La ruta${req.path} no existe`))<
    this.app.get("/ping", (req, res) => res.json({ ok: true }));

  }
  */



routes() {
  this.app.use("/client", ClientRoutes.getRouter());
  this.app.use("/employee", EmployeeRoutes.getRouter());
  this.app.use("/project", ProjectRoutes.getRouter());
  //this.app.use("/task", TaskRoutes.getRouter());
  // Vistas o dashboard
  this.app.use('/dashboard', EmployeeRoutes.getRouter());
  this.app.use((req, res) =>
    HttpResponse.notFound(res, `La ruta ${req.path} no existe`)
  );

  this.app.get("/ping", (req, res) => res.json({ ok: true }));
}


  async listen() {
    await connectDB();
    this.app.listen(this.port, () => {
      console.log(` Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}
    
    





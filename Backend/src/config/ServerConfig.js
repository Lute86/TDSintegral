import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from "./DB.config.js";
import ClientRoutes from "../routes/Client.routes.js";
//import { EmployeeRoutes } from "../routes/Employee.routes.js";
import EmployeeRoutes from "../routes/Employee.routes.js";
import ProjectRoutes from "../routes/Project.routes.js";
import HttpResponse from "../utils/HttpResponse.utils.js";



export class Server{
    constructor(){
        this.app = express();
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        this.app.set('views', path.join(__dirname, '../views')); // o '../src/views' si corresponde
        this.app.set('view engine', 'pug'); // permite el uso del pug
        this.port = process.env.PORT || 3000;
        this.middlewares();
        this.routes();      
    }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/client", ClientRoutes);
    this.app.use("/employee", EmployeeRoutes);
    //this.app.use("/employee", EmployeeRoutes.getRouter());
    this.app.use("/project", ProjectRoutes);
    //this.app.use('/dashboard', EmployeeRoutes.getRouter());
    this.app.use('/dashboard', EmployeeRoutes); // ruta del dashboard
    this.app.use((req, res) => HttpResponse.notFound(res, `La ruta${req.path} no existe`))
  }

  async listen() {
    await connectDB();
    this.app.listen(this.port, () => {
      console.log(` Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}
    
    



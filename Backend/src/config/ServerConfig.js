import express from "express";
import { connectDB } from "./DB.config.js";
import ClientRoutes from "../routes/Client.routes.js";
import EmployeeRoutes from "../routes/Employee.routes.js";
import ProjectRoutes from "../routes/Project.routes.js";
import HttpResponse from "../utils/HttpResponse.utils.js";


export class Server {
  constructor() {
    this.app = express();
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
    this.app.use("/project", ProjectRoutes);
    this.app.use((req, res) => HttpResponse.notFound(res, `La ruta${req.path} no existe`))
  }

  async listen() {
    await connectDB();
    this.app.listen(this.port, () => {
      console.log(` Servidor corriendo en http://localhost:${this.port}`);
    });
  }

}
        


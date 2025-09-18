import express from "express";
import { connectDB } from "./DB.config.js";
import ClientRoutes from "../routes/Client.routes.js";
import EmployeeRoutes from "../routes/Employee.routes.js";
import ProjectRoutes from "../routes/Project.routes.js";

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
  }

  async listen() {
    await connectDB();
    this.app.listen(this.port, () => {
      console.log(` Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}

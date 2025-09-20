import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import EmployeeRoutes from '../routes/Employee.routes.js';
import HttpResponse from '../utils/HttpResponse.utils.js';

export class Server {
  constructor() {
    this.app = express();
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'pug');
    this.port = process.env.PORT || 3000;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(methodOverride('_method'));
  }

  routes() {
    this.app.use('/', EmployeeRoutes.getRouter());
    this.app.use((req, res) => HttpResponse.notFound(res, `La ruta ${req.path} no existe`));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}

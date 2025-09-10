import express from 'express';
import { EmployeeRoutes } from '../routes/Employee.routes.js';
import HttpResponse from '../middlewares/HttpResponse.mdw.js';

export class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(express.json());
    }

    routes(){
        this.app.use('/dashboard', EmployeeRoutes.getRouter());
        this.app.use((req, res) => HttpResponse.notFound(res, `La ruta${req.path} no existe`))
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en http://localhost:${this.port}`);
        })
    }
}
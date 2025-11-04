import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import EmployeeRoutes from '../routes/Employee.routes.js';
import HttpResponse from '../utils/HttpResponse.utils.js';

// --- Imports needed ---
import ClientRoutes from '../routes/Client.routes.js';
import ProjectRoutes from '../routes/Project.routes.js';
import { connectDB } from './DB.config.js'; // Make sure this path is correct

export class Server {
  constructor() {
    this.app = express();
    // Use 'this.__dirname' for class-wide access
    this.__dirname = path.dirname(fileURLToPath(import.meta.url));

    // --- Correct path to 'views' (2 levels up) ---
    this.app.set('views', path.join(this.__dirname, '../views')); 
    
    this.app.set('view engine', 'pug');
    this.port = process.env.PORT || 3000;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // --- Correct path to 'public' (2 levels up) ---
    this.app.use(express.static(path.join(this.__dirname, '../../public')));

    this.app.use(methodOverride('_method'));
  }

  routes() {

    // --- Route for simple landing page ---
    this.app.get('/landing', (req, res) => {
      res.render('landingpage'); 
    });

    // --- Route for simple dashboard page ---
    this.app.get('/dashboard', (req, res) => {
      // Render the simple PUG (no data needed)
      res.render('dashboardempleados'); 
    });
    
    // --- API Routes ---
    this.app.use('/client', ClientRoutes);
    this.app.use('/project', ProjectRoutes);
    this.app.use('/employee', EmployeeRoutes.getRouter());

    // --- 404 Handler (MUST be last) ---
    this.app.use((req, res) => HttpResponse.notFound(res, `La ruta ${req.path} no existe`));
  }

  // Ensure this is async
  async listen() {
    // Call DB connection
    await connectDB();
    
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}
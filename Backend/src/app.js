import dotenv from 'dotenv';
import { Server } from "./config/ServerConfig.js";

dotenv.config();
const server = new Server();
// Exportamos la instancia de Express (el objeto 'app') directamente
// para que Supertest pueda simular las peticiones HTTP en el test.
export const app = server.getApp();
//server.listen();


// para cargar los datos desde el seed.js ejecutar desde terminal: node seed.js
// desde si npm run dev
//  si no conecta mongo probar en powershell: mongod --dbpath "C:\data\db"

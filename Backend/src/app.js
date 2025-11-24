import dotenv from 'dotenv';
dotenv.config();
import { Server } from "./config/ServerConfig.js";

const server = new Server();
server.listen();


// para cargar los datos desde el seed.js ejecutar desde terminal: node seed.js
// desde si npm run dev
//  si no conecta mongo probar en powershell: mongod --dbpath "C:\data\db"



import { Server } from "./config/ServerConfig.js";
import express from 'express';
import methodOverride from 'method-override'; // Botones PUG
import path from 'path';

import { Server } from "./config/Server.config.js";


const server = new Server();
server.listen();


// para cargar los datos desde el seed.js ejecutar desde terminal: node seed.js
// desde si npm run dev
//  si no conecta mongo probar en powershell: mongod --dbpath "C:\data\db"

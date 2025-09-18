import { Server } from "./config/ServerConfig.js";

const server = new Server();
server.listen();


//  si no conecta mongo probar en powershell: mongod --dbpath "C:\data\db"
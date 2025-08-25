const userController = require("./users.controller")
const authController = require("./auth.controller")

//Exportamos los controladores para que puedan ser utilizados desde el index
module.exports = { userController, authController }
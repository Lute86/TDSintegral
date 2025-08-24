const { sequelize } = require("../config/sqlite.config");
const { DataTypes } = require("sequelize");
const mongoose = require("mongoose");

// Función para normalizar usuarios
function normalize(user) {
  if (!user) return null;
  if (user.dataValues) {
    // Normaliza un objeto de Sequelize
    return {
      id: user.dataValues.id.toString(),
      ...user.dataValues,
    };
  } else if (user.toObject) {
    // Normaliza un documento de Mongoose
    const userObj = user.toObject();
    return {
      id: userObj._id.toString(),
      ...userObj,
    };
  } else if (user._id) {
    // Normaliza un objeto plano de MongoDB
    return {
      id: user._id.toString(),
      ...user,
    };
  }
  // Si ya es un objeto normalizado, devuélvelo tal cual
  return user;
}

let UserProvider;

if (process.env.DB_CLIENT === "sqlite") {
  const User = sequelize.define("Users", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    dni: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: "User" },
    password: DataTypes.STRING,
  }, {
    paranoid: true,
    timestamps: true,
  });

  UserProvider = {
    create: async (data) => normalize(await User.create(data)),
    findById: async (id) => normalize(await User.findByPk(id)),
    findAll: async () => (await User.findAll()).map(normalize),
    findOne: async (query) => normalize(await User.findOne({ where: query })),
    update: async (id, updates) => {
      const user = await User.findByPk(id);
      return user ? normalize(await user.update(updates)) : null;
    },
    delete: (id) => User.destroy({ where: { id } }),
    //restore: (id) => User.restore({ where: { id } }),
  };
} else if (process.env.DB_CLIENT === "mongo") {
  const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: { type: String, unique: true },
    dni: String,
    role: { type: String, default: "User" },
    password: String,
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", userSchema);

  UserProvider = {
    create: async (data) => normalize(await User.create(data)),
    findById: async (id) => normalize(await User.findById(id)),
    findAll: async () => (await User.find()).map(normalize),
    findOne: async (query) => normalize(await User.findOne(query)),
    update: async (id, updates) => normalize(await User.findByIdAndUpdate(id, updates, { new: true })),
    delete: (id) => User.findByIdAndDelete(id),
    //restore: async () => { throw new Error("Restore not supported in MongoDB"); },
  };
}

module.exports = UserProvider;

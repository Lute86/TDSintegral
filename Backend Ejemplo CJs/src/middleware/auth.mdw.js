const jwt = require("jsonwebtoken");
const HttpResponse = require("../handlers/HttpResponse");
require("dotenv").config();

// Authenticate JWT token
function authenticateToken(req, res, next) {
  let cookieToken;
  let headerToken;
  try {
    cookieToken = req.cookies?.jwt;
  } catch (_) {}
  try {
    headerToken = req.headers.authorization?.split(" ")[1];
  } catch (_) {}
  const token = cookieToken || headerToken;
  console.log(token);
  if (!token) {
    return HttpResponse.unauthorized(res, { message: "No autorizado" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return HttpResponse.unauthorized(res, { message: "Sesión inválida" });
  }
}


const { ObjectId } = require('mongoose').Types;

function authorizeToken(req, res, next) {
  try {
    const userIdFromToken = req.user.id; // ObjectId o string
    const requestedUserId = req.params.userId; // String

    // Si userIdFromToken es un ObjectId, conviértelo a string
    const tokenUserId = userIdFromToken instanceof ObjectId
      ? userIdFromToken.toString()
      : String(userIdFromToken);
    console.log("Token id: ",tokenUserId);
    console.log("id: ", requestedUserId);
    
    // Compara los IDs como strings
    if (tokenUserId !== requestedUserId) {
      return HttpResponse.forbidden(res, { message: "Prohibido - no puedes acceder a este recurso" });
    }

    next();
  } catch (error) {
    return HttpResponse.badRequest(res, { message: "ID de usuario inválido" });
  }
}


// ----------------------------
// Check if user is Admin
// ----------------------------
function isAdmin(req, res, next) {
  if (!req.user) {
    return HttpResponse.unauthorized(res, { message: "No autorizado" });
  }

  if (req.user.role !== "Admin") {
    return HttpResponse.forbidden(res, { message: "User not Admin" });
  }

  next();
}

// Create token
function createToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  try {
    const token = jwt.sign(payload, process.env.SESSION_SECRET, {
      expiresIn: "2h",
    });
    return token;
  } catch (error) {
    console.error("Error al generar el token:", error);
    throw error;
  }
}

module.exports = { authenticateToken, authorizeToken, createToken, isAdmin };

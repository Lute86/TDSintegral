import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'admin123'; 
const TOKEN_EXPIRY = '1d'; 

/**
 * Genera un JSON Web Token (JWT) para un empleado.
 * @param {string | mongoose.Types.ObjectId} employeeId - El ID del empleado.
 * @returns {string} El token JWT generado.
 */
export const generateToken = (employeeId) => {
    const payload = {
        id: employeeId,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

/**
 * Verifica un token JWT.
 * @param {string} token - El token JWT.
 * @returns {object | null} El payload decodificado si es válido, o null si es inválido.
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null; 
    }
};
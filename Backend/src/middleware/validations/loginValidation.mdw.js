const { check } = require("express-validator");
const checkValidationResult = require("./validator");

const validateName = check(
  "nombre",
  "El nombre es requerido y solo acepta letras sin espacios entremedio"
)
  .trim()
  //.notEmpty()//.withMessage('El nombre es requerido')
  .isAlpha(); //.withMessage('Solo letras')

const validateLastName = check(
  "apellido",
  "El apellido es requerido y solo acepta letras sin espacios entremedio"
)
  .trim()
  .isAlpha();

const validateDNI = check("dni", "El dni tiene que ser numérico. 9 numeros min")
  .trim()
  .isInt()
  .isLength({ min: 7 })
  

const validateCuil = check("cuil", "El cuil tiene que ser numérico. 9 numeros min")
  .trim()
  .isInt()
  .isLength({ min: 9 })
  .optional();

const validateTutorial = check("tutorial")
  .isBoolean()
  .withMessage("Tutorial true/false")
  .optional();

const validateEmail = check("email")
  .trim()
  .isEmail()
  .withMessage("Email invalido");

const validatePassword = check("password")
  .trim()
  .matches(/^(?=.*[A-Z])(?=.*[0-9])(?!.*\s).{6,}$/)
  .withMessage("Contraseña de al menos 6 caracteres, 1 número y 1 letra")

const validateLogin = [validateEmail, validatePassword, checkValidationResult];

const validateRegistration = [
  validateName,
  validateLastName,
  validateDNI,
  validatePassword,
  validateEmail,
  validateCuil,
  validateTutorial,
  checkValidationResult,
];

module.exports = {
  validateLogin,
  validateRegistration,
  validateName,
  validateLastName,
  validateDNI,
  validateEmail,
  validatePassword,
  validateTutorial,
  validateCuil,
};

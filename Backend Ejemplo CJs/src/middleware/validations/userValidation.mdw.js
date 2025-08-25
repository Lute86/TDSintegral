const { check } = require("express-validator");
const checkValidationResult = require("./validator");
const {
  validateCuil,
  validateDNI,
  validateEmail,
  validateLastName,
  validateName,
  validatePassword,
  validateTutorial,
} = require("./loginValidation.mdw");

const validateNewPassword = check("newPassword")
  .trim()
  .matches(/^(?=.*[A-Z])(?=.*[0-9])(?!.*\s).{6,}$/)
  .withMessage("Contraseña de al menos 6 caracteres, 1 número y 1 letra")
  .optional();

const validateUserUpdate = [
  validateName.optional(),
  validateLastName.optional(),
  validateEmail.optional(),
  validateCuil.optional(),
  validateDNI.optional(),
  validateTutorial.optional(),
  validatePassword,
  validateNewPassword,
  checkValidationResult,
];

module.exports = { validateUserUpdate };

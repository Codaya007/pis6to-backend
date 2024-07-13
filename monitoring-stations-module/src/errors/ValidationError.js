const CustomError = require("./CustomError");

class ValidationError extends CustomError {
  constructor(message, details = null) {
    super(message, details, 400);
    this.name = "validationError";
  }
}

module.exports = ValidationError;

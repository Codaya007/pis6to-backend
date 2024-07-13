class CustomError extends Error {
  constructor(message, details = null, status = 500) {
    super(message);
    this.errorMessage = message;
    this.details = details;
    this.status = status;
  }
}

module.exports = CustomError;

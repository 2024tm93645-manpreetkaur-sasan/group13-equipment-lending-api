class AppError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', status = 500, details = null) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

class NotFoundError extends AppError {
  constructor(message, details = null) {
    super(message, 'NOT_FOUND', 404, details);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

module.exports = { AppError, NotFoundError, ValidationError };

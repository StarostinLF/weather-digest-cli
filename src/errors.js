export class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {}
export class CityNotFoundError extends AppError {}
export class NetworkError extends AppError {}
export class TimeoutError extends AppError {}
export class ParseError extends AppError {}

export class HttpError extends AppError {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

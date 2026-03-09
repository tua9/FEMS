export default class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    // Capture stack trace, excluding the constructor call itself from it.
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * A custom error class designed for handling API errors.
 * Extends the built-in `Error` class for inheritance and functionality.
 *
 * @extends Error
 *
 * @example
 * ```javascript
 * throw new ApiError(400, "Bad Request", ["Missing required parameter: name"]);
 * ```
 */
class ApiError extends Error {
  statusCode: number;

  data: null;

  success: boolean;

  errors: string[];

  constructor(
    statusCode: number,
    message = 'Something went wrong',
    errors = [],
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

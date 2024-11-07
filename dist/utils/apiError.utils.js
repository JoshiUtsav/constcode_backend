"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.InvalidCredentialsError = exports.NotFoundError = exports.BadRequestError = void 0;
class API_ERROR extends Error {
    constructor(statusCode = 500, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
class BadRequestError extends API_ERROR {
    constructor(message, errors = []) {
        super(400, message, errors);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends API_ERROR {
    constructor(message, errors = []) {
        super(404, message, errors);
    }
}
exports.NotFoundError = NotFoundError;
class InvalidCredentialsError extends API_ERROR {
    constructor(message, errors = []) {
        super(401, message, errors);
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class InternalServerError extends API_ERROR {
    constructor(message = "Internal Server Error", errors = []) {
        super(500, message, errors);
    }
}
exports.InternalServerError = InternalServerError;
exports.default = API_ERROR;

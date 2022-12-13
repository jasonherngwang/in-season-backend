"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = exports.ValidationError = void 0;
// Custom validation error
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;

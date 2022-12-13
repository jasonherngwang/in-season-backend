"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./logger"));
const user_1 = require("../models/user");
morgan_1.default.token('body', (req) => {
    const isPostOrPut = ['POST', 'PUT'].includes(req.method)
        ? JSON.stringify(req.body)
        : '';
    return isPostOrPut;
});
const requestLogger = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms :body');
const tokenExtractor = (req, _res, next) => {
    req.token = null;
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        req.token = authorization.substring(7);
    }
    return next();
};
const userExtractor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.user = null;
    if (req.token) {
        const decodedToken = jsonwebtoken_1.default.verify(req.token, process.env.SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({ error: 'token missing or invalid' });
        }
        req.user = yield user_1.UserModel.findById(decodedToken.id);
    }
    return next();
});
const unknownEndpoint = (_req, res) => res.status(404).send({ error: 'unknown endpoint' });
const errorHandler = (error, _req, res, next) => {
    logger_1.default.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    if (error.name === 'AuthenticationError') {
        return res.status(401).json({ error: error.message });
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' });
    }
    return next(error);
};
exports.default = {
    requestLogger,
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler,
};

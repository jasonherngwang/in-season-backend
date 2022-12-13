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
const express_1 = __importDefault(require("express"));
const userService_1 = __importDefault(require("../services/userService"));
const requestProcessor_1 = require("../utils/requestProcessor");
const errors_1 = require("../utils/errors");
const userRouter = express_1.default.Router();
// Get all
userRouter.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService_1.default.getUsers();
    return res.json(users);
}));
// Get one
userRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService_1.default.getUser(req.params.id);
    if (user) {
        return res.json(user);
    }
    return res.status(404).end();
}));
// Create one
userRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserEntry = (0, requestProcessor_1.toNewUserEntry)(req.body);
    const addedUser = yield userService_1.default.addUser(newUserEntry);
    return res.status(201).json(addedUser);
}));
// Delete one
userRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const existingUser = yield userService_1.default.getUser(req.params.id);
    if (!user || !existingUser) {
        throw new errors_1.AuthenticationError('must be logged in to delete oneself');
    }
    yield userService_1.default.deleteUser(req.params.id);
    return res.status(204).end();
}));
exports.default = userRouter;

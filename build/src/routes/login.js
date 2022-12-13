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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const errors_1 = require("../utils/errors");
const loginRouter = express_1.default.Router();
loginRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield user_1.UserModel.findOne({ username });
    const passwordCorrect = user === null ? false : yield bcrypt_1.default.compare(password, user.passwordHash);
    if (!(user && passwordCorrect)) {
        throw new errors_1.AuthenticationError('username or password incorrect');
    }
    const userData = {
        username: user.username,
        id: user._id,
    };
    const token = jsonwebtoken_1.default.sign(userData, process.env.SECRET, {
        expiresIn: 60 * 60,
    });
    return res.status(200).send({
        token,
        username: user.username,
        name: user.name,
    });
}));
exports.default = loginRouter;

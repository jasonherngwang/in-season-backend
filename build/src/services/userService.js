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
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../utils/errors");
const user_1 = require("../models/user");
// // Get all
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.UserModel.find({});
    return users;
});
// Get one
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.UserModel.findById(id).populate(['foods', 'baskets']);
    return user;
});
// // Create one
const addUser = (entry) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = entry;
    const existingUser = yield user_1.UserModel.findOne({ username });
    if (existingUser) {
        throw new errors_1.ValidationError(`username must be unique; ${username} already exists`);
    }
    // Hash plaintext password
    const saltRounds = 10;
    const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
    const newUser = new user_1.UserModel({
        username,
        passwordHash,
    });
    const addedUser = yield newUser.save();
    return addedUser;
});
// Delete user along with their foods and baskets
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.UserModel.findByIdAndDelete(id);
});
exports.default = {
    getUsers,
    getUser,
    addUser,
    deleteUser,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        minLength: 1,
    },
    passwordHash: {
        type: String,
        required: true,
        minLength: 1,
    },
    foods: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Food',
        },
    ],
    baskets: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Basket',
        },
    ],
});
/* eslint-disable no-param-reassign */
UserSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash; // hash should not be revealed
    },
});
/* eslint-enable no-param-reassign */
const UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.UserModel = UserModel;

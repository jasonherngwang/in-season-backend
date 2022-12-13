"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasketModel = void 0;
const mongoose_1 = require("mongoose");
const BasketSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    foods: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Food',
        },
    ],
});
/* eslint-disable no-param-reassign */
BasketSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
/* eslint-enable no-param-reassign */
const BasketModel = (0, mongoose_1.model)('Basket', BasketSchema);
exports.BasketModel = BasketModel;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodModel = void 0;
const mongoose_1 = require("mongoose");
const FoodSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    months: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    description: String,
    imageUrl: String,
});
/* eslint-disable no-param-reassign */
FoodSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
/* eslint-enable no-param-reassign */
const FoodModel = (0, mongoose_1.model)('Food', FoodSchema);
exports.FoodModel = FoodModel;

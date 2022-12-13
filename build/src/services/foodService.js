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
Object.defineProperty(exports, "__esModule", { value: true });
const food_1 = require("../models/food");
// Get all
const getFoods = () => __awaiter(void 0, void 0, void 0, function* () {
    const foods = yield food_1.FoodModel.find({});
    return foods;
});
// Get one
const getFood = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const food = yield food_1.FoodModel.findById(id);
    return food;
});
// Create one
const addFood = (entry) => __awaiter(void 0, void 0, void 0, function* () {
    const newFood = new food_1.FoodModel({
        name: entry.name,
        category: entry.category,
        months: entry.months,
        description: entry.description,
        imageUrl: entry.imageUrl,
    });
    const addedFood = yield newFood.save();
    return addedFood;
});
const linkFoodToUser = (food, user) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line no-param-reassign
    user.foods = user.foods.concat(food._id);
    yield user.save();
});
// Update one
const updateFood = (id, entry) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedFood = food_1.FoodModel.findByIdAndUpdate(id, {
        name: entry.name,
        category: entry.category,
        months: entry.months,
        description: entry.description,
        imageUrl: entry.imageUrl,
    }, { new: true, runValidators: true, context: 'query' });
    return updatedFood;
});
// Delete one
const deleteFood = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield food_1.FoodModel.findByIdAndDelete(id);
});
exports.default = {
    getFoods,
    getFood,
    addFood,
    linkFoodToUser,
    updateFood,
    deleteFood,
};

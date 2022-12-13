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
const mongoose_1 = __importDefault(require("mongoose"));
const food_1 = require("../models/food");
const user_1 = require("../models/user");
const basket_1 = require("../models/basket");
// Get all baskets for user
const getBaskets = (userId = '') => __awaiter(void 0, void 0, void 0, function* () {
    const baskets = yield basket_1.BasketModel.find(userId
        ? {
            _id: new mongoose_1.default.Types.ObjectId(userId),
        }
        : {});
    return baskets;
});
// Get one basket by id
const getBasket = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const basket = yield basket_1.BasketModel.findById(id).populate(['foods', 'owner']);
    return basket;
});
// Create one basket
const addBasket = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const newBasket = new basket_1.BasketModel({
        name: 'My Basket',
        owner: userId,
    });
    const user = yield user_1.UserModel.findById(userId);
    yield user_1.UserModel.findByIdAndUpdate(userId, {
        baskets: user.baskets.concat(newBasket._id),
    });
    const addedBasket = yield newBasket.save();
    return addedBasket;
});
// Update operations
const renameBasket = (id, newName) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBasket = basket_1.BasketModel.findByIdAndUpdate(id, {
        name: newName,
    }, { new: true, runValidators: true, context: 'query' });
    return updatedBasket;
});
const addFoodToBasket = (basketId, foodId) => __awaiter(void 0, void 0, void 0, function* () {
    const food = yield food_1.FoodModel.findById(foodId);
    const basket = yield basket_1.BasketModel.findById(basketId);
    const updatedBasket = yield basket_1.BasketModel.findByIdAndUpdate(basketId, {
        foods: basket.foods.includes(food._id)
            ? basket.foods
            : basket.foods.concat(food._id),
    }, { new: true, runValidators: true, context: 'query' });
    return updatedBasket;
});
const deleteFoodFromBasket = (basketId, foodId) => __awaiter(void 0, void 0, void 0, function* () {
    const food = yield food_1.FoodModel.findById(foodId);
    const basket = yield basket_1.BasketModel.findById(basketId);
    const updatedBasket = yield basket_1.BasketModel.findByIdAndUpdate(basketId, {
        foods: basket.foods.filter((f) => f.toString() === food._id),
    }, { new: true, runValidators: true, context: 'query' });
    return updatedBasket;
});
// Delete all foods from basket
const clearBasket = (basketId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBasket = yield basket_1.BasketModel.findByIdAndUpdate(basketId, {
        foods: [],
    }, { new: true, runValidators: true, context: 'query' });
    return updatedBasket;
});
// Delete basket
const deleteBasket = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield basket_1.BasketModel.findByIdAndDelete(id);
});
exports.default = {
    getBaskets,
    getBasket,
    addBasket,
    addFoodToBasket,
    deleteFoodFromBasket,
    clearBasket,
    renameBasket,
    deleteBasket,
};

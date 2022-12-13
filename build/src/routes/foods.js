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
const foodService_1 = __importDefault(require("../services/foodService"));
const errors_1 = require("../utils/errors");
const requestProcessor_1 = require("../utils/requestProcessor");
const foodRouter = express_1.default.Router();
const foodBelongsToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    if (!user) {
        throw new errors_1.AuthenticationError('must be logged in to edit/delete food');
    }
    const food = yield foodService_1.default.getFood(req.params.id);
    if (!food) {
        return res.status(404).end();
    }
    // Compare Mongoose ObjectIDs
    const isFoodOwner = user.foods.includes(food._id);
    if (!(food && isFoodOwner)) {
        // Food is not owned by user
        throw new errors_1.AuthenticationError("only the food's creator can edit/delete it");
    }
    return true;
});
// Get all (anyone can view all foods)
foodRouter.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foods = yield foodService_1.default.getFoods();
    return res.json(foods);
}));
// Get one (anyone can view any food)
foodRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const food = yield foodService_1.default.getFood(req.params.id);
    if (food) {
        return res.json(food);
    }
    return res.status(404).end();
}));
// Create one (logged-in users only)
foodRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Middleware queries user by id from db and inserts into request
    const { body, user } = req;
    console.log(user);
    if (!user) {
        throw new errors_1.AuthenticationError('must be logged in to add food');
    }
    const newFoodEntry = (0, requestProcessor_1.toNewFoodEntry)(body);
    const addedFood = yield foodService_1.default.addFood(newFoodEntry);
    yield foodService_1.default.linkFoodToUser(addedFood, user);
    return res.status(201).json(addedFood);
}));
// Update one (logged-in users only, and only foods that belong to them)
foodRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorized = yield foodBelongsToUser(req, res);
    if (!authorized) {
        return res.status(404).end();
    }
    const updatedFoodEntry = (0, requestProcessor_1.toNewFoodEntry)(req.body);
    const updatedFood = yield foodService_1.default.updateFood(req.params.id, updatedFoodEntry);
    return res.status(201).json(updatedFood);
}));
// Delete one (logged-in users only, and only foods that belong to them)
foodRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorized = yield foodBelongsToUser(req, res);
    if (!authorized) {
        return res.status(404).end();
    }
    yield foodService_1.default.deleteFood(req.params.id);
    return res.status(204).end();
}));
exports.default = foodRouter;

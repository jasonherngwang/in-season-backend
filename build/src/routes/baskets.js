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
const basketService_1 = __importDefault(require("../services/basketService"));
const errors_1 = require("../utils/errors");
const basketRouter = express_1.default.Router();
const basketBelongsToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { user } = req;
    // Testing ------------------------------------
    const { user } = req.body;
    // Testing ------------------------------------
    if (!user) {
        throw new errors_1.AuthenticationError('must be logged in to edit/delete basket');
    }
    const basket = yield basketService_1.default.getBasket(req.params.id);
    if (!basket) {
        return res.status(404).end();
    }
    const isBasketOwner = basket.owner._id.toString() === user._id;
    if (!(basket && isBasketOwner)) {
        // Basket is not owned by user
        throw new errors_1.AuthenticationError("only the basket's creator can edit/delete it");
    }
    return true;
});
// Get all
basketRouter.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const baskets = yield basketService_1.default.getBaskets();
    return res.json(baskets);
}));
// Get one
basketRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const basket = yield basketService_1.default.getBasket(req.params.id);
    if (basket) {
        return res.json(basket);
    }
    return res.status(404).end();
}));
// Create one
basketRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { user } = req;
    // Testing ------------------------------------
    const { user } = req.body;
    // Testing ------------------------------------
    if (!user) {
        throw new errors_1.AuthenticationError('must be logged in to add basket');
    }
    const addedBasket = yield basketService_1.default.addBasket(user._id);
    return res.status(201).json(addedBasket);
}));
// Rename
basketRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorized = yield basketBelongsToUser(req, res);
    if (!authorized) {
        return res.status(404).end();
    }
    const { body } = req;
    let updatedBasket = yield basketService_1.default.getBasket(req.params.id);
    // Determine the updates that need to be made
    if (body.attributes.newName) {
        updatedBasket = yield basketService_1.default.renameBasket(req.params.id, body.attributes.newName);
    }
    if (body.attributes.foodToAdd) {
        updatedBasket = yield basketService_1.default.addFoodToBasket(req.params.id, body.attributes.foodToAdd);
    }
    if (body.attributes.foodToDelete) {
        updatedBasket = yield basketService_1.default.deleteFoodFromBasket(req.params.id, body.attributes.foodToDelete);
    }
    if (body.attributes.clearBasket) {
        updatedBasket = yield basketService_1.default.clearBasket(req.params.id);
    }
    return res.status(201).json(updatedBasket);
}));
// Delete one
basketRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorized = yield basketBelongsToUser(req, res);
    if (!authorized) {
        return res.status(404).end();
    }
    yield basketService_1.default.deleteBasket(req.params.id);
    return res.status(204).end();
}));
exports.default = basketRouter;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../src/types");
const foods = [
    {
        id: '1',
        name: 'Orange',
        description: 'Orange fruit',
        category: types_1.Category.Fruit,
        months: [0, 1, 2, 3, 4, 5],
        imageUrl: '../images/orange.png',
    },
    {
        id: '2',
        name: 'Watermelon',
        description: 'Watermelon fruit',
        category: types_1.Category.Fruit,
        months: [0, 1, 2, 3, 4, 5],
        imageUrl: '../images/watermelon.png',
    },
    {
        id: '3',
        name: 'Cabbage',
        description: 'Cabbage vegetable',
        category: types_1.Category.Vegetable,
        months: [0, 1, 2, 3, 4, 5],
        imageUrl: '../images/cabbage.png',
    },
];
exports.default = foods;

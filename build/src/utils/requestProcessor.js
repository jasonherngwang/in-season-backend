"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewUserEntry = exports.toNewFoodEntry = void 0;
const errors_1 = require("./errors");
const types_1 = require("../types");
// New Food validation
const isString = (text) => typeof text === 'string' || text instanceof String;
const parseName = (name) => {
    if (!name || !isString(name)) {
        throw new errors_1.ValidationError('incorrect or missing name');
    }
    return name;
};
// 0 (Jan) through 11 (Dec)
const isObjectOfMonths = (monthsObj) => {
    const monthNums = [...Array(12).keys()].map((num) => num.toString());
    const keysValid = Object.keys(monthsObj).every((m) => isString(m) && monthNums.includes(m));
    const valuesValid = Object.values(monthsObj).every((m) => typeof m === 'boolean');
    return keysValid && valuesValid;
};
const parseMonths = (months) => {
    if (typeof months !== 'object' ||
        months === null ||
        !isObjectOfMonths(months)) {
        throw new errors_1.ValidationError('incorrect or missing month seasonality format');
    }
    return months;
};
// Enum fields
const isCategory = (param) => Object.values(types_1.Category).includes(param);
const parseCategory = (category) => {
    if (!category || !isCategory(category)) {
        throw new errors_1.ValidationError(`incorrect or missing category: ${category}`);
    }
    return category;
};
// Optional fields: If empty string or missing, use empty string.
// Only throw error if incorrect data type.
const parseDescription = (description) => {
    if (description === undefined) {
        return '';
    }
    if (!isString(description)) {
        throw new errors_1.ValidationError('incorrect description format');
    }
    return description;
};
const parseImageUrl = (imageUrl) => {
    if (imageUrl === undefined) {
        return '';
    }
    if (!isString(imageUrl)) {
        throw new errors_1.ValidationError('incorrect image URL format');
    }
    return imageUrl;
};
// Used to convert request body to object with expected types
const toNewFoodEntry = ({ name, category, months, description, imageUrl, }) => {
    const newFood = {
        name: parseName(name),
        category: parseCategory(category),
        months: parseMonths(months),
        description: parseDescription(description),
        imageUrl: parseImageUrl(imageUrl),
    };
    return newFood;
};
exports.toNewFoodEntry = toNewFoodEntry;
// New User validation
const parseUsername = (username) => {
    if (!username || !isString(username)) {
        throw new errors_1.ValidationError('incorrect or missing username');
    }
    if (username.length < 1) {
        throw new errors_1.ValidationError('username must be at least 3 characters');
    }
    return username;
};
const parsePassword = (password) => {
    if (!password || !isString(password)) {
        throw new errors_1.ValidationError('incorrect or missing password');
    }
    if (password.length < 1) {
        throw new errors_1.ValidationError('password must be at least 3 characters');
    }
    return password;
};
const toNewUserEntry = ({ username, password }) => {
    const newUser = {
        username: parseUsername(username),
        password: parsePassword(password),
    };
    return newUser;
};
exports.toNewUserEntry = toNewUserEntry;

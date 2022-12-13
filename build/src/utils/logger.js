"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = (...params) => {
    console.log(...params);
};
const error = (...params) => {
    console.error(...params);
};
exports.default = { info, error };

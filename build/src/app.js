"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./utils/config"));
const foods_1 = __importDefault(require("./routes/foods"));
const users_1 = __importDefault(require("./routes/users"));
const baskets_1 = __importDefault(require("./routes/baskets"));
const login_1 = __importDefault(require("./routes/login"));
const middleware_1 = __importDefault(require("./utils/middleware"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(middleware_1.default.requestLogger);
app.use(middleware_1.default.tokenExtractor);
app.use(middleware_1.default.userExtractor);
console.log('Connecting to', config_1.default.MONGODB_URI);
mongoose_1.default
    .connect((_a = config_1.default.MONGODB_URI) !== null && _a !== void 0 ? _a : '')
    .then(() => {
    logger_1.default.info('Connected to MongoDB');
})
    .catch((error) => {
    logger_1.default.error('Error connecting to MongoDB:', error.message);
});
app.use('/api/foods', foods_1.default);
app.use('/api/users', users_1.default);
app.use('/api/baskets', baskets_1.default);
app.use('/api/login', login_1.default);
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
exports.default = app;

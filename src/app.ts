import 'express-async-errors';
import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config';
import foodRouter from './routes/foods';
import imageUploadRouter from './routes/imageUpload';
import userRouter from './routes/users';
import basketRouter from './routes/baskets';
import loginRouter from './routes/login';
import testingRouter from './routes/testing';

import middleware from './utils/middleware';
import logger from './utils/logger';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

console.log('Connecting to', config.MONGO_URI);

mongoose.set('strictQuery', false);
mongoose
  .connect(config.MONGO_URI ?? '')
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

app.use('/api/foods', foodRouter, imageUploadRouter);
app.use('/api/users', userRouter);
app.use('/api/basket', basketRouter);
app.use('/api/login', loginRouter);

// Enable tests to wipe the database
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;

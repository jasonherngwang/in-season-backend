import 'express-async-errors';
import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config';
import foodRouter from './routes/foods';
import userRouter from './routes/users';
import loginRouter from './routes/login';

import middleware from './utils/middleware';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

console.log('Connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI ?? '')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;

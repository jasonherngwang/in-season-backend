import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './utils/config';
import foodRouter from './routes/foods';

const app: Application = express();
app.use(cors());
app.use(express.json());

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

export default app;

import express, { Application } from 'express';
import cors from 'cors';
import foodRouter from './routes/foods';

const PORT = 3001;

const app: Application = express();
app.use(express.json());
app.use(cors());

app.use('/api/foods', foodRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

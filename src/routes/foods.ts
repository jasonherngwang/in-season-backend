import express from 'express';
import foodService from '../services/foodService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(foodService.getFoods());
});

export default router;

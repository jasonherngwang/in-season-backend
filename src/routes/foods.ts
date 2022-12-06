import express from 'express';
import foodService from '../services/foodService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(foodService.getFoods());
});

router.get('/:id', (req, res) => {
  res.send(foodService.getFood(req.params.id));
});

export default router;

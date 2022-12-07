import { RequestHandler, ErrorRequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import morgan from 'morgan';
import logger from './logger';
import { UserModel } from '../models/user';

morgan.token('body', (req: any) => {
  const isPostOrPut = ['POST', 'PUT'].includes(req.method)
    ? JSON.stringify(req.body)
    : '';
  return isPostOrPut;
});

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body',
);

const tokenExtractor: RequestHandler = (req: any, _res, next) => {
  req.token = null;

  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    req.token = authorization.substring(7);
  }

  next();
};

const userExtractor: RequestHandler = async (req: any, res, next) => {
  req.user = null;

  if (req.token) {
    const decodedToken = jwt.verify(
      req.token,
      process.env.SECRET as string,
    ) as JwtPayload;

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }
    req.user = await UserModel.findById(decodedToken.id);
  }

  return next();
};

const unknownEndpoint: RequestHandler = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  }

  return next(error);
};

export default {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};

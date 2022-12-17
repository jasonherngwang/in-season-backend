import * as dotenv from 'dotenv';

dotenv.config();

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_DB_NAME,
  NODE_DOCKER_PORT,
  CLIENT_ORIGIN,
  AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET,
  AWS_BUCKET_NAME,
} = process.env;

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;

export default {
  MONGODB_URI,
  NODE_DOCKER_PORT,
  CLIENT_ORIGIN,
  AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET,
  AWS_BUCKET_NAME,
};

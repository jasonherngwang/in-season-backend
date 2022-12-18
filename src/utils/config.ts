import * as dotenv from 'dotenv';

dotenv.config();

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_DB_NAME,
  TEST_MONGODB_USER,
  TEST_MONGODB_PASSWORD,
  TEST_MONGODB_HOST,
  TEST_MONGODB_PORT,
  TEST_MONGODB_DB_NAME,
  NODE_INTERNAL_PORT, // Port inside Docker container
  AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET,
  AWS_BUCKET_NAME,
  CLOUDFRONT_DISTRIBUTION_URL,
} = process.env;

const TEST_MONGODB_URI = `mongodb://${TEST_MONGODB_USER}:${TEST_MONGODB_PASSWORD}@${TEST_MONGODB_HOST}:${TEST_MONGODB_PORT}/${TEST_MONGODB_DB_NAME}?retryWrites=true&w=majority`;
const PROD_MONGODB_URI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;

const MONGODB_URI =
  process.env.NODE_ENV === 'test' ? TEST_MONGODB_URI : PROD_MONGODB_URI;

export default {
  MONGODB_URI,
  NODE_INTERNAL_PORT,
  AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET,
  AWS_BUCKET_NAME,
  CLOUDFRONT_DISTRIBUTION_URL,
};

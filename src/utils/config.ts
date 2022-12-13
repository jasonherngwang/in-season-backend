import * as dotenv from 'dotenv';

dotenv.config();

const { PORT, AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_SECRET, AWS_BUCKET_NAME } =
  process.env;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

export default {
  MONGODB_URI,
  PORT,
  AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET,
  AWS_BUCKET_NAME,
};

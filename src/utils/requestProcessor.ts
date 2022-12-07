import ValidationError from './errors';
import { NewFoodEntry, Category, NewUserEntry } from '../types';

// New Food validation
const isString = (text: unknown): text is string =>
  typeof text === 'string' || text instanceof String;

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new ValidationError('incorrect or missing name');
  }
  return name;
};

// 0 (Jan) through 11 (Dec)
const isArrayOfMonthNums = (array: number[]): boolean =>
  array.every((num) => [...Array(12).keys()].includes(num));

const parseMonths = (months: unknown): number[] => {
  if (!Array.isArray(months) || !isArrayOfMonthNums(months)) {
    throw new ValidationError(`incorrect or missing months: ${months}`);
  }
  return months;
};

// Enum fields
const isCategory = (param: any): param is Category =>
  Object.values(Category).includes(param);

const parseCategory = (category: unknown): Category => {
  if (!category || !isCategory(category)) {
    throw new ValidationError(`incorrect or missing category: ${category}`);
  }
  return category;
};

// Optional fields: If empty string or missing, use empty string.
// Only throw error if incorrect data type.
const parseDescription = (description: unknown): string => {
  if (description === undefined) {
    return '';
  }
  if (!isString(description)) {
    throw new ValidationError('incorrect description format');
  }
  return description;
};

const parseImageUrl = (imageUrl: unknown): string => {
  if (imageUrl === undefined) {
    return '';
  }
  if (!isString(imageUrl)) {
    throw new ValidationError('incorrect image URL format');
  }
  return imageUrl;
};

type NewFoodInputFields = {
  name: unknown;
  category: unknown;
  months: unknown;
  description: unknown;
  imageUrl: unknown;
};

// Used to convert request body to object with expected types
const toNewFoodEntry = ({
  name,
  category,
  months,
  description,
  imageUrl,
}: NewFoodInputFields): NewFoodEntry => {
  const newFood: NewFoodEntry = {
    name: parseName(name),
    category: parseCategory(category),
    months: parseMonths(months),
    description: parseDescription(description),
    imageUrl: parseImageUrl(imageUrl),
  };

  return newFood;
};

// New User validation
const parseUsername = (username: unknown): string => {
  if (!username || !isString(username)) {
    throw new ValidationError('incorrect or missing username');
  }
  if (username.length < 1) {
    throw new ValidationError('username must be at least 3 characters');
  }
  return username;
};

const parsePassword = (password: unknown): string => {
  if (!password || !isString(password)) {
    throw new ValidationError('incorrect or missing password');
  }
  if (password.length < 1) {
    throw new ValidationError('password must be at least 3 characters');
  }
  return password;
};

type NewUserInputFields = {
  username: unknown;
  password: unknown;
};

const toNewUserEntry = ({ username, password }: NewUserInputFields) => {
  const newUser: NewUserEntry = {
    username: parseUsername(username),
    password: parsePassword(password),
  };
  return newUser;
};

export { toNewFoodEntry, toNewUserEntry };

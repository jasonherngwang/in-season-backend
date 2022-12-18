import { ValidationError } from './errors';
import { NewFoodEntry, Category, NewUserEntry, MonthsInSeason } from '../types';

// New food creation
const isString = (text: unknown): text is string =>
  typeof text === 'string' || text instanceof String;

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new ValidationError('incorrect or missing name');
  }
  return name;
};

// { monthNum: boolean } format: { "0": true, "1": false, ..., "11": true }
const isObjectOfMonths = (months: object): boolean => {
  const monthNums = [...Array(12).keys()].map((num) => num.toString());

  const hasTwelveKeys = Object.keys(months).length === 12;
  const hasAllMonths = monthNums.every((m) => m in months);
  if (!(hasTwelveKeys && hasAllMonths)) {
    throw new ValidationError('must have all twelve months');
  }

  const valuesValid = Object.values(months).every(
    (m) => typeof m === 'boolean',
  );
  if (!valuesValid) {
    throw new ValidationError('values must be booleans');
  }

  return true;
};

const parseMonths = (months: unknown): MonthsInSeason => {
  if (
    typeof months !== 'object' ||
    months === null ||
    !isObjectOfMonths(months)
  ) {
    throw new ValidationError('incorrect or missing month seasonality format');
  }

  return { ...months };
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
  description?: unknown;
  imageUrl?: unknown;
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

// New user signup
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

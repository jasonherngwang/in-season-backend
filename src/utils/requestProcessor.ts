import { NewFoodEntry, Category } from '../types';

// Input validation
const isString = (text: unknown): text is string =>
  typeof text === 'string' || text instanceof String;

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name.');
  }
  return name;
};

// 0 (Jan) through 11 (Dec)
const isArrayOfMonthNums = (array: number[]): boolean =>
  array.every((num) => [...Array(12).keys()].includes(num));

const parseMonths = (months: unknown): number[] => {
  if (!Array.isArray(months) || !isArrayOfMonthNums(months)) {
    throw new Error(`Incorrect or missing months: ${months}`);
  }
  return months;
};

// Enum fields
const isCategory = (param: any): param is Category =>
  Object.values(Category).includes(param);

const parseCategory = (category: unknown): Category => {
  if (!category || !isCategory(category)) {
    throw new Error(`Incorrect or missing category: ${category}`);
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
    throw new Error('Incorrect description format.');
  }
  return description;
};

const parseImageUrl = (imageUrl: unknown): string => {
  if (imageUrl === undefined) {
    return '';
  }
  if (!isString(imageUrl)) {
    throw new Error('Incorrect image URL format.');
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

export default toNewFoodEntry;

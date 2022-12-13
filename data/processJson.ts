import fs from 'fs';
import { NewFoodEntry, Category } from '../src/types';

let seedData = require('./rawSeedData.json');

type RawJsonFormat = {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  months: any;
};

type MonthsFormat = {
  [key: string]: boolean;
};

seedData = seedData.map(
  ({
    name,
    category,
    description,
    imageUrl,
    ...months
  }: RawJsonFormat): NewFoodEntry => {
    const processedMonths: MonthsFormat = {};
    Object.entries(months).forEach(([key, val]) => {
      processedMonths[key] = val === 'true';
    });

    return {
      name,
      category: category as Category,
      description,
      imageUrl: `images/${imageUrl}`,
      months: processedMonths,
    };
  },
);

const content = JSON.stringify(seedData);

fs.writeFile('./seedData.json', content, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }

  return console.log('The file was saved');
});

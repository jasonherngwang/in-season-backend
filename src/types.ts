export enum Category {
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Other = 'other',
}

export type MonthsInSeason = {
  [key: string]: boolean;
};

export type NewFoodEntry = {
  name: string;
  category: Category;
  months: MonthsInSeason;
  description?: string;
  imageUrl?: string;
};

export type NewUserEntry = {
  username: string;
  password: string;
};

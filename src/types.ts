// Food
export type Food = {
  id: string;
  name: string;
  category: Category;
  months: number[];
  description?: string;
  imageUrl?: string;
};

export type NewFoodEntry = Omit<Food, 'id'>;

export enum Category {
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Other = 'other',
}

// User
export type User = {
  id: string;
  username: string;
  passwordHash: string;
};

export type NewUserEntry = {
  username: string;
  password: string;
};

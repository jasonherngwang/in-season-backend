export enum Category {
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Other = 'other',
}

// Food (used by frontend only)
export type Food = {
  id: string;
  name: string;
  category: Category;
  months: number[];
  description?: string;
  imageUrl?: string;
};

// Provided by user when creating a food
export type NewFoodEntry = Omit<Food, 'id'>;

// User (used by frontend only)
export type User = {
  id: string;
  username: string;
  foods: Food[];
};

// Provided by user when signing up
export type NewUserEntry = {
  username: string;
  password: string;
};

// Basket (used by frontend only)
export type Basket = {
  id: string;
  name: string;
  owner?: User;
  foods?: Food[];
};

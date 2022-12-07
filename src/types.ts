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

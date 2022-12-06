export type Food = {
  id: string;
  name: string;
  category: Category;
  months: number[];
  description?: string;
  imageUrl?: string;
};

export enum Category {
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Other = 'other',
}

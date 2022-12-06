export type Food = {
  id: string;
  name: string;
  description: string;
  category: Category;
  months: number[];
  imageUrl?: string;
};

export enum Category {
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Other = 'other',
}

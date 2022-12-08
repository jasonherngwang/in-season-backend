import { Schema, model, Types } from 'mongoose';

interface IFood {
  _id: Types.ObjectId;
  name: string;
  category: string;
  months: number[];
  description?: string;
  imageUrl?: string;
}

const FoodSchema = new Schema<IFood>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  months: {
    type: [Number],
    required: true,
  },
  description: String,
  imageUrl: String,
});

/* eslint-disable no-param-reassign */
FoodSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
/* eslint-enable no-param-reassign */

const FoodModel = model<IFood>('Food', FoodSchema);

export { IFood, FoodModel };

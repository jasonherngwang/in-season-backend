import { Schema, model, Types } from 'mongoose';

interface IBasket {
  _id: Types.ObjectId;
  name: string;
  owner?: Types.ObjectId;
  foods?: Types.ObjectId[];
}

const BasketSchema = new Schema<IBasket>({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  foods: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Food',
    },
  ],
});

/* eslint-disable no-underscore-dangle, no-param-reassign */
BasketSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
/* eslint-enable no-underscore-dangle, no-param-reassign */

const BasketModel = model<IBasket>('Basket', BasketSchema);

export { IBasket, BasketModel };

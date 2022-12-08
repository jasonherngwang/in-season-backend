import { Schema, model, Types } from 'mongoose';

interface IUser {
  _id: Types.ObjectId;
  username: string;
  passwordHash: string;
  foods: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    minLength: 1,
  },
  passwordHash: {
    type: String,
    required: true,
    minLength: 1,
  },
  foods: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Food',
    },
  ],
});

/* eslint-disable no-param-reassign */
UserSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // hash should not be revealed
  },
});
/* eslint-enable no-param-reassign */

const UserModel = model<IUser>('User', UserSchema);

export { IUser, UserModel };

import { Document, Schema, model, models } from 'mongoose';


export interface ILocation extends Document {
  name: string;
  code: string;
  type: 'county' | 'state';
  state: {
    name: string,
    code: string
  },
  taxYear:string
}

const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true },
  code: { type: String },
  type: { type: String, enum: ['county', 'state'], required: true },
  state: {
    name: String,
    code: String
  },
  taxYear:{type:String}
});

export default models.Location || model<ILocation>('Location', LocationSchema);

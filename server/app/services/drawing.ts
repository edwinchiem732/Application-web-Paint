import { Drawing } from '@common/communication/Drawing';
import { Model, model, Schema } from 'mongoose';
import { Type } from 'ts-mongoose';

const schema = new Schema({
    name: Type.string({ required: true }),
    tags: Type.array({ required: false }).of(Type.string({ required: false })),
    url: Type.string({ required: false }),
});
const drawingSchema: Model<Drawing> = model('Drawing', schema); // creates a collection
export default drawingSchema;

export const URL_DATABASE = 'mongodb+srv://projet:projet@cluster0.ti3bl.mongodb.net/projetdb?retryWrites=true&w=majority';
export const NAME_DATABASE = 'projetdb';

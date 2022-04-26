import * as fs from 'fs';
import { injectable } from 'inversify';
import { MongoClientOptions, ObjectId } from 'mongodb';
import { connect, connection } from 'mongoose';
import 'reflect-metadata';
import drawingSchema, { URL_DATABASE } from './drawing';

@injectable()
export class DatabaseService {
    url: string;
    options: MongoClientOptions;

    async startConnection(): Promise<void> {
        this.url = URL_DATABASE;
        this.options = { useNewUrlParser: true, useUnifiedTopology: true };
        await connect(URL_DATABASE, this.options);
        connection.on('error', (err) => {
            console.error(err);
        });
    }

    async saveDrawing(drawing: any): Promise<any> {
        try {
            // add image
            // tslint:disable-next-line: prefer-const
            let { name, tags, url } = drawing;
            if (!fs.existsSync('../uploads/')) {
                fs.mkdirSync('../uploads');
            }
            const promise = drawingSchema.create({ name, tags }); // creates in the database
            const draw = await promise;
            url = url.replace(/^data:image\/png;base64,/, '');
            fs.writeFile('../uploads/' + draw.id + '.png', url, { encoding: 'base64' }, (error) => {
                if (error) {
                    throw error.message;
                }
            });
            return promise; // returns a Promise if successful
        } catch (error) {
            throw error; // If the Promise is rejected, the await expression throws the rejected value.
        }
    }

    // tslint:disable-next-line: no-any
    async getDrawByID(): Promise<any[]> {
        // tslint:disable-next-line: no-any
        return new Promise<any[]>(async (resolve, reject) => {
            const obj = [{}];
            let base64 = '';
            fs.readdir('../uploads/', async (err, files) => {
                if (!err)
                    for (let file of files) {
                        fs.readFile('../uploads/' + file, (error, buffer) => {
                            if (!error) {
                                base64 = buffer.toString('base64');
                            }
                            base64 = base64.replace('', 'data:image/png;base64,');
                        });
                        file = file.replace('.png', '');
                        const data = await drawingSchema.findById(file);
                        if (data) {
                            obj.unshift({ name: data?.name as string, tags: data?.tags as string[], url: base64, id: data?.id as string });
                        }
                    }
                resolve(obj);
            });
        });
    }

    async deleteDraw(drawing: string): Promise<void> {
        try {
            await drawingSchema.deleteOne({ _id: new ObjectId(drawing) });
        } catch (error) {
            throw error;
        }
    }
}

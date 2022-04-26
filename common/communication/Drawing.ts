import { Document } from 'mongoose';

export interface IDrawing extends Document {
    name: string;
    tags: string[];
    url: string;
}

export class Drawing extends Document {
    name: string;
    tags: string[];
    url: string;
    constructor(name: string, tags: string[], url: string) {
        super();
        this.name = name;
        this.tags = tags;
        this.url = url;
    }
}

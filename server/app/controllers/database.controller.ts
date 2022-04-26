import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/types';
// import bodyParser from 'body-parser';
// import * as bodyParser from 'body-parser'; // pull information from HTML POST (express4)
import { Router } from 'express';
// import * as fs from 'fs';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
// import * as multer from 'multer';
// import * as path from 'path';

@injectable()
export class Database {
    router: Router;

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.databaseService.startConnection();
        this.configureRouter();
        // this.saveImage();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', async (req, res) => {
            try {
                const draw = await this.databaseService.saveDrawing(req.body); // req.body: data sent from post from client to server
                res.status(Httpstatus.StatusCodes.CREATED).send(draw);
            } catch (err) {
                res.status(Httpstatus.StatusCodes.BAD_REQUEST).json(err.message);
            }
        });

        this.router.get('/', async (req, res) => {
            try {
                const data = await this.databaseService.getDrawByID();
                res.json(data);
            } catch (err) {
                res.status(Httpstatus.StatusCodes.BAD_REQUEST).json(err.message);
            }
        });

        this.router.delete('/:id', async (req, res) => {
            try {
                await this.databaseService.deleteDraw(req.params.id);
                res.status(Httpstatus.StatusCodes.OK);
                res.json('deleted');
            } catch (err) {
                res.status(Httpstatus.StatusCodes.NOT_FOUND).json(err.message);
            }
        });
    }
}

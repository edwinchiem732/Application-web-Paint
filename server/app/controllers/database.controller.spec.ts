import { Application } from '@app/app';
import { DatabaseService } from '@app/services/database.service';
import { expect } from 'chai';
import * as Httpstatus from 'http-status-codes';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { TYPES } from '../types';

describe('Database Controller', () => {
    let databaseService: Stubbed<DatabaseService>;
    let app: Express.Application;
    const dataSent = {
        _id: ' ',
        name: 'test1',
        tags: 'tag1',
    };

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DatabaseService).toConstantValue({
            saveDrawing: sandbox.stub().resolves(dataSent),
            getDrawById: sandbox.stub().resolves(dataSent._id),
            deleteDraw: sandbox.stub().resolves(dataSent._id),
        });
        databaseService = container.get(TYPES.DatabaseService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should post data ', async () => {
        const data = {
            name: 'test1',
            tags: ['tag1'],
        };

        return (
            supertest(app)
                .post('/api/drawing')
                .send(data)
                .expect(Httpstatus.StatusCodes.CREATED)
                // tslint:disable-next-line: no-any
                .then(async (res: any) => {
                    expect(res.body.name).to.deep.equal(dataSent.name);
                    expect(res.body.tags[0]).to.deep.equal(dataSent.tags[0]);
                    expect(res.body._id).to.deep.equal(dataSent._id);
                })
                .catch((err: Error) => {
                    console.log('Error ' + err);
                })
        );
    });

    it('should post data ', async () => {
        databaseService.saveDrawing.rejects(new Error('error in the server'));
        const data = {
            name: 'test1',
            tags: 11,
        };

        return (
            supertest(app)
                .post('/api/drawing')
                .send(data)
                .expect(Httpstatus.StatusCodes.BAD_REQUEST)
                // tslint:disable-next-line: no-any
                .then(async (res: any) => {
                    expect(res.body._id).to.equal('Error');
                })
                .catch((err: Error) => {
                    console.log('Error ' + err);
                })
        );
    });

    it('should return ', async () => {
        const data = {
            name: 'test1',
            tags: ['tag1'],
        };
        databaseService.getDrawByID.resolves(data);
        return (
            supertest(app)
                .get('/api/drawing')
                .expect(Httpstatus.StatusCodes.OK)
                // tslint:disable-next-line: no-any
                .then((response: any) => {
                    expect(response.body.name).to.deep.equal(dataSent.name);
                    expect(response.body.tags).to.deep.equal(dataSent.tags);
                })
        );
    });

    it('should delete data with _id', async () => {
        const data = {
            _id: '1234',
        };

        return (
            supertest(app)
                .delete('/api/drawing/:id')
                .send(data)
                .expect(Httpstatus.StatusCodes.OK)
                // tslint:disable-next-line: no-any
                .then(async (res: any) => {
                    expect(res.body._id).to.equal(data._id);
                })
                .catch((err: Error) => {
                    console.log('Error ' + err);
                })
        );
    });
});

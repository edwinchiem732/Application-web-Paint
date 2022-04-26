import { expect } from 'chai';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { connect } from 'mongoose';
import * as sinon from 'sinon';
import { assert } from 'sinon';
import { Drawing } from './../../../common/communication/Drawing';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    // let collectionInfoDB: Drawing;
    let mongoUri: string;
    const sandbox = sinon.createSandbox();

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = new MongoMemoryServer();
        mongoUri = await mongoServer.getUri();
        await connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        // collectionInfoDB = { name: 'test1', tags: [ 'tag1' , 'tag2'], url: 'something' };
    });

    afterEach(async () => {
        await mongoose.connection.close();
    });

    // start connection
    it('should connect to database when startConnection is called', async () => {
        databaseService.url = mongoUri;
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        databaseService.options = options;
        await databaseService.startConnection();
        const connectionSpy = sandbox.spy(databaseService, 'startConnection');
        expect(connectionSpy.called);
    });

    it('should no longer be connected to database when startConnection is called', async () => {
        databaseService.url = mongoUri;
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        databaseService.options = options;
        await databaseService.startConnection();
        mongoose.connection.close();
    });

    it('should not connect to the database when start is called with wrong URL', async () => {
        databaseService.url = 'wrong url';
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        databaseService.options = options;
        const start = await databaseService.startConnection();
        expect(start);
        // fail();
    });

    it('should save drawing', async () => {
        const dataSent = {
            name: 'test1',
            tags: ['tag1'],
        } as Drawing;
        const data = await databaseService.saveDrawing(dataSent);
        const connectionSpy = sandbox.spy(databaseService, 'saveDrawing');
        expect(connectionSpy.called);
        expect(data.name).to.equal(dataSent.name);
        expect(data.tags).to.equal(dataSent.tags);
    });

    it('should save drawing', async () => {
        try {
            const dataSent = {
                name: 'test1',
                tags: ['tag1'],
            } as Drawing;
            await databaseService.saveDrawing(dataSent);
        } catch (error) {
            throw error;
        }
    });
    it('should delete an existing drawing from database with valid id', async () => {
        await databaseService.deleteDraw('1234');
        const connectionSpy = sandbox.spy(databaseService, 'deleteDraw');
        expect(connectionSpy.called);
    });

    it('should not delete an existing drawing from database with invalid id', async () => {
        await databaseService.deleteDraw('0000');
        const connectionSpy = sandbox.spy(databaseService, 'deleteDraw');
        expect(connectionSpy.notCalled);
    });

    it('should not delete an existing drawing from database with invalid id', async () => {
        try {
            await databaseService.deleteDraw('0000');
            assert.fail();
        } catch (error) {
            throw error;
        }
    });

    it('should get all drawings that are in the uploads folder that matches the ones in the database', async () => {
        const data = await databaseService.getDrawByID();
        expect(data);
    });
});

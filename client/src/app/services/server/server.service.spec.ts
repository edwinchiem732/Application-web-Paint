import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ServerService } from './server.service';

describe('ServerService', () => {
    let service: ServerService;
    let httpMock: HttpTestingController;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ServerService);
        httpMock = TestBed.inject(HttpTestingController);
        // tslint:disable:no-string-literal
        baseUrl = service['BASE_URL'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add drawing when sending a POST request (HTTP called conce)', (done: DoneFn) => {
        const drawingSent = { _id: '12345', name: 'test', tags: 'tag1', url: 'url' };
        // tslint:disable-next-line: deprecation
        service.addDrawing(drawingSent).subscribe(
            () => {
                done();
            },
            () => {
                done();
            },
        );
        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('POST');
        req.flush(drawingSent);
    });

    it('should return expected data from databse sending a GET (HTTPClient called once)', (done: DoneFn) => {
        const expectedData = { name: 'test', tags: 'tag1' };
        // tslint:disable-next-line: deprecation
        service.getDrawingUploads().subscribe(
            // tslint:disable-next-line: no-any
            (data: any) => {
                expect(data.name).toEqual(expectedData.name, 'name check');
                expect(data.tags).toEqual(expectedData.tags, 'tags check');
                done();
            },
            () => {
                done();
            },
        );

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        //  send the request
        req.flush(expectedData);
    });

    it('should delete data from databse sending a DELETE (HTTPClient called once)', (done: DoneFn) => {
        const id = '12345';
        const url = `${baseUrl}/${id}`;
        // tslint:disable-next-line: deprecation
        service.deleteDrawing(id).subscribe(
            () => {
                done();
            },
            () => {
                done();
            },
        );
        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('DELETE');
        req.flush(id);
    });
});

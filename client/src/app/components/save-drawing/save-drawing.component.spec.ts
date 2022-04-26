import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerService } from '@app/services/server/server.service';
// import { of } from 'rxjs';
import { SaveDrawingComponent } from './save-drawing.component';

describe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;
    // tslint:disable-next-line: prefer-const
    let httpClient: jasmine.SpyObj<HttpClient>;
    // tslint:disable-next-line: prefer-const
    let matDialog: MatDialog;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let serverService: ServerService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(async(() => {
        canvasTestHelper = new CanvasTestHelper();
        drawingServiceSpy = jasmine.createSpyObj('drawingServiceSpy', ['baseCtx', 'previewCtx', 'copiedCanvas', 'imageCanvas', 'copyCanvas']);
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        drawingServiceSpy.baseCtx = baseCtxClone;
        drawingServiceSpy.previewCtx = previewCtxClone;
        drawingServiceSpy.canvas = canvas;

        httpClient = jasmine.createSpyObj('HttpClient', ['post']);

        serverService = new ServerService(httpClient);
        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClient, useValue: httpClient },
                { provide: MatDialog, useValue: matDialog },
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ServerService, useValue: serverService },
            ],
            declarations: [SaveDrawingComponent],
        }).compileComponents();
        drawingServiceSpy = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add a tag', () => {
        const tag = 'dog';
        const event = { value: tag } as MatChipInputEvent;
        component.tags.push(event.value);
        component.add(event);
        expect(component.tags[component.tags.length - 1]).toEqual(tag);
    });

    it("should not add a tag if there's a number in the tag", () => {
        const tag = 'dog1';
        const event = { value: tag } as MatChipInputEvent;
        component.tags.push(event.value);
        component.remove(tag);
        component.add(event);
        expect(component.tags[component.tags.length - 1]).not.toEqual(tag);
    });

    it("should not add a tag if there's a space in the tag", () => {
        const tag = 'dogs ';
        const event = { value: tag } as MatChipInputEvent;
        component.tags.push(event.value);
        component.remove(tag);
        component.add(event);
        expect(component.tags[component.tags.length - 1]).not.toEqual(tag);
    });

    it("should not add a tag if there's more than 5 letters in the tag", () => {
        const tag = 'dogsAreTheBest';
        const event = { value: tag } as MatChipInputEvent;
        component.tags.push(event.value);
        component.remove(tag);
        component.add(event);
        expect(component.tags[component.tags.length - 1]).not.toEqual(tag);
    });

    // it('should add drawing when save drawing', async (done: DoneFn) => {
    //     const url = drawingServiceSpy.copyCanvas();
    //     // const spydrawingServiceSpy = spyOn(drawingServiceSpy, 'copyCanvas').and.callThrough();
    //     const createdDrawing = { name: 'test1', tags: 'tag', url };
    //     const spyServer = spyOn(serverService, 'addDrawing').and.returnValue(of(createdDrawing));

    //     // serverService.addDrawing(createdDrawing).subscribe(
    //     //     () => {
    //     //         done();
    //     //     },
    //     //     () => {
    //     //         fail;
    //     //         done();
    //     //     },
    //     // );
    //     // const spyServerService = spyOn(serverService, 'addDrawing');
    //     component.addDrawing();
    //     expect(drawingServiceSpy.copyCanvas).toHaveBeenCalled();
    //     expect(spyServer).toHaveBeenCalled();
    // });
});

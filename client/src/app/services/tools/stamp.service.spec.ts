import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampService } from '@app/services/tools/stamp.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal

describe('StampService', () => {
    let service: StampService;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let secondCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let drawImageSpy: jasmine.SpyObj<any>;
    let generateSpy: jasmine.SpyObj<any>;

    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'secondCtx']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        secondCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingClone }],
        });
        service = TestBed.inject(StampService);
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.secondCtx = secondCtxClone;
        drawingClone.canvas = canvas;
        service.drawingService = drawingClone;
        service.drawingService.baseCtx = drawingClone.baseCtx;
        service.drawingService.secondCtx = drawingClone.secondCtx;
        service.drawingService.canvas = drawingClone.canvas;
        service['currentImage'] = new Image();
        drawImageSpy = spyOn<any>(drawingClone.baseCtx, 'drawImage').and.callThrough();
        generateSpy = spyOn<any>(service, 'generateImage').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call generateImage() onMouseMove', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        service.onMouseMove(event);
        expect(service['canvasWidth']).toEqual(drawingClone.secondCtx.canvas.offsetWidth / 2);
        expect(service['canvasHeight']).toEqual(drawingClone.secondCtx.canvas.offsetHeight / 2);
        expect(generateSpy).toHaveBeenCalled();
    });

    it('should call generateImage() onMouseMove with offset not equal', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        service.onMouseMove(event);
        expect(service['offSetX']).toEqual(0);
        expect(service['offSetY']).toEqual(0);
        expect(generateSpy).toHaveBeenCalled();
    });

    it('should set currentStampName', () => {
        const event = { x: 15, y: 6 } as MouseEvent;

        service.onMouseDown(event);
        const eventLoad = new Event('onload');
        service['stampPrint'].dispatchEvent(eventLoad);

        expect(service['mouseCenterX']).toEqual(event.offsetX - service['canvasWidth']);
        expect(service['mouseCenterY']).toEqual(event.offsetY - service['canvasHeight']);
        expect(drawImageSpy).not.toHaveBeenCalled();
    });

    it('should set display', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        service.onMouseEnter(event);
        expect(drawingClone.secondCtx.canvas.style.display).toEqual('inline-block');
    });

    it('should set display', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        service.onMouseOut(event);
        expect(drawingClone.secondCtx.canvas.style.display).toEqual('none');
    });

    it('should add 15 to angle', () => {
        const oldAngle = service['angle'];
        service['isWheelUp'] = true;
        service['isAltPressed'] = false;
        service.changeAngle();
        expect(service['angle']).toEqual(oldAngle);
    });

    it('should add 1 to angle', () => {
        const oldAngle = service['angle'];
        service['isWheelUp'] = true;
        service['isAltPressed'] = true;
        service.changeAngle();
        expect(service['angle']).toEqual(oldAngle);
    });

    it('should subtract 15 to angle', () => {
        const oldAngle = service['angle'];
        service['isWheelUp'] = false;
        service['isAltPressed'] = false;
        service.changeAngle();
        expect(service['angle']).toEqual(oldAngle + 15);
    });

    it('should subtract 1 to angle', () => {
        const oldAngle = service['angle'];
        service['isWheelUp'] = false;
        service['isAltPressed'] = true;
        service.changeAngle();
        expect(service['angle']).toEqual(oldAngle + 1);
    });
});

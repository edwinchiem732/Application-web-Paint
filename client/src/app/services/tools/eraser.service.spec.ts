import { inject, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser.service';

/* tslint:disable:no-any */
/* tslint:disable:no-string-literal */

describe('Service: EraserService', () => {
    let service: EraserService;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let eraserCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let drawLineSpy: jasmine.Spy<any>;
    let generateSpy: jasmine.SpyObj<any>;

    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'clearCanvas', 'eraserCtx']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        eraserCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        TestBed.configureTestingModule({
            providers: [EraserService],
        });
        service = TestBed.inject(EraserService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.previewCtx = previewCtxClone;
        drawingClone.eraserCtx = eraserCtxClone;
        drawingClone.canvas = canvas;
        service.drawingService = drawingClone;
        service.drawingService.baseCtx = drawingClone.baseCtx;
        service.drawingService.previewCtx = drawingClone.previewCtx;
        service.drawingService.eraserCtx = drawingClone.eraserCtx;
        service.drawingService.canvas = drawingClone.canvas;
        service['currentImage'] = new Image();
        generateSpy = spyOn<any>(service, 'generateImage').and.callThrough();
    });

    // tslint:disable-next-line: no-shadowed-variable
    it('should be created', inject([EraserService], (service: EraserService) => {
        expect(service).toBeTruthy();
    }));

    it('should call generateImage() onMouseMove', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        service.onMouseMove(event);
        expect(service['canvasWidth']).toEqual(drawingClone.eraserCtx.canvas.offsetWidth / 2);
        expect(service['canvasHeight']).toEqual(drawingClone.eraserCtx.canvas.offsetHeight / 2);
        expect(generateSpy).toHaveBeenCalled();
    });

    it(' onMouseDown', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);
        expect(service.mouseMove).toEqual(false);
    });

    it(' onMouseUp first if', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        service.mouseDown = true;
        service.mouseMove = true;
        service.onMouseUp(event);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp second if', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        service.mouseDown = true;
        service.mouseMove = false;
        service.onMouseUp(event);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp else', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        service.mouseDown = false;
        service.mouseMove = false;
        service.onMouseUp(event);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const spyMove = spyOn<any>(drawingClone, 'clearCanvas').and.stub();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(event);
        expect(spyMove).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const spyMove = spyOn<any>(drawingClone, 'clearCanvas').and.stub();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(event);
        expect(spyMove).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('should set display', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        service.onMouseEnter(event);
        expect(drawingClone.eraserCtx.canvas.style.display).toEqual('inline-block');
    });

    it('should set display', () => {
        const event = { x: 15, y: 6 } as MouseEvent;
        service.onMouseOut(event);
        expect(drawingClone.eraserCtx.canvas.style.display).toEqual('none');
    });
});

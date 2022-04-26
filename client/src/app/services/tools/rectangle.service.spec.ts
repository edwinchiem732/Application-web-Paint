import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';

describe('RectangleService', () => {
    let service: RectangleService;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let shiftEvent: KeyboardEvent;

    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'clearCanvas']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingClone }],
        });
        service = TestBed.inject(RectangleService);
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.previewCtx = previewCtxClone;
        drawingClone.canvas = canvas;
        service.drawingService = drawingClone;
        service.drawingService.baseCtx = drawingClone.baseCtx;
        service.drawingService.previewCtx = drawingClone.previewCtx;
        service.drawingService.canvas = drawingClone.canvas;

        shiftEvent = new KeyboardEvent('keypress', {
            key: 'Shift',
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set width', () => {
        const width = 5;
        expect(service.width).toEqual(width);
    });
    it('should mouseDown should be false', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Right } as MouseEvent;
        // tslint:disable-next-line: no-any
        const spyMouseDown = spyOn<any>(service, 'onMouseDown').and.stub();
        // tslint:disable-next-line: no-any
        const spyBorder = spyOn<any>(service, 'onMouseUp').and.stub();
        // tslint:disable-next-line: no-any
        const spyFill = spyOn<any>(service, 'rectangleFill').and.stub();

        service.onMouseDown(event);
        service.onShiftDown(shiftEvent);
        expect(service.square).toEqual(true);
        service.onShiftUp(shiftEvent);
        expect(service.square).toEqual(false);
        expect(service.mouseDown).toEqual(false);
        expect(spyMouseDown).toHaveBeenCalled();
        expect(spyBorder).not.toHaveBeenCalled();
        expect(spyFill).not.toHaveBeenCalled();
    });

    it('should call clearCanvas and rectangleSelect', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const mouseMove = { pageX: 300, pageY: 200, button: MouseButton.Left } as MouseEvent;
        service.rectangleMode = 'contour';
        // tslint:disable-next-line: no-any
        const spySelect = spyOn<any>(service, 'rectangleSelect').and.callThrough();
        // tslint:disable-next-line: no-any
        const spyFill = spyOn<any>(service, 'rectangleFill').and.callThrough();

        const mousePositionX = mouseMove.pageX - event.pageX;
        const mousePositionY = mouseMove.pageY - event.pageY;
        const sideBarWidth = 350;
        const positionX = event.pageX - sideBarWidth;
        const positionY = event.pageY;
        service.onMouseDown(event);
        service.onMouseMove(mouseMove);
        expect(service.mouseDownCoord.x).toEqual(positionX);
        expect(service.mouseDownCoord.y).toEqual(positionY);
        expect(spySelect).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(spyFill).not.toHaveBeenCalled();
        expect(service.distanceX).toEqual(mousePositionX);
        expect(service.distanceY).toEqual(mousePositionY);
    });

    it('should call fillrect and rectangleSelect', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const mouseMove = { pageX: 300, pageY: 200, button: MouseButton.Left } as MouseEvent;
        service.mouseDown = true; // car il y a la condition if qui a besoins detre a true.
        service.rectangleMode = 'plein';
        // tslint:disable-next-line: no-any
        const spySelect = spyOn<any>(service, 'rectangleSelect').and.callThrough();
        // tslint:disable-next-line: no-any
        const spyFill = spyOn<any>(service, 'rectangleFill').and.callThrough();

        service.onMouseDown(event);
        service.onMouseMove(mouseMove);
        expect(spySelect).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
    });

    it('should not call clearCanvas and rectangleSelect', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.mouseDown = false;
        service.onMouseMove(event);
        expect(drawingClone.clearCanvas).not.toHaveBeenCalled();
    });

    it('onShiftUp while rectangleMode = plein', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);
        service.rectangleMode = 'plein';
        service.onShiftDown(shiftEvent);
        expect(service.square).toEqual(true);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('onShiftUp while rectangleMode = pleinContour', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);
        service.rectangleMode = 'pleinContour';
        service.onShiftDown(shiftEvent);
        expect(service.square).toEqual(true);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('should call onShiftUp to test the square', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);
        service.onShiftDown(shiftEvent);
        expect(service.square).toEqual(true);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('onShifDown while rectangleMode = plein', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);
        service.rectangleMode = 'plein';
        service.onShiftUp(shiftEvent);
        expect(service.square).toEqual(false);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('onShifDown while rectangleMode = pleinContour', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);
        service.rectangleMode = 'pleinContour';
        service.onShiftUp(shiftEvent);
        expect(service.square).toEqual(false);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('should call onShifDown to test square', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);
        service.onShiftUp(shiftEvent);
        expect(service.square).toEqual(false);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });
});

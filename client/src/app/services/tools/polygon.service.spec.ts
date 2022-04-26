import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygonService } from './polygon.service';

describe('Service: Polygone', () => {
    let service: PolygonService;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'clearCanvas']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingClone }],
        });
        service = TestBed.inject(PolygonService);
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.previewCtx = previewCtxClone;
        drawingClone.canvas = canvas;
        service.drawingService = drawingClone;
        service.drawingService.baseCtx = drawingClone.baseCtx;
        service.drawingService.previewCtx = drawingClone.previewCtx;
        service.drawingService.canvas = drawingClone.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' should call mouse down when receiving a mouse down event', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const mouseEventSpy = spyOn(service, 'onMouseDown').and.callThrough();

        const sideBarWidth = 350;
        const mousePositionX = event.pageX - sideBarWidth;

        service.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(service.mouseDownCoord.x).toEqual(mousePositionX);
        expect(service.mouseDownCoord.y).toEqual(event.pageY);
    });

    it(' should call mouse move when receiving a mouse move event', () => {
        const event = { pageX: 400, pageY: 30, button: MouseButton.Left } as MouseEvent;
        const mouseEventSpy = spyOn(service, 'onMouseMove').and.stub();

        service.onMouseDown(event);
        service.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should polygonFill with onMouseUp', () => {
        const event = { offsetX: 40, offsetY: 550, button: MouseButton.Left } as MouseEvent;
        const mouseEventSpy = spyOn(service, 'onMouseUp').and.callThrough();
        const shapeFillSpy = spyOn(service, 'polygonFill').and.callThrough();

        service.polygonMode = '';
        service.onMouseDown(event);
        service.onMouseMove(event);
        service.onMouseUp(event);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(shapeFillSpy).toHaveBeenCalled();
    });

    it('should call polygoneSelect with onMouseMove and onMouseDown', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const shapeSelectSpy = spyOn(service, 'polygoneSelect').and.callThrough();

        service.polygonMode = 'pleinContour';
        service.onMouseDown(event);
        service.onMouseMove(event);

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(shapeSelectSpy).toHaveBeenCalled();
    });

    it('should call polygoneSelect, polygonFill and polygoneBorder', () => {
        const event = { offsetX: 300, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const shapeSelectSpy = spyOn(service, 'polygoneSelect').and.callThrough();
        const shapeFillSpy = spyOn(service, 'polygonFill').and.callThrough();
        // tslint:disable-next-line: no-any
        const spyStyle = spyOn<any>(service, 'traceStyle').and.callThrough();
        // tslint:disable-next-line: no-any
        const spyShapePerimeter = spyOn<any>(service, 'polygoneBorder').and.callThrough();

        service.polygonMode = 'plein';
        service.onMouseDown(event);
        service.onMouseMove(event);

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(shapeSelectSpy).toHaveBeenCalled();
        expect(shapeFillSpy).toHaveBeenCalled();
        expect(spyStyle).toHaveBeenCalled();
        expect(spyShapePerimeter).toHaveBeenCalled();
    });

    it('should call traceStyle', () => {
        const event = { movementX: 5, movementY: 6, button: MouseButton.Left } as MouseEvent;
        // tslint:disable-next-line: no-any
        const spyStyle = spyOn<any>(service, 'traceStyle').and.callThrough();

        service.polygonMode = 'contour';
        service.onMouseDown(event);
        service.onMouseMove(event);

        expect(spyStyle).toHaveBeenCalled();
    });

    it('should mouseDown should be false', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Right } as MouseEvent;
        // tslint:disable-next-line: no-any
        const spyMouseDown = spyOn<any>(service, 'onMouseDown').and.stub();
        // tslint:disable-next-line: no-any
        const spyBorder = spyOn<any>(service, 'onMouseUp').and.stub();
        // tslint:disable-next-line: no-any
        const spyFill = spyOn<any>(service, 'polygonFill').and.stub();

        service.onMouseDown(event);
        expect(service.mouseDown).toEqual(false);
        expect(spyMouseDown).toHaveBeenCalled();
        expect(spyBorder).not.toHaveBeenCalled();
        expect(spyFill).not.toHaveBeenCalled();
    });

    it('should call clearCanvas and polygoneSelect with contour', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const mouseMove = { pageX: 300, pageY: 200, button: MouseButton.Left } as MouseEvent;
        service.polygonMode = 'contour';
        // tslint:disable-next-line: no-any
        const spySelect = spyOn<any>(service, 'polygoneSelect').and.callThrough();
        // tslint:disable-next-line: no-any

        const sideBarWidth = 350;
        const positionX = event.pageX - sideBarWidth;
        const positionY = event.pageY;
        service.onMouseDown(event);
        service.onMouseMove(mouseMove);
        expect(service.mouseDownCoord.x).toEqual(positionX);
        expect(service.mouseDownCoord.y).toEqual(positionY);
        expect(spySelect).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('should call polygoneSelect and clearCanvas with plein', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const mouseMove = { pageX: 300, pageY: 200, button: MouseButton.Left } as MouseEvent;
        service.mouseDown = true;
        service.polygonMode = 'plein';
        // tslint:disable-next-line: no-any
        const spySelect = spyOn<any>(service, 'polygoneSelect').and.callThrough();
        // tslint:disable-next-line: no-any
        const spyFill = spyOn<any>(service, 'polygonFill').and.callThrough();

        service.onMouseDown(event);
        service.onMouseMove(mouseMove);
        expect(spySelect).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
    });

    it('should call polygoneSelect and polygonFill with pleinContour', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const mouseMove = { pageX: 300, pageY: 200, button: MouseButton.Left } as MouseEvent;
        service.mouseDown = true;
        service.polygonMode = 'pleinContour';
        // tslint:disable-next-line: no-any
        const spySelect = spyOn<any>(service, 'polygoneSelect').and.callThrough();
        // tslint:disable-next-line: no-any
        const spyFill = spyOn<any>(service, 'polygonFill').and.callThrough();

        service.onMouseDown(event);
        service.onMouseMove(mouseMove);
        expect(spySelect).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
    });

    it('should call clearCanvas', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.mouseDown = false;
        service.onMouseMove(event);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });
});

import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse.service';

/* tslint:disable:no-string-literal */
describe('EllipseService', () => {
    let service: EllipseService;
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
        service = TestBed.inject(EllipseService);
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

    it(' should call ellipseService mouse down when receiving a mouse down event', () => {
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
    it(' should call the ellipseService mouse move when receiving a mouse move event', () => {
        const event = { pageX: 400, pageY: 30, button: MouseButton.Left } as MouseEvent;

        const mousePositionX = 50;
        const mousePositionY = 30;
        const mouseEventSpy = spyOn(service, 'onMouseMove').and.callThrough();
        const shapeSelect = spyOn(service, 'shapeSelect').and.callThrough();

        service.onMouseDown(event);
        service.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(service.mousePosition.x).toEqual(mousePositionX);
        expect(service.mousePosition.y).toEqual(mousePositionY);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(shapeSelect).toHaveBeenCalled();
    });

    it(' should call the ellipse mouse up when receiving a mouse up event', () => {
        const event = { offsetX: 40, offsetY: 550, button: MouseButton.Left } as MouseEvent;
        const mouseEventSpy = spyOn(service, 'onMouseUp').and.callThrough();
        const shapeFillSpy = spyOn(service, 'shapeFill').and.callThrough();
        const ellipseSpy = spyOn(baseCtxClone, 'ellipse').and.callThrough();

        service.ellipseTrace = '';
        service.onMouseDown(event);
        service.onMouseMove(event);
        service.onMouseUp(event);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(shapeFillSpy).toHaveBeenCalled();
        expect(ellipseSpy).toHaveBeenCalled();
    });

    it('should call onShiftDown, circle should be true, shapefill should call arc for the circle ', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const shiftEventSpy = spyOn(service, 'onShiftDown').and.callThrough();
        const shapeSelectSpy = spyOn(service, 'shapeSelect').and.callThrough();
        const circleSpy = spyOn(previewCtxClone, 'arc').and.callThrough();

        service.ellipseTrace = 'pleinContour';
        service.onMouseDown(event);
        service.onMouseMove(event);
        service.onShiftDown(shiftEvent);

        expect(shiftEventSpy).toHaveBeenCalled();
        expect(service.circle).toBeTruthy();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(shapeSelectSpy).toHaveBeenCalled();
        expect(circleSpy).toHaveBeenCalled();
    });
    it('it should call onShiftUp', () => {
        const event = { offsetX: 300, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const shiftEventSpy = spyOn(service, 'onShiftDown').and.callThrough();
        const shapeSelectSpy = spyOn(service, 'shapeSelect').and.callThrough();
        const shapeFillSpy = spyOn(service, 'shapeFill').and.callThrough();
        // tslint:disable-next-line: no-any
        const spyStyle = spyOn<any>(service, 'traceStyle').and.callThrough();
        // tslint:disable-next-line: no-any
        const spyShapePerimeter = spyOn<any>(service, 'shapePerimeter').and.callThrough();

        service.ellipseTrace = 'plein';
        service.onMouseDown(event);
        service.onMouseMove(event);
        service.onShiftDown(shiftEvent);
        service.onShiftUp(shiftEvent);

        expect(shiftEventSpy).toHaveBeenCalled();
        expect(service.circle).toBeFalsy();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(shapeSelectSpy).toHaveBeenCalled();
        expect(shapeFillSpy).toHaveBeenCalled();
        expect(spyStyle).toHaveBeenCalled();
        expect(spyShapePerimeter).toHaveBeenCalled();
    });

    it('should call shapeFill, traceStyle and ellipse', () => {
        const event = { movementX: 5, movementY: 6, button: MouseButton.Left } as MouseEvent;
        // tslint:disable-next-line: no-any
        const spyStyle = spyOn<any>(service, 'traceStyle').and.callThrough();
        const ellipseSpy = spyOn(previewCtxClone, 'ellipse').and.callThrough();

        service.ellipseTrace = 'contour';
        service.onMouseDown(event);
        service.onMouseMove(event);

        expect(service.circle).toBeFalsy();
        expect(ellipseSpy).toHaveBeenCalled();
        expect(spyStyle).toHaveBeenCalled();
    });
    it('should go throw on mouseMove getPositions and clear preview canevas', () => {
        const eventMove = { pageX: -500, pageY: -40 } as MouseEvent;
        const eventMouseDown = { pageX: 200, pageY: 100, button: MouseButton.Right } as MouseEvent;

        service.onMouseDown(eventMouseDown);
        service.onMouseMove(eventMove);
        service.onShiftDown(shiftEvent);

        expect(service.circle).toBeTruthy();
        service.onShiftUp(shiftEvent);

        expect(service.circle).toBeFalsy();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(service.mouseDown).toBeFalsy();
    });

    it('should call shapeselect, shapeFill, shapeParameter and verify diamater, raidus, center and circle radius', () => {
        const event = { pageX: 400, pageY: 30, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 600, pageY: 40, button: MouseButton.Left } as MouseEvent;

        const sidebarWidth = 350;
        const diameterX = eventMove.pageX - event.pageX;
        const diameterY = eventMove.pageY - event.pageY;
        const radiusX = diameterX / 2;
        const radiusY = diameterY / 2;
        const centerX = event.pageX - sidebarWidth + radiusX;
        const centerY = event.pageY + radiusY;
        const circleRadius = radiusY;

        const spyshapeFill = spyOn(service, 'shapeFill').and.callThrough();
        const spyShapePerimeter = spyOn(service, 'shapePerimeter').and.callThrough();

        service.onMouseDown(event);
        service.onMouseMove(eventMove);

        expect(service['diameter'].x).toEqual(diameterX);
        expect(service['diameter'].y).toEqual(diameterY);
        expect(service.radius.x).toEqual(radiusX);
        expect(service.radius.y).toEqual(radiusY);
        expect(service.center.x).toEqual(centerX);
        expect(service.center.y).toEqual(centerY);
        expect(service.circleRadius).toEqual(circleRadius);
        expect(spyshapeFill).toHaveBeenCalled();
        expect(spyShapePerimeter).toHaveBeenCalled();
    });
});

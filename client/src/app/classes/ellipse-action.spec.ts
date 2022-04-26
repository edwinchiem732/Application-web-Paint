import { TestBed } from '@angular/core/testing';
import { BORDER_WIDTH, CIRCLE_RADIUS } from '@app/constant/constants';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';
import { CanvasTestHelper } from './canvas-test-helper';
import { EllipseAction } from './ellipse-action';
import { Vec2 } from './vec2';

describe('EllipseAction', () => {
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let drawingServiceStub: DrawingService;

    let ellipseActionStub: EllipseAction;
    let ellipseServiceStub: EllipseService;
    let undoRedoServiceStub: UndoRedoService;
    let colorServiceStub: ColorService;

    let borderColor: string;
    let fillColor: string;
    let borderWidth: number;
    let ellipseTrace: string;
    let center: Vec2;
    let radius: Vec2;
    let circleRadius: number;
    let isCircleOn: boolean;

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        drawingServiceStub = new DrawingService();
        colorServiceStub = new ColorService();
        undoRedoServiceStub = new UndoRedoService(drawingServiceStub);
        ellipseServiceStub = new EllipseService(drawingServiceStub, colorServiceStub, undoRedoServiceStub);

        drawingServiceStub.baseCtx = baseCtxClone;
        drawingServiceStub.previewCtx = previewCtxClone;
        drawingServiceStub.canvas = canvas;

        borderColor = '#000000';
        fillColor = '#010101';
        ellipseTrace = 'pleinContour';
        isCircleOn = false;
        borderWidth = BORDER_WIDTH;
        center = { x: 177, y: 250 };
        circleRadius = CIRCLE_RADIUS;
        radius = { x: 79, y: 73 };

        ellipseActionStub = new EllipseAction(
            drawingServiceStub,
            ellipseServiceStub,
            borderColor,
            fillColor,
            borderWidth,
            ellipseTrace,
            center,
            radius,
            circleRadius,
            isCircleOn,
        );

        ellipseServiceStub.center = center;
        ellipseServiceStub.radius = radius;
        ellipseServiceStub.circle = isCircleOn;
        ellipseServiceStub.ellipseTrace = ellipseTrace;
        ellipseServiceStub.circleRadius = circleRadius;
        drawingServiceStub.baseCtx.lineCap = 'square';
        drawingServiceStub.baseCtx.lineWidth = borderWidth;
        drawingServiceStub.baseCtx.strokeStyle = borderColor;
        drawingServiceStub.baseCtx.fillStyle = fillColor;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: EllipseAction, useValue: ellipseActionStub },
                { provide: EllipseService, useValue: ellipseServiceStub },
                { provide: UndoRedoService, useValue: undoRedoServiceStub },
                { provide: ColorService, useValue: colorServiceStub },
            ],
        });

        ellipseServiceStub = TestBed.inject(EllipseService);
        ellipseActionStub = TestBed.inject(EllipseAction);
    });

    it('should create an instance', () => {
        expect(
            new EllipseAction(
                drawingServiceStub,
                ellipseServiceStub,
                borderColor,
                fillColor,
                borderWidth,
                ellipseTrace,
                center,
                radius,
                circleRadius,
                isCircleOn,
            ),
        ).toBeTruthy();
    });

    it('should apply actions for ellipse action when "pleinContour" is the chosen ellipse trace when circle is false', () => {
        const spy = spyOn(ellipseServiceStub, 'shapeFill').and.callThrough();

        ellipseActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(borderColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(drawingServiceStub.baseCtx.lineCap).toEqual('square');
        expect(ellipseServiceStub.circleRadius).toEqual(circleRadius);
        expect(ellipseServiceStub.center.x).toEqual(center.x);
        expect(ellipseServiceStub.center.y).toEqual(center.y);
        expect(ellipseServiceStub.radius.x).toEqual(radius.x);
        expect(ellipseServiceStub.radius.y).toEqual(radius.y);
        expect(ellipseServiceStub.circle).toEqual(isCircleOn);
        expect(ellipseServiceStub.ellipseTrace).toEqual(ellipseTrace);
    });

    it('should apply actions for ellipse action when "contour" is the chosen ellipse trace when circle is false', () => {
        ellipseTrace = 'contour';
        isCircleOn = false;

        ellipseActionStub = new EllipseAction(
            drawingServiceStub,
            ellipseServiceStub,
            borderColor,
            fillColor,
            borderWidth,
            ellipseTrace,
            center,
            radius,
            circleRadius,
            isCircleOn,
        );

        ellipseServiceStub.circle = isCircleOn;
        ellipseServiceStub.ellipseTrace = ellipseTrace;
        const spy = spyOn(ellipseServiceStub, 'shapeFill').and.callThrough();

        ellipseActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(borderColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(drawingServiceStub.baseCtx.lineCap).toEqual('square');
        expect(ellipseServiceStub.circleRadius).toEqual(circleRadius);
        expect(ellipseServiceStub.center.x).toEqual(center.x);
        expect(ellipseServiceStub.center.y).toEqual(center.y);
        expect(ellipseServiceStub.radius.x).toEqual(radius.x);
        expect(ellipseServiceStub.radius.y).toEqual(radius.y);
        expect(ellipseServiceStub.circle).toEqual(isCircleOn);
        expect(ellipseServiceStub.ellipseTrace).toEqual(ellipseTrace);
    });

    it('should apply actions for ellipse action when "plein" is the chosen ellipse trace when circle is off', () => {
        ellipseTrace = 'plein';
        isCircleOn = false;

        ellipseActionStub = new EllipseAction(
            drawingServiceStub,
            ellipseServiceStub,
            borderColor,
            fillColor,
            borderWidth,
            ellipseTrace,
            center,
            radius,
            circleRadius,
            isCircleOn,
        );

        ellipseServiceStub.circle = isCircleOn;
        ellipseServiceStub.ellipseTrace = ellipseTrace;

        const spy = spyOn(ellipseServiceStub, 'shapeFill');

        ellipseActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.fillStyle).toEqual(fillColor);
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(borderColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(drawingServiceStub.baseCtx.lineCap).toEqual('square');
        expect(ellipseServiceStub.circleRadius).toEqual(circleRadius);
        expect(ellipseServiceStub.center.x).toEqual(center.x);
        expect(ellipseServiceStub.center.y).toEqual(center.y);
        expect(ellipseServiceStub.radius.x).toEqual(radius.x);
        expect(ellipseServiceStub.radius.y).toEqual(radius.y);
        expect(ellipseServiceStub.circle).toEqual(isCircleOn);
        expect(ellipseServiceStub.ellipseTrace).toEqual(ellipseTrace);
    });
});

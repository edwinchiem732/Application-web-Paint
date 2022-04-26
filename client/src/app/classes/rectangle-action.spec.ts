import { TestBed } from '@angular/core/testing';
import { BORDER_WIDTH_REC, DISTANCE_X, DISTANCE_Y } from '@app/constant/constants';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';
import { CanvasTestHelper } from './canvas-test-helper';
import { RectangleAction } from './rectangle-action';
import { Vec2 } from './vec2';

describe('RectangleAction', () => {
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let drawingServiceStub: DrawingService;

    let rectangleActionStub: RectangleAction;
    let rectangleServiceStub: RectangleService;
    let undoRedoServiceStub: UndoRedoService;
    let colorServiceStub: ColorService;

    let distanceX: number;
    let distanceY: number;
    let borderColor: string;
    let fillColor: string;
    let borderWidth: number;
    let rectangleMode: string;
    let mouseDownCoord: Vec2;
    let isSquareOn: boolean;

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        distanceX = DISTANCE_X;
        distanceY = DISTANCE_Y;
        mouseDownCoord = { x: 84, y: 117 };
        borderWidth = BORDER_WIDTH_REC;
        borderColor = '#000000';
        fillColor = '#010101';
        rectangleMode = 'plein';
        isSquareOn = false;

        drawingServiceStub = new DrawingService();
        colorServiceStub = new ColorService();
        undoRedoServiceStub = new UndoRedoService(drawingServiceStub);
        rectangleServiceStub = new RectangleService(drawingServiceStub, colorServiceStub, undoRedoServiceStub);

        drawingServiceStub.baseCtx = baseCtxClone;
        drawingServiceStub.previewCtx = previewCtxClone;
        drawingServiceStub.canvas = canvas;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: RectangleAction, useValue: rectangleActionStub },
                { provide: RectangleService, useValue: rectangleServiceStub },
                { provide: UndoRedoService, useValue: undoRedoServiceStub },
                { provide: ColorService, useValue: colorServiceStub },
            ],
        });

        rectangleActionStub = new RectangleAction(
            drawingServiceStub,
            rectangleServiceStub,
            borderColor,
            fillColor,
            borderWidth,
            rectangleMode,
            mouseDownCoord,
            distanceX,
            distanceY,
            isSquareOn,
        );

        drawingServiceStub.baseCtx.strokeStyle = borderColor;
        drawingServiceStub.baseCtx.lineWidth = borderWidth;
        rectangleServiceStub.square = isSquareOn;
        rectangleServiceStub.distanceX = distanceX;
        rectangleServiceStub.distanceY = distanceY;
        drawingServiceStub.baseCtx.lineCap = 'square';
        rectangleServiceStub.rectangleMode = rectangleMode;

        rectangleServiceStub = TestBed.inject(RectangleService);
        rectangleActionStub = TestBed.inject(RectangleAction);
    });

    it('should create an instance', () => {
        expect(
            new RectangleAction(
                drawingServiceStub,
                rectangleServiceStub,
                borderColor,
                fillColor,
                borderWidth,
                rectangleMode,
                mouseDownCoord,
                distanceX,
                distanceY,
                isSquareOn,
            ),
        ).toBeTruthy();
    });

    it('should apply actions for rectangle action when "contour" is the rectangle mode chosen', () => {
        isSquareOn = false;
        rectangleMode = 'contour';

        rectangleServiceStub.square = isSquareOn;
        rectangleServiceStub.rectangleMode = rectangleMode;

        rectangleActionStub = new RectangleAction(
            drawingServiceStub,
            rectangleServiceStub,
            borderColor,
            fillColor,
            borderWidth,
            rectangleMode,
            mouseDownCoord,
            distanceX,
            distanceY,
            isSquareOn,
        );

        const spy = spyOn(rectangleServiceStub, 'rectangleBorder').and.callThrough();

        rectangleActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(borderColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(rectangleServiceStub.distanceX).toEqual(distanceX);
        expect(rectangleServiceStub.distanceY).toEqual(distanceY);
        expect(rectangleServiceStub.rectangleMode).toEqual(rectangleMode);
        expect(rectangleServiceStub.square).toEqual(isSquareOn);
    });

    it('should apply actions for rectangle action when "contour" is the rectangle mode chosen and square is on', () => {
        isSquareOn = true;
        rectangleMode = 'contour';

        rectangleServiceStub.square = isSquareOn;
        rectangleServiceStub.rectangleMode = rectangleMode;

        rectangleActionStub = new RectangleAction(
            drawingServiceStub,
            rectangleServiceStub,
            borderColor,
            fillColor,
            borderWidth,
            rectangleMode,
            mouseDownCoord,
            distanceX,
            distanceY,
            isSquareOn,
        );

        const spy = spyOn(rectangleServiceStub, 'rectangleBorder').and.callThrough();

        rectangleActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(borderColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(rectangleServiceStub.distanceX).toEqual(distanceX);
        expect(rectangleServiceStub.distanceY).toEqual(distanceY);
        expect(rectangleServiceStub.rectangleMode).toEqual(rectangleMode);
        expect(rectangleServiceStub.square).toEqual(isSquareOn);
    });

    it('should apply actions for rectangle action when "plein" is the rectangle mode chosen', () => {
        rectangleMode = 'plein';
        isSquareOn = false;

        rectangleServiceStub.square = isSquareOn;
        rectangleServiceStub.rectangleMode = rectangleMode;

        rectangleActionStub = new RectangleAction(
            drawingServiceStub,
            rectangleServiceStub,
            borderColor,
            fillColor,
            borderWidth,
            rectangleMode,
            mouseDownCoord,
            distanceX,
            distanceY,
            isSquareOn,
        );

        const spyFill = spyOn(rectangleServiceStub, 'rectangleFill').and.callThrough();
        const spy = spyOn(rectangleServiceStub, 'rectangleBorder').and.callThrough();
        rectangleActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.fillStyle).toEqual(fillColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(rectangleServiceStub.distanceX).toEqual(distanceX);
        expect(rectangleServiceStub.distanceY).toEqual(distanceY);
        expect(rectangleServiceStub.rectangleMode).toEqual(rectangleMode);
        expect(rectangleServiceStub.square).toEqual(isSquareOn);
    });

    it('should apply actions for rectangle action when "plein" is the rectangle mode chosen and square is on', () => {
        rectangleMode = 'plein';
        isSquareOn = true;

        rectangleServiceStub.square = isSquareOn;
        rectangleServiceStub.rectangleMode = rectangleMode;

        rectangleActionStub = new RectangleAction(
            drawingServiceStub,
            rectangleServiceStub,
            borderColor,
            fillColor,
            borderWidth,
            rectangleMode,
            mouseDownCoord,
            distanceX,
            distanceY,
            isSquareOn,
        );

        const spyFill = spyOn(rectangleServiceStub, 'rectangleFill').and.callThrough();
        const spy = spyOn(rectangleServiceStub, 'rectangleBorder').and.callThrough();
        rectangleActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.fillStyle).toEqual(fillColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(rectangleServiceStub.distanceX).toEqual(distanceX);
        expect(rectangleServiceStub.distanceY).toEqual(distanceY);
        expect(rectangleServiceStub.rectangleMode).toEqual(rectangleMode);
        expect(rectangleServiceStub.square).toEqual(isSquareOn);
    });

    it('should apply actions for rectangle action when "pleinContour" is the rectangle mode chosen', () => {
        rectangleMode = 'pleinContour';
        isSquareOn = false;

        rectangleServiceStub.square = isSquareOn;
        rectangleServiceStub.rectangleMode = rectangleMode;

        rectangleActionStub = new RectangleAction(
            drawingServiceStub,
            rectangleServiceStub,
            borderColor,
            fillColor,
            borderWidth,
            rectangleMode,
            mouseDownCoord,
            distanceX,
            distanceY,
            isSquareOn,
        );

        const spyFill = spyOn(rectangleServiceStub, 'rectangleFill').and.callThrough();
        const spy = spyOn(rectangleServiceStub, 'rectangleBorder').and.callThrough();

        rectangleActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(borderColor);
        expect(drawingServiceStub.baseCtx.fillStyle).toEqual(fillColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(rectangleServiceStub.distanceX).toEqual(distanceX);
        expect(rectangleServiceStub.distanceY).toEqual(distanceY);
        expect(rectangleServiceStub.rectangleMode).toEqual(rectangleMode);
        expect(rectangleServiceStub.square).toEqual(isSquareOn);
    });

    it('should apply actions for rectangle action when "pleinContour" is the rectangle mode chosen and square is on', () => {
        rectangleMode = 'pleinContour';
        isSquareOn = true;

        rectangleServiceStub.square = isSquareOn;
        rectangleServiceStub.rectangleMode = rectangleMode;

        rectangleActionStub = new RectangleAction(
            drawingServiceStub,
            rectangleServiceStub,
            borderColor,
            fillColor,
            borderWidth,
            rectangleMode,
            mouseDownCoord,
            distanceX,
            distanceY,
            isSquareOn,
        );

        const spyFill = spyOn(rectangleServiceStub, 'rectangleFill').and.callThrough();
        const spy = spyOn(rectangleServiceStub, 'rectangleBorder').and.callThrough();

        rectangleActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(spyFill).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(borderColor);
        expect(drawingServiceStub.baseCtx.fillStyle).toEqual(fillColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(rectangleServiceStub.distanceX).toEqual(distanceX);
        expect(rectangleServiceStub.distanceY).toEqual(distanceY);
        expect(rectangleServiceStub.rectangleMode).toEqual(rectangleMode);
        expect(rectangleServiceStub.square).toEqual(isSquareOn);
    });
});

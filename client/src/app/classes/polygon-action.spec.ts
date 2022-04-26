import { TestBed } from '@angular/core/testing';
import { PolygonAction } from '@app/classes/polygon-action';
import { RADIUS, SIDES_NUMBER } from '@app/constant/constants';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygonService } from '@app/services/tools/polygon.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';
import { CanvasTestHelper } from './canvas-test-helper';
import { Vec2 } from './vec2';

describe('PolygonAction', () => {
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let drawingServiceStub: DrawingService;

    let colorServiceStub: ColorService;
    let undoRedoServiceStub: UndoRedoService;
    let polygonServiceStub: PolygonService;
    let polygonActionStub: PolygonAction;

    let polygonMode: string;
    let borderColor: string;
    let fillColor: string;
    let borderWidth: number;
    let mouseDownCoord: Vec2;
    let distance: Vec2;
    let radius: number;
    let sidesNumber: number;

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        mouseDownCoord = { x: 265, y: 197 };
        borderWidth = 1;
        borderColor = '#000000';
        fillColor = '#010101';
        polygonMode = 'contour';
        radius = RADIUS;
        sidesNumber = SIDES_NUMBER;
        distance = { x: 0, y: 0 };

        drawingServiceStub = new DrawingService();
        undoRedoServiceStub = new UndoRedoService(drawingServiceStub);
        colorServiceStub = new ColorService();
        polygonServiceStub = new PolygonService(drawingServiceStub, colorServiceStub, undoRedoServiceStub);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: PolygonService, useValue: polygonServiceStub },
                { provide: PolygonAction, useValue: polygonActionStub },
                { provide: UndoRedoService, useValue: undoRedoServiceStub },
                { provide: ColorService, useValue: colorServiceStub },
            ],
        });

        drawingServiceStub.baseCtx = baseCtxClone;
        drawingServiceStub.previewCtx = previewCtxClone;
        drawingServiceStub.canvas = canvas;

        polygonActionStub = new PolygonAction(
            drawingServiceStub,
            polygonServiceStub,
            polygonMode,
            borderColor,
            fillColor,
            borderWidth,
            mouseDownCoord,
            distance,
            radius,
            sidesNumber,
        );

        drawingServiceStub.baseCtx.strokeStyle = borderColor;
        drawingServiceStub.baseCtx.fillStyle = fillColor;
        drawingServiceStub.baseCtx.lineWidth = borderWidth;
        drawingServiceStub.baseCtx.setLineDash([]);
        polygonServiceStub.distance.x = distance.x;
        polygonServiceStub.distance.y = distance.y;
        polygonServiceStub.radius = radius;
        polygonServiceStub.sidesNumber = sidesNumber;
        polygonServiceStub.polygonMode = polygonMode;

        polygonServiceStub = TestBed.inject(PolygonService);
        polygonActionStub = TestBed.inject(PolygonAction);
    });

    it('should create an instance', () => {
        expect(
            new PolygonAction(
                drawingServiceStub,
                polygonServiceStub,
                polygonMode,
                borderColor,
                fillColor,
                borderWidth,
                mouseDownCoord,
                distance,
                radius,
                sidesNumber,
            ),
        ).toBeTruthy();
    });

    it('should apply actions for polygon on mode contour', () => {
        polygonMode = 'contour';
        polygonServiceStub.polygonMode = polygonMode;

        polygonActionStub = new PolygonAction(
            drawingServiceStub,
            polygonServiceStub,
            polygonMode,
            borderColor,
            fillColor,
            borderWidth,
            mouseDownCoord,
            distance,
            radius,
            sidesNumber,
        );

        const spy = spyOn(polygonServiceStub, 'polygonFill');

        polygonActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(borderColor);
        expect(drawingServiceStub.baseCtx.fillStyle).toEqual(fillColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(polygonServiceStub.distance.x).toEqual(distance.x);
        expect(polygonServiceStub.distance.y).toEqual(distance.y);
        expect(polygonServiceStub.radius).toEqual(radius);
        expect(polygonServiceStub.sidesNumber).toEqual(sidesNumber);
        expect(polygonServiceStub.polygonMode).toEqual(polygonMode);
    });

    it('should apply actions for polygon on mode plein', () => {
        polygonMode = 'plein';
        polygonServiceStub.polygonMode = polygonMode;

        polygonActionStub = new PolygonAction(
            drawingServiceStub,
            polygonServiceStub,
            polygonMode,
            borderColor,
            fillColor,
            borderWidth,
            mouseDownCoord,
            distance,
            radius,
            sidesNumber,
        );

        const spy = spyOn(polygonServiceStub, 'polygonFill');

        polygonActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(borderColor);
        expect(drawingServiceStub.baseCtx.fillStyle).toEqual(fillColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(polygonServiceStub.distance.x).toEqual(distance.x);
        expect(polygonServiceStub.distance.y).toEqual(distance.y);
        expect(polygonServiceStub.radius).toEqual(radius);
        expect(polygonServiceStub.sidesNumber).toEqual(sidesNumber);
        expect(polygonServiceStub.polygonMode).toEqual(polygonMode);
    });

    it('should apply actions for polygon on mode pleinContour', () => {
        polygonMode = 'pleinContour';
        polygonServiceStub.polygonMode = polygonMode;

        polygonActionStub = new PolygonAction(
            drawingServiceStub,
            polygonServiceStub,
            polygonMode,
            borderColor,
            fillColor,
            borderWidth,
            mouseDownCoord,
            distance,
            radius,
            sidesNumber,
        );

        const spy = spyOn(polygonServiceStub, 'polygonFill');

        polygonActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(borderColor);
        expect(drawingServiceStub.baseCtx.fillStyle).toEqual(fillColor);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(borderWidth);
        expect(polygonServiceStub.distance.x).toEqual(distance.x);
        expect(polygonServiceStub.distance.y).toEqual(distance.y);
        expect(polygonServiceStub.radius).toEqual(radius);
        expect(polygonServiceStub.sidesNumber).toEqual(sidesNumber);
        expect(polygonServiceStub.polygonMode).toEqual(polygonMode);
    });
});

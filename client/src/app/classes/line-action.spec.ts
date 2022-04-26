import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { LineAction } from '@app/classes/line-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '@app/services/tools/line.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

describe('LineAction', () => {
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let drawingServiceStub: DrawingService;

    let undoRedoServiceStub: UndoRedoService;
    let lineServiceStub: LineService;
    let lineActionStub: LineAction;
    let colorServiceStub: ColorService;
    let color: string;
    let widthLine: number;
    const pathData: Vec2[] = [];
    let junctionRadius: number;
    let isJunctionOn: boolean;

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        color = '#111001';
        widthLine = 1;
        pathData.push({ x: 4, y: 2 });
        junctionRadius = 2;
        isJunctionOn = true;

        colorServiceStub = new ColorService();
        drawingServiceStub = new DrawingService();
        undoRedoServiceStub = new UndoRedoService(drawingServiceStub);
        lineServiceStub = new LineService(drawingServiceStub, colorServiceStub, undoRedoServiceStub);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: LineAction, useValue: lineActionStub },
                { provide: LineService, useValue: lineServiceStub },
                { provide: UndoRedoService, useValue: undoRedoServiceStub },
            ],
        });

        drawingServiceStub.baseCtx = baseCtxClone;
        drawingServiceStub.previewCtx = previewCtxClone;
        drawingServiceStub.canvas = canvas;

        drawingServiceStub.baseCtx.strokeStyle = color;
        drawingServiceStub.baseCtx.lineWidth = widthLine;
        drawingServiceStub.baseCtx.lineCap = 'round';
        drawingServiceStub.baseCtx.lineJoin = 'round';
        lineServiceStub.junctionOn = isJunctionOn;
        lineServiceStub.junctionRadius = junctionRadius;
        drawingServiceStub.baseCtx.setLineDash([]);

        lineActionStub = new LineAction(lineServiceStub, drawingServiceStub, color, widthLine, pathData, junctionRadius, isJunctionOn);

        lineServiceStub = TestBed.inject(LineService);
        lineActionStub = TestBed.inject(LineAction);
    });

    it('should create an instance', () => {
        expect(new LineAction(lineServiceStub, drawingServiceStub, color, widthLine, pathData, junctionRadius, isJunctionOn)).toBeTruthy();
    });

    it('should apply actions for line service when junction is on', () => {
        isJunctionOn = true;

        lineServiceStub.junctionOn = isJunctionOn;

        lineActionStub = new LineAction(lineServiceStub, drawingServiceStub, color, widthLine, pathData, junctionRadius, isJunctionOn);

        const spyLine = spyOn(lineServiceStub, 'line').and.callThrough();
        const spyOnJunction = spyOn(lineServiceStub, 'junction').and.callThrough();

        lineActionStub.applyActions();

        expect(spyLine).toHaveBeenCalled();
        expect(spyOnJunction).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(color);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(widthLine);
        expect(drawingServiceStub.baseCtx.lineCap).toEqual('round');
        expect(drawingServiceStub.baseCtx.lineJoin).toEqual('round');
        expect(lineServiceStub.junctionRadius).toEqual(junctionRadius);
    });

    it('should apply actions for line service when junction is off', () => {
        isJunctionOn = false;

        lineServiceStub.junctionOn = isJunctionOn;

        lineActionStub = new LineAction(lineServiceStub, drawingServiceStub, color, widthLine, pathData, junctionRadius, isJunctionOn);

        const spyLine = spyOn(lineServiceStub, 'line').and.callThrough();

        lineActionStub.applyActions();

        expect(spyLine).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(color);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(widthLine);
        expect(drawingServiceStub.baseCtx.lineCap).toEqual('round');
        expect(drawingServiceStub.baseCtx.lineJoin).toEqual('round');
        expect(lineServiceStub.junctionRadius).toEqual(junctionRadius);
    });
});

import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { EraserAction } from '@app/classes/eraser-action';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

describe('EraserAction', () => {
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let drawingServiceStub: DrawingService;

    let undoRedoServiceStub: UndoRedoService;
    let eraserServiceStub: EraserService;
    let eraserActionStub: EraserAction;
    let color: string;
    let widthLine: number;
    const pathData: Vec2[] = [];

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        pathData.push({ x: 4, y: 2 });
        color = 'rgba(0, 0, 0, 0)';
        widthLine = 1;

        drawingServiceStub = new DrawingService();
        undoRedoServiceStub = new UndoRedoService(drawingServiceStub);
        eraserServiceStub = new EraserService(drawingServiceStub, undoRedoServiceStub);
        eraserActionStub = new EraserAction(eraserServiceStub, drawingServiceStub, color, widthLine, pathData);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: EraserAction, useValue: eraserActionStub },
                { provide: EraserService, useValue: eraserServiceStub },
                { provide: UndoRedoService, useValue: undoRedoServiceStub },
            ],
        });

        drawingServiceStub.baseCtx = baseCtxClone;
        drawingServiceStub.previewCtx = previewCtxClone;
        drawingServiceStub.canvas = canvas;

        eraserServiceStub = TestBed.inject(EraserService);
        eraserActionStub = TestBed.inject(EraserAction);
    });

    it('should create an instance', () => {
        expect(new EraserAction(eraserServiceStub, drawingServiceStub, color, widthLine, pathData)).toBeTruthy();
    });

    it('should apply actions for eraser action', () => {
        drawingServiceStub.baseCtx.strokeStyle = color;
        drawingServiceStub.baseCtx.lineWidth = widthLine;
        drawingServiceStub.baseCtx.lineCap = 'round';

        eraserActionStub.applyActions();

        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(color);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(widthLine);
        expect(drawingServiceStub.baseCtx.lineCap).toEqual('round');
    });
});

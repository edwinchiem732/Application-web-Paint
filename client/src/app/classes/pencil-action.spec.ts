import { TestBed } from '@angular/core/testing';
import { UndoRedoService } from '@app//services/tools/undo-redo.service';
import { PencilAction } from '@app/classes/pencil-action';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { CanvasTestHelper } from './canvas-test-helper';

describe('PencilAction', () => {
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    let pencilActionStub: PencilAction;
    let undoRedoServiceStub: UndoRedoService;
    let colorServiceStub: ColorService;
    // tslint:disable-next-line: prefer-const
    let drawingServiceStub: DrawingService;
    let pencilServiceStub: PencilService;
    let color: string;
    let widthLine: number;
    const pathPencil: Vec2[] = [];

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        drawingServiceStub = new DrawingService();
        colorServiceStub = new ColorService();
        undoRedoServiceStub = new UndoRedoService(drawingServiceStub);
        pencilServiceStub = new PencilService(drawingServiceStub, colorServiceStub, undoRedoServiceStub);

        drawingServiceStub.baseCtx = baseCtxClone;
        drawingServiceStub.previewCtx = previewCtxClone;
        drawingServiceStub.canvas = canvas;

        pathPencil.push({ x: 4, y: 2 });
        color = '#000001';
        widthLine = 1;

        drawingServiceStub.baseCtx.strokeStyle = color;
        drawingServiceStub.baseCtx.lineWidth = widthLine;
        drawingServiceStub.baseCtx.lineCap = 'round';
        drawingServiceStub.baseCtx.lineJoin = 'round';
        pencilActionStub = new PencilAction(pencilServiceStub, drawingServiceStub, color, widthLine, pathPencil);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ColorService, useValue: colorServiceStub },
                { provide: UndoRedoService, useValue: undoRedoServiceStub },
                { provide: PencilAction, useValue: pencilActionStub },
                { provide: PencilService, useValue: pencilServiceStub },
            ],
        });

        pencilServiceStub = TestBed.inject(PencilService);
        pencilActionStub = TestBed.inject(PencilAction);
    });

    it('should create an instance', () => {
        expect(new PencilAction(pencilServiceStub, drawingServiceStub, color, widthLine, pathPencil)).toBeTruthy();
    });

    it('should apply actions when using pencil', () => {
        const spy = spyOn(pencilServiceStub, 'drawLine').and.callThrough();

        pencilActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(color);
        expect(drawingServiceStub.baseCtx.lineWidth).toEqual(widthLine);
        expect(drawingServiceStub.baseCtx.lineCap).toEqual('round');
        expect(drawingServiceStub.baseCtx.lineJoin).toEqual('round');
    });
});

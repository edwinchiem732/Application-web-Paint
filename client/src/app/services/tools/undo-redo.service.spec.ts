import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { PencilAction } from '@app/classes/pencil-action';
import { ResizeAction } from '@app/classes/resize-action';
import { UndoRedoAbs } from '@app/classes/undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService', () => {
    let service: UndoRedoService;
    let pencilService: PencilService;
    let drawingService: DrawingService;
    let spyOnDrawing: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    // tslint:disable-next-line: prefer-const
    let action: UndoRedoAbs;
    // tslint:disable-next-line: prefer-const
    let resize: ResizeAction;
    let colorService: ColorService;
    let pencilActionStub: PencilAction;
    let color: string;
    // tslint:disable-next-line: prefer-const
    let widthLine: number;
    // tslint:disable-next-line: prefer-const
    let pathPencil: Vec2[] = [];

    beforeEach(() => {
        const width = 50;
        const height = 50;
        widthLine = 1;

        spyOnDrawing = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'cursorImage', 'clearCanvas', 'checkEmptyCanvas']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        canvas = canvasTestHelper.canvas;
        canvas.width = width;
        canvas.height = height;

        color = 'rgba(1,1,1,1)';

        pathPencil.push({ x: 13, y: 6 });
        pathPencil.push({ x: 3, y: 16 });
        drawingService = new DrawingService();
        colorService = new ColorService();
        service = new UndoRedoService(drawingService);
        pencilService = new PencilService(drawingService, colorService, service);
        pencilActionStub = new PencilAction(pencilService, drawingService, color, widthLine, pathPencil);

        drawingService.canvas = canvas;
        drawingService.baseCtx = baseCtxClone;
        drawingService.previewCtx = previewCtxClone;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingService },
                { provide: ColorService, useValue: colorService },
                { provide: UndoRedoService, useValue: service },
                { provide: PencilAction, useValue: pencilActionStub },
                { provide: PencilService, useValue: pencilService },
            ],
        });

        service = TestBed.inject(UndoRedoService);

        service.drawingService.baseCtx = baseCtxClone;
        service.drawingService.previewCtx = previewCtxClone;

        pencilService = TestBed.inject(PencilService);
        pencilActionStub = TestBed.inject(PencilAction);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add action', () => {
        service.addAction(action);
        expect(service.btn).not.toEqual(0);
    });

    it('should add to intial canvas', () => {
        service.addInitialCanvas(resize);
        expect(service.btn).toEqual(0);
    });

    it('should clear the lists of actions', () => {
        service.clearActions();
        expect(service.listActions).toEqual([]);
        expect(service.listUndoActions).toEqual([]);
    });

    it('should clear preview et base canvases', () => {
        service.clearCanvases();
        expect(spyOnDrawing.clearCanvas).not.toHaveBeenCalled();
    });

    it('should undo an action', () => {
        const pencilAction = new PencilAction(pencilService, drawingService, color, widthLine, pathPencil);
        service.addAction(pencilAction);
        service.addAction(pencilAction);
        const spy = spyOn(pencilActionStub, 'applyActions').and.stub();
        service.undo();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should redo an action', () => {
        const pencilAction = new PencilAction(pencilService, drawingService, color, widthLine, pathPencil);
        service.addAction(pencilAction);
        service.addAction(pencilAction);
        const spy = spyOn(pencilActionStub, 'applyActions').and.stub();
        service.undo();
        service.redo();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should return the length of listActions as not 0', () => {
        const pencilAction = new PencilAction(pencilService, drawingService, color, widthLine, pathPencil);
        service.addAction(pencilAction);
        service.lengthListActions();
        expect(service.listActions.length).toEqual(1);
        expect(service.lengthListActions()).toEqual(false);
    });

    it('should return the length of listActions as not 0 after undo and redo', () => {
        const pencilAction = new PencilAction(pencilService, drawingService, color, widthLine, pathPencil);
        service.addAction(pencilAction);
        service.undo();
        service.redo();
        service.lengthListActions();
        expect(service.listActions.length).toEqual(1);
        expect(service.lengthListActions()).toEqual(false);
    });

    it('should return the length of listActions as 0', () => {
        const pencilAction = new PencilAction(pencilService, drawingService, color, widthLine, pathPencil);
        service.addAction(pencilAction);
        service.undo();
        service.lengthListActions();
        expect(service.listActions.length).toEqual(0);
        expect(service.lengthListActions()).toEqual(true);
    });

    it('should return the length of listUndoActions as 0', () => {
        const pencilAction = new PencilAction(pencilService, drawingService, color, widthLine, pathPencil);
        service.addAction(pencilAction);
        service.lengthListActions();
        expect(service.listUndoActions.length).toEqual(0);
        expect(service.lengthUndidActions()).toEqual(true);
    });

    it('should return the length of listUndoActions as 0', () => {
        const pencilAction = new PencilAction(pencilService, drawingService, color, widthLine, pathPencil);
        service.addAction(pencilAction);
        service.undo();
        service.lengthListActions();
        expect(service.listUndoActions.length).toEqual(1);
        expect(service.lengthUndidActions()).toEqual(false);
    });
});

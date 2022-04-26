import { TestBed } from '@angular/core/testing';
import { IMAGE_DATA_NUMBER } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';
import { CanvasTestHelper } from './canvas-test-helper';
import { SelectionAction } from './selection-action';
import { Vec2 } from './vec2';

/* tslint:disable:no-string-literal */
describe('SelectionAction', () => {
    let canvasTestHelper: CanvasTestHelper;
    let imageData: ImageData;
    let drawingService: DrawingService;
    let selectionService: SelectionService;
    let mousePosition: Vec2;
    // tslint:disable-next-line: prefer-const
    let diameter: Vec2;
    let imagePosition: Vec2;
    let mouseDownCoord: Vec2;
    let selected: boolean;
    let selectionOption: boolean;
    let copied: boolean;
    let center: Vec2;
    let radius: Vec2;
    let cutImage: boolean;
    let isPasted: boolean;
    let imageDataCopied: ImageData;
    let isResizing: boolean;
    let imageResizedPos: Vec2[];
    let undoRedoService: UndoRedoService;
    let gridService: GridService;
    let selectionAction: SelectionAction;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        drawingService = new DrawingService();
        undoRedoService = new UndoRedoService(drawingService);
        gridService = new GridService(drawingService);
        selectionService = new SelectionService(drawingService, undoRedoService, gridService);
        imageData = new ImageData(IMAGE_DATA_NUMBER, IMAGE_DATA_NUMBER);
        mousePosition = { x: 0, y: 0 };
        imagePosition = { x: 10, y: 10 };
        mouseDownCoord = { x: 10, y: 10 };
        selected = false;
        selectionOption = false;
        copied = false;
        center = { x: 0, y: 0 };
        radius = { x: 10, y: 10 };
        cutImage = false;
        isPasted = false;
        imageDataCopied = new ImageData(IMAGE_DATA_NUMBER, IMAGE_DATA_NUMBER);
        isResizing = false;
        imageResizedPos = [{ x: 10, y: 10 }];

        selectionAction = new SelectionAction(
            drawingService,
            selectionService,
            imageData,
            mousePosition,
            diameter,
            imagePosition,
            mouseDownCoord,
            selected,
            selectionOption,
            copied,
            center,
            radius,
            cutImage,
            isPasted,
            imageDataCopied,
            isResizing,
            imageResizedPos,
        );

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingService },
                { provide: SelectionService, useValue: selectionService },
                { provide: SelectionAction, useValue: selectionAction },
            ],
        });

        drawingService.baseCtx = baseCtxClone;
        drawingService.previewCtx = previewCtxClone;
        drawingService.canvas = canvas;

        selectionAction = TestBed.inject(SelectionAction);
    });

    it('should create an instance', () => {
        expect(
            new SelectionAction(
                drawingService,
                selectionService,
                imageData,
                mousePosition,
                diameter,
                imagePosition,
                mouseDownCoord,
                selected,
                selectionOption,
                copied,
                center,
                radius,
                cutImage,
                isPasted,
                imageDataCopied,
                isResizing,
                imageResizedPos,
            ),
        ).toBeTruthy();
    });

    it('should set the right parameters when applyActions is called', () => {
        selectionAction.applyActions();
        expect(selectionService.mouseDownCoord).toEqual(selectionAction['mouseDownCoord']);
        expect(selectionService.imageData).toEqual(selectionAction['imageData']);
        expect(selectionService.mousePosition).toEqual(selectionAction['mousePosition']);
        expect(selectionService.diameter).toEqual(selectionAction['diameter']);
        expect(selectionService.imagePosition).toEqual(selectionAction['imagePosition']);
        expect(selectionService.selectionOption).toEqual(selectionAction['selectionOption']);
        expect(selectionService.center).toEqual(selectionAction['center']);
        expect(selectionService.radius).toEqual(selectionAction['radius']);
        expect(selectionService.cutImage).toEqual(selectionAction['cutImage']);
        expect(selectionService.copied).toEqual(selectionAction['copied']);
        expect(selectionService.isPasted).toEqual(selectionAction['isPasted']);
        expect(selectionService.imageDataCopied).toEqual(selectionAction['imageDataCopied']);
        expect(selectionService.selected).toEqual(selectionAction['selected']);
        expect(selectionService.isResizing).toEqual(selectionAction['isResizing']);
        expect(selectionService.imageResisedPos).toEqual(selectionAction['imageResizedPos']);
    });

    it('should call putImage and boundingBox if selection is selected but not pasted', () => {
        const spy = spyOn(selectionService, 'putImage').and.callThrough();
        const spy2 = spyOn(selectionService, 'boundingBox').and.callThrough();
        const value1 = true;
        const value2 = false;
        selected = value1;
        isPasted = value2;
        selectionService.selected = selected;
        selectionService.isPasted = isPasted;
        selectionAction = new SelectionAction(
            drawingService,
            selectionService,
            imageData,
            mousePosition,
            diameter,
            imagePosition,
            mouseDownCoord,
            selected,
            selectionOption,
            copied,
            center,
            radius,
            cutImage,
            isPasted,
            imageDataCopied,
            isResizing,
            imageResizedPos,
        );
        selectionAction.applyActions();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should call fill rect and putImageData in putRectangleNotResized', () => {
        const spy = spyOn(drawingService.baseCtx, 'fillRect');
        const spy2 = spyOn(drawingService.baseCtx, 'putImageData');
        selectionAction = new SelectionAction(
            drawingService,
            selectionService,
            imageData,
            mousePosition,
            diameter,
            imagePosition,
            mouseDownCoord,
            selected,
            selectionOption,
            copied,
            center,
            radius,
            cutImage,
            isPasted,
            imageDataCopied,
            isResizing,
            imageResizedPos,
        );
        selectionAction.putRectangleNotResized();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should call ellipse in fillBlancSelection', () => {
        const spy = spyOn(drawingService.baseCtx, 'ellipse');
        selectionOption = false;
        selectionService.selectionOption = selectionOption;
        selectionAction = new SelectionAction(
            drawingService,
            selectionService,
            imageData,
            mousePosition,
            diameter,
            imagePosition,
            mouseDownCoord,
            selected,
            selectionOption,
            copied,
            center,
            radius,
            cutImage,
            isPasted,
            imageDataCopied,
            isResizing,
            imageResizedPos,
        );
        selectionAction.fillBlancSelection();
        expect(spy).toHaveBeenCalled();
    });
});

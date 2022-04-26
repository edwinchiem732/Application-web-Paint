import { TestBed } from '@angular/core/testing';
import { IMAGE_DATA_NUMBER } from '@app/constant/constants';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { LineService } from '@app/services/tools/line.service';
import { SelectionLassoService } from '@app/services/tools/selection-lasso.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';
import { CanvasTestHelper } from './canvas-test-helper';
import { LassoAction } from './lasso-action';
import { Vec2 } from './vec2';

describe('LassoAction', () => {
    let selectionLassoAction: LassoAction;
    let selectionLassoService: SelectionLassoService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceStub: UndoRedoService;
    let lineServiceStub: LineService;
    // tslint:disable-next-line: prefer-const
    let selectionServiceStub: SelectionService;
    let gridServiceStub: GridService;
    let colorServiceStub: ColorService;

    let imageData: ImageData;
    let imagePosition: Vec2;
    let selected: boolean;
    let gotCopied: boolean;
    let erasedImage: ImageData;
    let erasedPosition: Vec2;
    let rejoinedOrigin: boolean;
    let imageCanvas: HTMLImageElement;
    let imageDataCopied: ImageData;
    let isCopied: boolean;
    let pasted: boolean;
    let cutImage: boolean;

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'clearCanvas']);

        imageData = new ImageData(IMAGE_DATA_NUMBER, IMAGE_DATA_NUMBER);
        imagePosition = { x: 0, y: 0 };
        selected = false;
        gotCopied = false;

        erasedImage = new ImageData(2, 2);
        erasedPosition = { x: 5, y: 5 };
        rejoinedOrigin = true;
        imageCanvas = new Image();
        imageDataCopied = imageData;
        isCopied = false;
        pasted = false;
        cutImage = false;

        colorServiceStub = new ColorService();
        gridServiceStub = new GridService(drawingServiceSpy);
        undoRedoServiceStub = new UndoRedoService(drawingServiceSpy);
        lineServiceStub = new LineService(drawingServiceSpy, colorServiceStub, undoRedoServiceStub);
        selectionLassoService = new SelectionLassoService(
            drawingServiceSpy,
            lineServiceStub,
            undoRedoServiceStub,
            selectionServiceStub,
            gridServiceStub,
        );
        selectionLassoAction = new LassoAction(
            drawingServiceSpy,
            selectionLassoService,
            imageData,
            imagePosition,
            selected,
            gotCopied,
            erasedImage,
            erasedPosition,
            rejoinedOrigin,
            imageCanvas,
            imageDataCopied,
            isCopied,
            pasted,
            cutImage,
        );

        drawingServiceSpy.baseCtx = baseCtxClone;
        drawingServiceSpy.previewCtx = previewCtxClone;
        drawingServiceSpy.canvas = canvas;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: LassoAction, useValue: selectionLassoAction },
                { provide: SelectionLassoService, useValue: selectionLassoService },
                { provide: UndoRedoService, useValue: undoRedoServiceStub },
                { provide: ColorService, useValue: colorServiceStub },
            ],
        });

        selectionLassoService.imagePosition = imagePosition;
        selectionLassoService.imageData = imageData;
        selectionLassoService.selected = selected;
        selectionLassoService.gotCopied = gotCopied;
        selectionLassoService.erasedImage = erasedImage;
        selectionLassoService.erasedPosition = erasedPosition;
        selectionLassoService.rejoinedOrigin = rejoinedOrigin;
        selectionLassoService.imageCanvas = imageCanvas;
        selectionLassoService.imageDataCopiedLasso = imageDataCopied;
        selectionLassoService.isCopied = isCopied;
        selectionLassoService.pasted = pasted;
        selectionLassoService.cutImage = cutImage;

        selectionLassoService = TestBed.inject(SelectionLassoService);
        selectionLassoAction = TestBed.inject(LassoAction);
    });

    it('should create an instance', () => {
        expect(
            new LassoAction(
                drawingServiceSpy,
                selectionLassoService,
                imageData,
                imagePosition,
                selected,
                gotCopied,
                erasedImage,
                erasedPosition,
                rejoinedOrigin,
                imageCanvas,
                imageDataCopied,
                isCopied,
                pasted,
                cutImage,
            ),
        ).toBeTruthy();
    });

    it('should set the attributes when doing a lasso selection action', () => {
        const spy = spyOn(drawingServiceSpy.baseCtx, 'putImageData').and.stub();

        selectionLassoAction.applyActions();
        expect(spy).toHaveBeenCalled();
        expect(selectionLassoService.imagePosition).toEqual(imagePosition);
        expect(selectionLassoService.imageData).toEqual(imageData);
        expect(selectionLassoService.selected).toEqual(selected);
        expect(selectionLassoService.gotCopied).toEqual(gotCopied);
        expect(selectionLassoService.erasedImage).toEqual(erasedImage);
        expect(selectionLassoService.erasedPosition).toEqual(erasedPosition);
        expect(selectionLassoService.rejoinedOrigin).toEqual(rejoinedOrigin);
        expect(selectionLassoService.imageCanvas).toEqual(imageCanvas);
        expect((selectionLassoService.imageDataCopiedLasso = imageDataCopied));
        expect(selectionLassoService.isCopied).toEqual(isCopied);
        expect(selectionLassoService.pasted).toEqual(pasted);
        expect(selectionLassoService.cutImage).toEqual(cutImage);
        expect(selectionLassoService.isSelecting).toEqual(false);
        expect(selectionLassoService.selectedBtn).toEqual(false);
    });

    it('should set the attributes when doing a lasso selection action and redo the imageData on the canvas while putting the blanc selection', () => {
        const spy = spyOn(drawingServiceSpy.baseCtx, 'putImageData').and.stub();

        const spyEraseImage = spyOn(selectionLassoService, 'eraseImage').and.callThrough();
        selectionLassoAction.applyActions();
        expect(spy).toHaveBeenCalled();
        expect(spyEraseImage).toHaveBeenCalled();
        expect(selectionLassoService.imagePosition).toEqual(imagePosition);
        expect(selectionLassoService.imageData).toEqual(imageData);
        expect(selectionLassoService.selected).toEqual(selected);
        expect(selectionLassoService.gotCopied).toEqual(gotCopied);
        expect(selectionLassoService.erasedImage).toEqual(erasedImage);
        expect(selectionLassoService.erasedPosition).toEqual(erasedPosition);
        expect(selectionLassoService.rejoinedOrigin).toEqual(rejoinedOrigin);
        expect(selectionLassoService.imageCanvas).toEqual(imageCanvas);
        expect((selectionLassoService.imageDataCopiedLasso = imageDataCopied));
        expect(selectionLassoService.isCopied).toEqual(isCopied);
        expect(selectionLassoService.pasted).toEqual(pasted);
        expect(selectionLassoService.cutImage).toEqual(cutImage);
        expect(selectionLassoService.isSelecting).toEqual(false);
        expect(selectionLassoService.selectedBtn).toEqual(false);
    });

    it('should set the attributes when doing a lasso selection action and redo the imageDataCopied on the canvas', () => {
        const spy = spyOn(drawingServiceSpy.baseCtx, 'putImageData').and.stub();
        pasted = true;
        selectionLassoService.pasted = pasted;
        isCopied = true;
        selectionLassoService.pasted = isCopied;
        gotCopied = true;
        selectionLassoService.gotCopied = gotCopied;

        selectionLassoAction = new LassoAction(
            drawingServiceSpy,
            selectionLassoService,
            imageData,
            imagePosition,
            selected,
            gotCopied,
            erasedImage,
            erasedPosition,
            rejoinedOrigin,
            imageCanvas,
            imageDataCopied,
            isCopied,
            pasted,
            cutImage,
        );

        selectionLassoAction.applyActions();
        expect(spy).toHaveBeenCalled();
        expect(selectionLassoService.imagePosition).toEqual(imagePosition);
        expect(selectionLassoService.imageData).toEqual(imageData);
        expect(selectionLassoService.selected).toEqual(selected);
        expect(selectionLassoService.gotCopied).toEqual(gotCopied);
        expect(selectionLassoService.erasedImage).toEqual(erasedImage);
        expect(selectionLassoService.erasedPosition).toEqual(erasedPosition);
        expect(selectionLassoService.rejoinedOrigin).toEqual(rejoinedOrigin);
        expect(selectionLassoService.imageCanvas).toEqual(imageCanvas);
        expect((selectionLassoService.imageDataCopiedLasso = imageDataCopied));
        expect(selectionLassoService.isCopied).toEqual(isCopied);
        expect(selectionLassoService.pasted).toEqual(pasted);
        expect(selectionLassoService.cutImage).toEqual(cutImage);
        expect(selectionLassoService.isSelecting).toEqual(false);
        expect(selectionLassoService.selectedBtn).toEqual(false);
    });

    it('should set the attributes when doing a lasso selection action and redo the cutImage on the canvas by putting the selection blanc', () => {
        const spy = spyOn(drawingServiceSpy.baseCtx, 'putImageData').and.stub();
        const spyEraseImage = spyOn(selectionLassoService, 'eraseImage').and.callThrough();

        cutImage = true;
        selectionLassoService.cutImage = cutImage;

        selectionLassoAction = new LassoAction(
            drawingServiceSpy,
            selectionLassoService,
            imageData,
            imagePosition,
            selected,
            gotCopied,
            erasedImage,
            erasedPosition,
            rejoinedOrigin,
            imageCanvas,
            imageDataCopied,
            isCopied,
            pasted,
            cutImage,
        );
        selectionLassoAction.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(spyEraseImage).toHaveBeenCalled();
        expect(selectionLassoService.imagePosition).toEqual(imagePosition);
        expect(selectionLassoService.imageData).toEqual(imageData);
        expect(selectionLassoService.selected).toEqual(selected);
        expect(selectionLassoService.gotCopied).toEqual(gotCopied);
        expect(selectionLassoService.erasedImage).toEqual(erasedImage);
        expect(selectionLassoService.erasedPosition).toEqual(erasedPosition);
        expect(selectionLassoService.rejoinedOrigin).toEqual(rejoinedOrigin);
        expect(selectionLassoService.imageCanvas).toEqual(imageCanvas);
        expect((selectionLassoService.imageDataCopiedLasso = imageDataCopied));
        expect(selectionLassoService.isCopied).toEqual(isCopied);
        expect(selectionLassoService.pasted).toEqual(pasted);
        expect(selectionLassoService.cutImage).toEqual(cutImage);
        expect(selectionLassoService.isSelecting).toEqual(false);
        expect(selectionLassoService.selectedBtn).toEqual(false);
    });
});

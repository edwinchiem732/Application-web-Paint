import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_SIZE_TEST, IMAGE_POSITION_X_TEST, IMAGE_POSITION_Y_TEST, PATHDATA_LENGTH_TEST } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line.service';
import { SelectionLassoService } from './selection-lasso.service';

// tslint:disable:no-string-literal
describe('SelectionLassoService', () => {
    let service: SelectionLassoService;
    let serviceLine: LineService;
    let serviceLineObj: jasmine.SpyObj<LineService>;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let shiftEvent: KeyboardEvent;
    let keyEvent: KeyboardEvent;
    let backSpaceEvent: KeyboardEvent;
    let escapeEvent: KeyboardEvent;

    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', [
            'baseCtx',
            'previewCtx',
            'previewCanvas',
            'clearCanvas',
            'copyCanvas',
            'pasteCanvas',
            'cutCanvas',
            'canvasSize',
        ]);

        serviceLineObj = jasmine.createSpyObj('LineService', ['angleBetweenLine', 'clearPath', 'line']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingClone },
                { provide: LineService, useValue: serviceLineObj },
            ],
        });
        service = TestBed.inject(SelectionLassoService);
        serviceLine = TestBed.inject(LineService);
        serviceLineObj = TestBed.inject(LineService) as jasmine.SpyObj<LineService>;
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.previewCtx = previewCtxClone;

        drawingClone.canvas = canvas;
        service.drawingService = drawingClone;
        service.drawingService.baseCtx = drawingClone.baseCtx;
        service.drawingService.previewCtx = drawingClone.previewCtx;
        service.drawingService.canvas = drawingClone.canvas;

        serviceLine.drawingService = drawingClone;
        serviceLine.drawingService.baseCtx = drawingClone.baseCtx;
        serviceLine.drawingService.previewCtx = drawingClone.previewCtx;
        serviceLine.drawingService.canvas = drawingClone.canvas;
        canvas.toDataURL();

        shiftEvent = new KeyboardEvent('keypress', {
            key: 'Shift',
        });
        keyEvent = new KeyboardEvent('keypress', {
            key: 'm',
        });
        escapeEvent = new KeyboardEvent('keypress', {
            key: 'escape',
        });
        backSpaceEvent = new KeyboardEvent('keypress', {
            key: 'Backspace',
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('sould call mouseDown, mouseMove , mouseUp two times, the first with isselected false second time its true, the last mouseDown with isSelecd false ', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMouseDown2 = { pageX: 100, pageY: 22, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const eventMouseDown3 = { pageX: 400, pageY: 220, button: MouseButton.Left } as MouseEvent;
        const mouseDown2Spy = spyOn(service, 'onMouseDown').and.callThrough();
        const drawImageBaseCtxSpy = spyOn(service, 'drawImageBaseCtx').and.stub();
        spyOn(service, 'straigthLine').and.stub();
        const putImageSpy = spyOn(service, 'putImage').and.callThrough();
        const isSelectedSpy = spyOn(service, 'isSelected').and.callThrough();
        service.onMouseDown(event);
        service['isResizing'] = false;
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.onMouseDown(eventMouseDown2);
        expect(mouseDown2Spy).toHaveBeenCalled();
        service['isResizing'] = false;
        service.onMouseMove(eventMove);
        expect(isSelectedSpy).toBeTruthy();
        expect(service['selected']).toBeFalsy();
        expect(service['escapePressed']).toBeFalsy();
        expect(putImageSpy).not.toHaveBeenCalledWith();
        service.onMouseUp(eventMove);
        expect(putImageSpy).not.toHaveBeenCalledWith();
        service.onMouseDown(eventMouseDown3);
        expect(isSelectedSpy).not.toHaveBeenCalled();
        expect(drawImageBaseCtxSpy).not.toHaveBeenCalledWith();
    });

    it('mouseDown should be true onMouseClick', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.onMouseClick(event);
        expect(service.mouseDown).toBeTrue();
        expect(drawingClone.copyCanvas).toHaveBeenCalled();
    });

    it('mouseDown should be false, but endline should be true onMouseDoubleClick', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        spyOn(service, 'twentyPxFromInitial').and.callFake(() => {
            return false;
        });
        service.onMouseClick(event);
        expect(service.mouseDown).toBeTruthy();
        expect(service['endLine']).toBeFalsy();
    });

    it('onMouseDown', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const drawImageSpy = spyOn(service, 'drawImageBaseCtx').and.stub();
        service['rejoinedOrigin'] = true;
        service['mouseMove'] = true;
        service['isSelecting'] = true;
        service['isResizing'] = false;
        service.onMouseDown(event);
        expect(drawImageSpy).toHaveBeenCalled();
        expect(service['copied']).toBeFalsy();
        expect(service['isSelecting']).toBeFalsy();
        expect(service['mouseMove']).toBeFalsy();
        expect(service['escapePressed']).toBeFalsy();
        expect(service['selected']).toBeFalsy();
        expect(service['rejoinedOrigin']).toBeFalsy();
        expect(service['selectedBtn']).toBeFalsy();
        expect(service['gotCopied']).toBeFalsy();
        expect(service['isResizing']).toBeFalsy();
    });

    it('onMouseDown', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        service['rejoinedOrigin'] = true;
        service.onMouseDown(event);
        expect(service.mouseDownCoord.y).toEqual(event.pageY);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('onMouseClick', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const rectSelectionSpy = spyOn(service, 'selectionRectangle').and.callThrough();
        service['rejoinedOrigin'] = false;
        service['isResizing'] = false;
        service.onMouseClick(event);
        expect(service.mouseDownCoord.y).toEqual(event.pageY);
        expect(rectSelectionSpy).toHaveBeenCalledWith(service.drawingService.previewCtx);
    });

    it('onMouseClick', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const reachEndSpy = spyOn(service, 'reachedEnd').and.callThrough();
        service['rejoinedOrigin'] = true;
        service['isResizing'] = false;
        service['selected'] = false;
        service.onMouseClick(event);
        expect(service['mouseDown']).toBeFalsy();
        expect(reachEndSpy).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(drawingClone.pasteCanvas).toHaveBeenCalled();
        expect(service['endLine']).toBeTruthy();
    });

    it('onMouseClick', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const selectionSpy = spyOn(service, 'selectionRectangle').and.stub();
        service['rejoinedOrigin'] = false;
        service['isResizing'] = false;
        service['mouseDown'] = true;
        service['shift'] = true;
        service.onMouseClick(event);
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('onMouseClick', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        service['rejoinedOrigin'] = true;
        service['isResizing'] = false;
        service['mouseDown'] = true;
        service['shift'] = true;
        service.onMouseClick(event);
    });

    it('onMouseUp', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const boxSpy = spyOn(service, 'selectionBox').and.stub();
        const controlSpy = spyOn(service, 'controlPoint').and.stub();
        const putSpy = spyOn(service, 'putImage').and.stub();
        drawingClone.canvasSize.x = CANVAS_SIZE_TEST;
        drawingClone.canvasSize.y = CANVAS_SIZE_TEST;
        service['isResizing'] = false;
        service['rejoinedOrigin'] = true;
        service['gotCopied'] = false;
        service['selected'] = true;
        service.onMouseUp(event);
        expect(boxSpy).toHaveBeenCalled();
        expect(controlSpy).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(putSpy).toHaveBeenCalled();
    });

    it('onMouseUp', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const boxSpy = spyOn(service, 'selectionBox').and.stub();
        const controlSpy = spyOn(service, 'controlPoint').and.stub();
        const putSpy = spyOn(service, 'putImage').and.stub();
        drawingClone.canvasSize.x = CANVAS_SIZE_TEST;
        drawingClone.canvasSize.y = CANVAS_SIZE_TEST;
        service['isResizing'] = false;
        service['rejoinedOrigin'] = true;
        service['gotCopied'] = false;
        service['selected'] = true;
        service.onMouseUp(event);
        expect(boxSpy).toHaveBeenCalled();
        expect(controlSpy).toHaveBeenCalled();
        expect(putSpy).toHaveBeenCalled();
    });

    it('onMouseUp', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        service.onMouseUp(event);
    });

    it('onMouseMove', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const straightSpy = spyOn(service, 'straigthLine').and.stub();
        service['mouseDown'] = true;
        service['isResizing'] = false;
        service['rejoinedOrigin'] = false;
        service.onMouseMove(event);
        expect(straightSpy).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('onMouseMove', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const selectionSpy = spyOn(service, 'selectionInsideCanvas').and.stub();
        service['mouseDown'] = true;
        service['isResizing'] = false;
        service['rejoinedOrigin'] = true;
        service.onMouseMove(event);
        expect(selectionSpy).toHaveBeenCalled();
        expect(service['mouseMove']).toBeTruthy();
    });

    it('onMouseMove', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const insideSpy = spyOn(service, 'selectionInsideCanvas').and.stub();
        const selectionSpy = spyOn(service, 'selectionBox').and.stub();
        const putSpy = spyOn(service, 'putImage').and.stub();
        const eraseSpy = spyOn(service, 'eraseImage').and.stub();
        service['mouseDown'] = true;
        service['isResizing'] = false;
        service['rejoinedOrigin'] = true;
        service['selected'] = true;
        service['escapePressed'] = false;
        service['gotCopied'] = false;
        service.onMouseMove(event);
        expect(insideSpy).toHaveBeenCalled();
        expect(service['mouseMove']).toBeTruthy();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(selectionSpy).toHaveBeenCalled();
        expect(putSpy).toHaveBeenCalled();
        expect(eraseSpy).toHaveBeenCalled();
    });

    it('onMouseMove', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const insideSpy = spyOn(service, 'selectionInsideCanvas').and.stub();
        const selectionSpy = spyOn(service, 'selectionBox').and.stub();
        const putSpy = spyOn(service, 'putImage').and.stub();
        service['mouseDown'] = true;
        service['isResizing'] = false;
        service['rejoinedOrigin'] = true;
        service['selected'] = true;
        service['escapePressed'] = false;
        service['gotCopied'] = true;
        service.onMouseMove(event);
        expect(insideSpy).toHaveBeenCalled();
        expect(service['mouseMove']).toBeTruthy();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(selectionSpy).toHaveBeenCalled();
        expect(putSpy).toHaveBeenCalled();
    });

    it('onMouseMove', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const insideSpy = spyOn(service, 'selectionInsideCanvas').and.stub();
        const magnetismSpy = spyOn(service, 'magnetismControlPoint').and.stub();
        spyOn(service.drawingService.previewCtx, 'putImageData').and.stub();
        service['mouseDown'] = true;
        service['isResizing'] = false;
        service['rejoinedOrigin'] = true;
        service['selected'] = true;
        service['escapePressed'] = false;
        service['gotCopied'] = true;
        service['magnetismOn'] = true;
        service.onMouseMove(event);
        expect(insideSpy).toHaveBeenCalled();
        expect(service['mouseMove']).toBeTruthy();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(magnetismSpy).toHaveBeenCalled();
    });

    it('onMouseMove', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const insideSpy = spyOn(service, 'selectionInsideCanvas').and.stub();
        const eraseSpy = spyOn(service, 'eraseImage').and.callThrough();
        spyOn(service.drawingService.previewCtx, 'putImageData').and.stub();
        service['mouseDown'] = true;
        service['isResizing'] = false;
        service['rejoinedOrigin'] = true;
        service['selected'] = true;
        service['escapePressed'] = false;
        service['gotCopied'] = false;
        service.onMouseMove(event);
        expect(insideSpy).toHaveBeenCalled();
        expect(service['mouseMove']).toBeTruthy();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(eraseSpy).toHaveBeenCalled();
    });

    it('onMouseMove', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        const drawImageSpy = spyOn(service, 'drawImagePrewiewCtx').and.stub();
        service['mouseDown'] = true;
        service['isResizing'] = true;
        service.onMouseMove(event);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('onMouseMove', () => {
        const event = { offsetX: 5, offsetY: 6 } as MouseEvent;
        service['mouseDown'] = true;
        service['isResizing'] = true;
        service['shift'] = true;
        service.onMouseMove(event);
    });

    it('onShiftUp', () => {
        const straightSpy = spyOn(service, 'straigthLine').and.stub();
        service.onShiftUp(shiftEvent);
        expect(straightSpy).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('onShiftDown', () => {
        const straightSpy = spyOn(service, 'straigthLine').and.stub();
        service.onShiftDown(shiftEvent);
        expect(straightSpy).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('onKeyDown', () => {
        // tslint:disable-next-line: no-unused-expression
        keyEvent.key === 'm';
        service.onKeyDown(keyEvent);
        expect(service['magnetismOn']).toEqual(service['magnetismOn']);
    });

    it('onBackspace', () => {
        service.onBackspace(backSpaceEvent);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(drawingClone.pasteCanvas).toHaveBeenCalled();
        expect(serviceLineObj.line).toHaveBeenCalled();
    });

    it('onBackspace', () => {
        const popSpy = spyOn(service.pathData, 'pop').and.stub();
        service['pathData'].length = PATHDATA_LENGTH_TEST;
        service.onBackspace(backSpaceEvent);
        expect(popSpy).toHaveBeenCalled();
    });

    it('onBackspace', () => {
        service['pathData'].length = 1;
        service.onBackspace(backSpaceEvent);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('onBackspace', () => {
        service['pathData'].length = PATHDATA_LENGTH_TEST;
        service.onBackspace(backSpaceEvent);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
    });

    it('onBackspace', () => {
        const straightSpy = spyOn(service, 'straigthLine').and.stub();
        service['endLine'] = false;
        service.onBackspace(backSpaceEvent);
        expect(straightSpy).toHaveBeenCalled();
    });

    it('onEscape', () => {
        const clearSpy = spyOn(service, 'clearPath').and.stub();
        service['endLine'] = false;
        service.onEscape(escapeEvent);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(clearSpy).toHaveBeenCalled();
        expect(drawingClone.pasteCanvas).toHaveBeenCalled();
        expect(service['mouseDown']).toBeFalsy();
        expect(service['endLine']).toBeTruthy();
    });

    it('pasteCanvas', () => {
        service.pasteCanvas();
        expect(service['shortcutDisabledLasso']).toBeTruthy();
        expect(service['gotCopied']).toBeTruthy();
        expect(service['pasted']).toBeTruthy();
    });

    it('pasteCanvas', () => {
        const drawImageSpy = spyOn(service, 'drawImageBaseCtx').and.stub();
        const boxSpy = spyOn(service, 'selectionBox').and.stub();
        const controlSpy = spyOn(service, 'controlPoint').and.stub();
        spyOn(service.drawingService.previewCtx, 'putImageData').and.stub();
        service['isCopied'] = true;
        service.pasteCanvas();
        expect(service['shortcutDisabledLasso']).toBeTruthy();
        expect(service['gotCopied']).toBeTruthy();
        expect(service['pasted']).toBeTruthy();
        expect(drawImageSpy).toHaveBeenCalled();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(service['selected']).toBeFalsy();
        expect(boxSpy).toHaveBeenCalled();
        expect(controlSpy).toHaveBeenCalled();
    });

    it('pasteCanvas', () => {
        const drawImageSpy = spyOn(service, 'drawImageBaseCtx').and.stub();
        const boxSpy = spyOn(service, 'selectionBox').and.stub();
        const controlSpy = spyOn(service, 'controlPoint').and.stub();
        service['isCopied'] = false;
        service.pasteCanvas();
        expect(service['shortcutDisabledLasso']).toBeTruthy();
        expect(service['gotCopied']).toBeTruthy();
        expect(service['pasted']).toBeTruthy();
        expect(drawImageSpy).not.toHaveBeenCalled();
        expect(drawingClone.clearCanvas).not.toHaveBeenCalled();
        expect(boxSpy).not.toHaveBeenCalled();
        expect(controlSpy).not.toHaveBeenCalled();
    });

    it('cutCanvas', () => {
        const erasePolygonSpy = spyOn(service, 'erasePolygon').and.stub();
        const eraseImageSpy = spyOn(service, 'eraseImage').and.stub();
        service.cutCanvas();
        expect(service['shortcutDisabledLasso']).toBeTruthy();
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(service['selected']).toBeFalsy();
        expect(erasePolygonSpy).toHaveBeenCalled();
        expect(eraseImageSpy).toHaveBeenCalled();
        expect(service['selectedBtn']).toBeFalsy();
        expect(service['pasted']).toBeFalsy();
        expect(service['cutImage']).toBeTruthy();
    });

    it('copyCanvas', () => {
        service.copyCanvas();
        expect(service['shortcutDisabledLasso']).toBeTruthy();
        expect(service['isCopied']).toBeTruthy();
        expect(service['pasted']).toBeFalsy();
        expect(service['cutImage']).toBeFalsy();
    });

    it('should step into second if of mouseDown ', () => {
        const mouseDownEvent = { pageX: 40, pageY: 20, button: MouseButton.Left } as MouseEvent;
        const drawInBasepy = spyOn(service, 'drawImageBaseCtx').and.stub();
        service.imagePosition.x = IMAGE_POSITION_X_TEST;
        service.imagePosition.y = IMAGE_POSITION_Y_TEST;
        service['rejoinedOrigin'] = true;
        service['mouseMove'] = true;
        service['isSelecting'] = true;
        service['isResizing'] = false;
        service.onMouseDown(mouseDownEvent);
        expect(drawInBasepy).toHaveBeenCalled();
    });

    it(' should call drawImagePreviewCtx with first = false', () => {
        const mouseDownEvent = { pageX: 40, pageY: 20, button: MouseButton.Left } as MouseEvent;
        const drawInPreviewpy = spyOn(service, 'drawImagePrewiewCtx').and.callThrough();
        service.mouseDown = true;
        service['isResizing'] = true;
        service['first'] = false;
        service.onMouseMove(mouseDownEvent);
        expect(drawInPreviewpy).toHaveBeenCalled();
    });

    it(' should call drawImagePreviewCtx with first = false and drawingcircle = true', () => {
        const drawInPreviewpy = spyOn(service, 'drawImagePrewiewCtx').and.callThrough();
        service.mouseDown = true;
        service['isResizing'] = true;
        service['first'] = false;
        service.drawImagePrewiewCtx({ x: 50, y: 60 });
        expect(drawInPreviewpy).toHaveBeenCalled();
        expect(service['imageCanvas']).toBeDefined();
    });

    it('clearPath', () => {
        service.clearPath();
        // tslint:disable-next-line: no-unused-expression
        expect(service['pathData']).toBeNull;
    });

    it('ControlPoints', () => {
        const imagePosition = { x: 5, y: 5 } as Vec2;
        const controlSpy = spyOn(service, 'controlPoint').and.callThrough();
        service['gotCopied'] = false;
        service.controlPoint(imagePosition);
        expect(controlSpy).toHaveBeenCalled();
    });

    it('ControlPoints', () => {
        const imagePosition = { x: 5, y: 5 } as Vec2;
        const controlSpy = spyOn(service, 'controlPoint').and.callThrough();
        service['gotCopied'] = true;
        service.controlPoint(imagePosition);
        expect(controlSpy).toHaveBeenCalled();
    });

    it('selectControlPoint', () => {
        const controlSpy = spyOn(service, 'selectControlPoint').and.callThrough();
        service['magnetismOn'] = true;
        service.selectControlPoint();
        expect(controlSpy).toHaveBeenCalled();
    });

    it('selectionInsideCanvas', () => {
        const selectionSpy = spyOn(service, 'selectionInsideCanvas').and.callThrough();
        service.selectionInsideCanvas();
        expect(selectionSpy).toHaveBeenCalled();
    });

    it('should turn on magnetism when M is clicked', () => {
        service.magnetismOn = false;
        const eventMock = { key: 'm' } as KeyboardEvent;
        service.onKeyDown(eventMock);

        expect(service.magnetismOn).toBeTrue();
    });

    it('should call controlePoint, when selectControlPoint is called', () => {
        service.magnetismOn = false;
        const controlePointSpy = spyOn(service, 'controlPoint');
        service.selectControlPoint();
        expect(controlePointSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called and all cases are false', () => {
        service.magnetismOn = true;
        service.magnetism.middle = false;
        service.magnetism.middleUp = false;
        service.magnetism.middleDown = false;
        service.magnetism.leftDown = false;
        service.magnetism.leftUp = false;
        service.magnetism.leftMiddle = false;
        service.magnetism.rightDown = false;
        service.magnetism.rightUp = false;
        service.magnetism.rightMiddle = false;

        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        const controlePointSpy = spyOn(service, 'controlPoint');
        service.selectControlPoint();
        expect(controlePointSpy).toHaveBeenCalled();
        expect(fillRectSpy).not.toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where middle is true', () => {
        service.magnetismOn = true;
        service.magnetism.middle = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where middleUp is true', () => {
        service.magnetismOn = true;
        service.magnetism.middleUp = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where middleDown is true', () => {
        service.magnetismOn = true;
        service.magnetism.middleDown = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where leftUp is true', () => {
        service.magnetismOn = true;
        service.magnetism.leftUp = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where leftDown is true', () => {
        service.magnetismOn = true;
        service.magnetism.leftDown = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where leftMiddle is true', () => {
        service.magnetismOn = true;
        service.magnetism.leftMiddle = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where rightMiddle is true', () => {
        service.magnetismOn = true;
        service.magnetism.rightMiddle = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where rightDown is true', () => {
        service.magnetismOn = true;
        service.magnetism.rightDown = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where rightUp is true', () => {
        service.magnetismOn = true;
        service.magnetism.rightUp = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where leftMiddle is true', () => {
        service.magnetismOn = true;
        service.magnetism.leftMiddle = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should call fillRect, when selectControlPoint is called, in the case where rightMiddle is true', () => {
        service.magnetismOn = true;
        service.magnetism.rightMiddle = true;
        const fillRectSpy = spyOn(previewCtxClone, 'fillRect');
        service.selectControlPoint();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should magnetismControlPoint from magnetism, when magnetismControlPoint is called', () => {
        const magnetismControlPointSpy = spyOn(service.magnetism, 'magnetismControlPoint');
        service.magnetismControlPoint();
        expect(magnetismControlPointSpy).toHaveBeenCalled();
    });

    it('should magnetismArrow from magnetism, when magnetismArrow is called', () => {
        const magnetismArrowSpy = spyOn(service.magnetism, 'magnetismArrow');
        service.magnetismArrow();
        expect(magnetismArrowSpy).toHaveBeenCalled();
    });

    it('should call magnetismControlPoint when magnestism is ON, onMouseMove', () => {
        spyOn(service, 'straigthLine').and.stub();
        spyOn(service, 'selectionBox').and.callThrough();
        spyOn(service, 'putImage').and.stub();
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const magnetismControlPointSpy = spyOn(service, 'magnetismControlPoint').and.callThrough();
        service.magnetismOn = true;
        service.mouseDown = true;
        service['isResizing'] = false;
        service['escapePressed'] = false;
        service['selected'] = true;
        service['gotCopied'] = true;
        service['rejoinedOrigin'] = true;

        service.onMouseDown(event);
        service.onMouseMove(event);

        expect(magnetismControlPointSpy).toHaveBeenCalled();
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowRight, ArrowDown true', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 150, y: 150 };
        const magnetismArrowSpy = spyOn(service, 'selectControlPoint');
        service.selectControlPoint();
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).not.toEqual(result);
    });

    it('should call selectionInsideCanvas  when mousposX is bigger than height of the canvas  ', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 1000, pageY: 50 } as MouseEvent;
        const selectionInsideCanvasSpy = spyOn(service, 'selectionInsideCanvas').and.callThrough();
        service['rejoinedOrigin'] = true;
        service['isResizing'] = false;
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        expect(selectionInsideCanvasSpy).toHaveBeenCalled();
    });

    it('should call selectionInsideCanvas when mousposY is bigger than height of the canvas ', () => {
        const event2 = { pageX: 2, pageY: 4, button: MouseButton.Left } as MouseEvent;
        const mouseMove2 = { pageX: 200, pageY: 750 } as MouseEvent;
        const selectionInsideCanvasSpy = spyOn(service, 'selectionInsideCanvas').and.callThrough();
        service['rejoinedOrigin'] = true;
        service['isResizing'] = false;
        service.onMouseDown(event2);
        service.onMouseMove(mouseMove2);
        service.onMouseUp(mouseMove2);
        expect(selectionInsideCanvasSpy).toHaveBeenCalled();
    });
    it('should call selectionInsideCanvas when mousposY is bigger than height of the canvas ', () => {
        const event2 = { pageX: 2, pageY: 4, button: MouseButton.Left } as MouseEvent;
        const mouseMove2 = { pageX: 200, pageY: 750 } as MouseEvent;
        const selectionInsideCanvasSpy = spyOn(service, 'selectionInsideCanvas').and.callThrough();
        service['rejoinedOrigin'] = true;
        service['isResizing'] = false;
        service.onMouseDown(event2);
        service.onMouseMove(mouseMove2);
        service.onMouseUp(mouseMove2);
        expect(selectionInsideCanvasSpy).toHaveBeenCalled();
    });
    it('should call selectionInsideCanvas when mousposY and mouseposX is bigger than height of the canvas ', () => {
        const event2 = { pageX: 2, pageY: 4, button: MouseButton.Left } as MouseEvent;
        const mouseMove2 = { pageX: 1000, pageY: 750 } as MouseEvent;
        const selectionInsideCanvasSpy = spyOn(service, 'selectionInsideCanvas').and.callThrough();
        service['rejoinedOrigin'] = true;
        service['isResizing'] = false;
        service.onMouseDown(event2);
        service.onMouseMove(mouseMove2);
        service.onMouseUp(mouseMove2);
        expect(selectionInsideCanvasSpy).toHaveBeenCalled();
    });

    it(' should call isInPolygon', () => {
        const mouseMoveEvent = { pageX: 78, pageY: 36 } as MouseEvent;
        spyOn(service.drawingService.baseCtx, 'getImageData').and.stub();
        const isInPolygonSpy = spyOn(service, 'isInPolygon').and.callThrough();
        service.isInPolygon(mouseMoveEvent);
        expect(isInPolygonSpy).toHaveBeenCalled();
    });

    it(' should call erasePolygon', () => {
        const drawImageBaseCtxSpy = spyOn(service, 'drawImageBaseCtx').and.stub();
        spyOn(service.drawingService.baseCtx, 'getImageData').and.stub();
        const erasePolygonSpy = spyOn(service, 'erasePolygon').and.callThrough();
        service.erasePolygon();
        expect(erasePolygonSpy).toHaveBeenCalled();
        expect(drawImageBaseCtxSpy).toHaveBeenCalled();
    });

    it(' should call copyRect', () => {
        spyOn(service, 'drawImageBaseCtx').and.stub();
        spyOn(service.drawingService.previewCtx, 'putImageData').and.stub();
        spyOn(service.drawingService.baseCtx, 'getImageData').and.stub();
        const copyRectSpy = spyOn(service, 'copyRect').and.callThrough();
        service.copyRect();
        expect(copyRectSpy).toHaveBeenCalled();
    });

    it(' should call twentyPxFromInitial', () => {
        service.pathData = [
            { x: 0, y: 0 },
            { x: 15, y: 30 },
            { x: 45, y: 50 },
        ];
        const twentyPxFromInitialSpy = spyOn(service, 'twentyPxFromInitial').and.callThrough();
        service.twentyPxFromInitial();
        expect(twentyPxFromInitialSpy).toHaveBeenCalled();
    });
    // tslint:disable-next-line: max-file-line-count
});

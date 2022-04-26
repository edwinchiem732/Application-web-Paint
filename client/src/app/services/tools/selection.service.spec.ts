import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { IMAGE_HEIGHT, IMAGE_POSITION_X, IMAGE_POSITION_Y, IMAGE_WIDTH } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from './selection.service';
/* tslint:disable:no-string-literal */
describe('SelectionService', () => {
    let service: SelectionService;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas = {} as HTMLCanvasElement;
    let shiftEvent: KeyboardEvent;
    let escapeEvent: KeyboardEvent;
    let arrowUp: KeyboardEvent;
    let arrowDown: KeyboardEvent;
    let arrowLeft: KeyboardEvent;
    let arrowRight: KeyboardEvent;
    let imageCanvas: HTMLImageElement;
    let imageSrc: string;
    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'clearCanvas', 'previewCanvas']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingClone }],
        });
        service = TestBed.inject(SelectionService);
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.previewCtx = previewCtxClone;
        drawingClone.canvas = canvas;
        service.drawingService = drawingClone;
        service.drawingService.baseCtx = drawingClone.baseCtx;
        service.drawingService.previewCtx = drawingClone.previewCtx;
        service.drawingService.canvas = drawingClone.canvas;
        imageSrc = canvas.toDataURL();
        imageCanvas = new Image();

        shiftEvent = new KeyboardEvent('keypress', {
            key: 'Shift',
        });
        escapeEvent = new KeyboardEvent('keypress', {
            key: 'Escape',
        });
        arrowUp = new KeyboardEvent('keypress', {
            key: 'ArrowUp',
        });
        arrowDown = new KeyboardEvent('keypress', {
            key: 'ArrowDown',
        });
        arrowLeft = new KeyboardEvent('keypress', {
            key: 'ArrowLeft',
        });
        arrowRight = new KeyboardEvent('keypress', {
            key: 'ArrowRight',
        });
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should register left mouse button on mouse down', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const mouseDownSpy = spyOn(service, 'onMouseDown').and.callThrough();
        const isSelectedSpy = spyOn(service, 'isSelected').and.callThrough();
        const sideBarWidth = 350;
        const mousePositionX = event.pageX - sideBarWidth;
        service.onMouseDown(event);
        expect(mouseDownSpy).toHaveBeenCalled();
        expect(isSelectedSpy).toHaveBeenCalled();
        expect(service.mouseDown).toEqual(event.button === MouseButton.Left);
        expect(service.mouseMove).toBeFalsy();
        expect(service.isSelecting).toBeFalsy();
        expect(service['selectAll']).toBeFalsy();
        expect(service.mouseDownCoord.x).toEqual(mousePositionX);
        expect(service.mouseDownCoord.y).toEqual(event.pageY);
    });
    it('if imageChange is true', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const mouseMoveSpy = spyOn(service, 'onMouseMove').and.callThrough();
        const rectSpy = spyOn(service, 'rectangleSelection').and.callThrough();
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        expect(service.mouseMove).toBeTruthy();
        expect(service['arrow']).toBeFalsy();
        expect(service['selected']).toBeFalsy();
        expect(mouseMoveSpy).toHaveBeenCalled();
        expect(rectSpy).toHaveBeenCalled();
    });
    it('should set mouseMove to true and arrow to false when mouseDown', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const mouseUpSpy = spyOn(service, 'onMouseUp').and.callThrough();
        const copyRectSpy = spyOn(service, 'copyRect').and.callThrough();
        const boundingBoxSpy = spyOn(service, 'boundingBox').and.callThrough();
        service['square'] = true;
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        expect(copyRectSpy).toHaveBeenCalled();
        expect(mouseUpSpy).toHaveBeenCalled();
        expect(boundingBoxSpy).toHaveBeenCalled();
        expect(service.mouseDown).toBeFalsy();
        expect(service['selected']).toBeFalsy();
        expect(service.isSelecting).toBeTruthy();
        expect(service.mouseMove).toBeTruthy();
        expect(service.copied).toBeTruthy();
    });
    it('sould call mouseDown, mouseMove , mouseUp two times, the first with isselected false second time its true, the last mouseDown with isSelecd false ', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMouseDown2 = { pageX: 100, pageY: 22, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const eventMouseDown3 = { pageX: 400, pageY: 220, button: MouseButton.Left } as MouseEvent;
        const boundingBoxSpy = spyOn(service, 'boundingBox').and.callThrough();
        const mouseDown2Spy = spyOn(service, 'onMouseDown').and.callThrough();
        const drawImageBaseCtxSpy = spyOn(service, 'drawImageBaseCtx').and.stub();
        const putImageSpy = spyOn(service, 'putImage').and.callThrough();
        const isSelectedSpy = spyOn(service, 'isSelected').and.callThrough();
        const initialiseDataSpy = spyOn(service, 'initialiseData').and.callThrough();
        service.onMouseDown(event);
        service['isResizing'] = false;
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.onMouseDown(eventMouseDown2);
        expect(mouseDown2Spy).toHaveBeenCalled();
        service['isResizing'] = false;
        service.onMouseMove(eventMove);
        expect(isSelectedSpy).toBeTruthy();
        expect(service['selected']).toBeTruthy();
        expect(service['escapePressed']).toBeFalsy();
        expect(boundingBoxSpy).toHaveBeenCalledWith(true);
        expect(putImageSpy).toHaveBeenCalledWith();
        service.onMouseUp(eventMove);
        expect(putImageSpy).toHaveBeenCalledWith();
        expect(boundingBoxSpy).toHaveBeenCalledWith(false);
        service.onMouseDown(eventMouseDown3);
        expect(isSelectedSpy).toHaveBeenCalled();
        expect(isSelectedSpy).toBeTruthy();
        expect(drawImageBaseCtxSpy).toHaveBeenCalledWith();
        expect(initialiseDataSpy).toHaveBeenCalled();
    });
    it('call mouse down with isselected returns true ', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMouseDown2 = { pageX: 300, pageY: 150, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const isSelectedSpy = spyOn(service, 'isSelected').and.callThrough();
        const initialiseDataSpy = spyOn(service, 'initialiseData').and.callThrough();
        const drawImageSpy = spyOn(service, 'drawImageBaseCtx').and.stub();
        service.onMouseDown(event);
        expect(isSelectedSpy).toHaveBeenCalled();
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.onMouseDown(eventMouseDown2);
        expect(isSelectedSpy).toHaveBeenCalled();
        expect(isSelectedSpy).toBeTruthy();
        expect(initialiseDataSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
    });
    it('call copy ellipse and ellipseSelection', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        service.selectionOption = false;
        const mouseMoveSpy = spyOn(service, 'onMouseMove').and.callThrough();
        const ellipseSpy = spyOn(service, 'ellipseSelection').and.callThrough();
        const copyEllipseSpy = spyOn(service, 'copyEllipse').and.callThrough();
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        expect(service.mouseMove).toBeTruthy();
        expect(service['arrow']).toBeFalsy();
        expect(service['selected']).toBeFalsy();
        expect(mouseMoveSpy).toHaveBeenCalled();
        expect(ellipseSpy).toHaveBeenCalledWith(service.drawingService.previewCtx);
        expect(copyEllipseSpy).toHaveBeenCalled();
    });
    it('call escape and drawImageBaseCtx when isSelection is false', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        service.selectionOption = false;
        const drawImageBaseCtxSpy = spyOn(service, 'drawImageBaseCtx').and.stub();
        const initialiseDataSpy = spyOn(service, 'initialiseData').and.callThrough();
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        expect(service.mouseMove).toBeTruthy();
        expect(service.isSelecting).toBeTruthy();
        service.onEscape(escapeEvent);
        expect(drawImageBaseCtxSpy).toHaveBeenCalledWith();
        expect(initialiseDataSpy).toHaveBeenCalled();
        expect(service['escapePressed']).toBeFalsy();
        expect(service.mouseMove).toBeFalsy();
        expect(service.isSelecting).toBeFalsy();
    });
    it('call escape and drawImageBaseCtx when isSelecting is true', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        service.selectionOption = false;
        const drawImageBaseCtxSpy = spyOn(service, 'drawImageBaseCtx').and.stub();
        const initialiseDataSpy = spyOn(service, 'initialiseData').and.callThrough();
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        expect(service.mouseMove).toBeTruthy();
        expect(service.isSelecting).toBeTruthy();
        service.onEscape(escapeEvent);
        expect(drawImageBaseCtxSpy).toHaveBeenCalledWith();
        expect(initialiseDataSpy).toHaveBeenCalled();
        expect(service['escapePressed']).toBeFalsy();
        expect(service.mouseMove).toBeFalsy();
        expect(service.isSelecting).toBeFalsy();
    });
    it('all the canvas should be selected', () => {
        const copyRectSpy = spyOn(service, 'copyRect').and.callThrough();
        service.selectAllDrawing();
        expect(service['selectAll']).toBeTruthy();
        expect(service.isSelecting).toBeTruthy();
        expect(copyRectSpy).toHaveBeenCalledWith(service.drawingService.baseCtx);
    });
    it('onShiftDown should Be called and slection option is true', () => {
        const rectSelectionSpy = spyOn(service, 'rectangleSelection').and.callThrough();
        service.selectionOption = true;
        service.mouseDown = true;
        service.onShiftDown(shiftEvent);
        expect(service['square']).toBeTruthy();
        expect(rectSelectionSpy).toHaveBeenCalledWith(service.drawingService.baseCtx, true);
    });
    it('onShiftDown should Be called and slection option is false', () => {
        const ellipseSelectionSpy = spyOn(service, 'ellipseSelection').and.callThrough();
        service.selectionOption = false;
        service.mouseDown = true;
        service.onShiftDown(shiftEvent);
        expect(service['circle']).toBeTruthy();
        expect(ellipseSelectionSpy).toHaveBeenCalledWith(service.drawingService.baseCtx);
    });
    it('onShiftup should Be called and square or circle is supposed to be false ', () => {
        const rectSelectionSpy = spyOn(service, 'rectangleSelection').and.callThrough();
        service.selectionOption = false;
        service.mouseDown = true;
        service.onShiftUp(shiftEvent);
        expect(service['circle']).toBeFalsy();
        expect(rectSelectionSpy).toHaveBeenCalledWith(service.drawingService.baseCtx, true);
        service.selectionOption = true;
        service.onShiftUp(shiftEvent);
        expect(service['square']).toBeFalsy();
        expect(rectSelectionSpy).toHaveBeenCalledWith(service.drawingService.baseCtx, true);
    });
    it('onArrow should Be called and switchKeyArrow', () => {
        const switchKeySpy = spyOn(service, 'switchKeyArrow').and.callThrough();
        const putImageSpy = spyOn(service, 'putImage').and.callThrough();
        const boundingBoxSpy = spyOn(service, 'boundingBox').and.callThrough();
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.continuousMouvment = true;
        service.onArrow(arrowDown);
        expect(switchKeySpy).toHaveBeenCalledWith(arrowDown, false);
        service.onArrow(arrowLeft);
        expect(switchKeySpy).toHaveBeenCalledWith(arrowLeft, false);
        service.onArrow(arrowRight);
        expect(switchKeySpy).toHaveBeenCalledWith(arrowRight, false);
        service.onArrow(arrowUp);
        expect(switchKeySpy).toHaveBeenCalledWith(arrowUp, false);
        expect(putImageSpy).toHaveBeenCalledWith();
        expect(boundingBoxSpy).toHaveBeenCalledWith(false);
    });
    it('onArrow(ArrowUp) should Be called with arrowLeft or ArrowRight true', () => {
        const switchKeySpy = spyOn(service, 'switchKeyArrow').and.callThrough();
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.arrowRight = true;
        service.onArrow(arrowUp);
        expect(switchKeySpy).toHaveBeenCalledTimes(1);
        service.arrowRight = false;
        service.arrowLeft = true;
        service.onArrow(arrowUp);
        expect(switchKeySpy).toHaveBeenCalledTimes(1);
    });
    it('onArrow(arrowDown) should Be called with arrowLeft or ArrowRight true', () => {
        const switchKeySpy = spyOn(service, 'switchKeyArrow').and.callThrough();
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.arrowLeft = true;
        service.onArrow(arrowDown);
        expect(switchKeySpy).toHaveBeenCalledTimes(1);
        service.arrowLeft = false;
        service.arrowRight = true;
        service.onArrow(arrowDown);
        expect(switchKeySpy).toHaveBeenCalledTimes(1);
    });
    it('onArrow(ArrowLeft) should Be called with arrowUp true or arrowDowntrue', () => {
        const switchKeySpy = spyOn(service, 'switchKeyArrow').and.callThrough();
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.arrowUp = true;
        service.onArrow(arrowLeft);
        expect(switchKeySpy).toHaveBeenCalledTimes(1);
        service.arrowUp = false;
        service.arrowDown = true;
        service.onArrow(arrowLeft);
        expect(switchKeySpy).toHaveBeenCalledTimes(1);
    });
    it('onArrow(ArrowRigt) should ce called with arrowDown true or arrowUp true', () => {
        const switchKeySpy = spyOn(service, 'switchKeyArrow').and.callThrough();
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.arrowDown = true;
        service.onArrow(arrowRight);
        expect(switchKeySpy).toHaveBeenCalledTimes(1);
        service.arrowUp = true;
        service.arrowDown = false;
        service.onArrow(arrowRight);
        expect(switchKeySpy).toHaveBeenCalledTimes(1);
    });
    it('image data is supposed to be {}', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const eventMouseDown2 = { pageX: 300, pageY: 56, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);
        service.onMouseUp(eventMove);
        service.onMouseMove(eventMove);
        service.onMouseDown(eventMouseDown2);
        const image = {} as ImageData;
        expect(service.imageData).toEqual(image);
    });
    it('mouse move with pressed', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const eventMouseDown2 = { pageX: 150, pageY: 36, button: MouseButton.Left } as MouseEvent;
        const putImageSpy = spyOn(service, 'putImage').and.callThrough();
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.onMouseDown(eventMouseDown2);
        service['escapePressed'] = true;
        service.onMouseMove(eventMouseDown2);
        expect(putImageSpy).not.toHaveBeenCalled();
    });
    it('On escape with mouseMove not true', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const putImageSpy = spyOn(service, 'putImage').and.callThrough();
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.isSelecting = false;
        service['selectAll'] = true;
        service.mouseMove = false;
        service.onEscape(escapeEvent);
        expect(putImageSpy).not.toHaveBeenCalled();
    });
    it('On shiftUp And Down with mouseDown false', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const putImageSpy = spyOn(service, 'putImage').and.callThrough();
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.mouseDown = false;
        service.onShiftDown(shiftEvent);
        expect(putImageSpy).not.toHaveBeenCalled();
        service.mouseDown = false;
        service.selectionOption = true;
        service.onShiftUp(shiftEvent);
        expect(service['square']).toBeFalsy();
    });
    it('on shiftUp and down with slelectionOption true ', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const putImageSpy = spyOn(service, 'putImage').and.callThrough();
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        service.mouseDown = false;
        service.onShiftDown(shiftEvent);
        expect(putImageSpy).not.toHaveBeenCalled();
        service.mouseDown = false;
        service.selectionOption = true;
        service.onShiftUp(shiftEvent);
        expect(service['square']).toBeFalsy();
    });
    it('should call selectionInsideCanvas  when mousposX is bigger than height of the canvas  ', () => {
        const event = { pageX: 5, pageY: 6, button: MouseButton.Left } as MouseEvent;
        const eventMove = { pageX: 1000, pageY: 50 } as MouseEvent;
        const selectionInsideCanvasSpy = spyOn(service, 'selectionInsideCanvas').and.callThrough();
        service.onMouseDown(event);
        service.onMouseMove(eventMove);
        service.onMouseUp(eventMove);
        expect(selectionInsideCanvasSpy).toHaveBeenCalled();
    });
    it('should call selectionInsideCanvas when mousposY is bigger than height of the canvas ', () => {
        const event2 = { pageX: 2, pageY: 4, button: MouseButton.Left } as MouseEvent;
        const mouseMove2 = { pageX: 200, pageY: 750 } as MouseEvent;
        const selectionInsideCanvasSpy = spyOn(service, 'selectionInsideCanvas').and.callThrough();
        service.onMouseDown(event2);
        service.onMouseMove(mouseMove2);
        service.onMouseUp(mouseMove2);
        expect(selectionInsideCanvasSpy).toHaveBeenCalled();
    });
    it('should call selectionInsideCanvas when mousposY is bigger than height of the canvas ', () => {
        const event2 = { pageX: 2, pageY: 4, button: MouseButton.Left } as MouseEvent;
        const mouseMove2 = { pageX: 200, pageY: 750 } as MouseEvent;
        const selectionInsideCanvasSpy = spyOn(service, 'selectionInsideCanvas').and.callThrough();
        service.onMouseDown(event2);
        service.onMouseMove(mouseMove2);
        service.onMouseUp(mouseMove2);
        expect(selectionInsideCanvasSpy).toHaveBeenCalled();
    });
    it('should call selectionInsideCanvas when mousposY and mouseposX is bigger than height of the canvas ', () => {
        const event2 = { pageX: 2, pageY: 4, button: MouseButton.Left } as MouseEvent;
        const mouseMove2 = { pageX: 1000, pageY: 750 } as MouseEvent;
        const selectionInsideCanvasSpy = spyOn(service, 'selectionInsideCanvas').and.callThrough();
        service.onMouseDown(event2);
        service.onMouseMove(mouseMove2);
        service.onMouseUp(mouseMove2);
        expect(selectionInsideCanvasSpy).toHaveBeenCalled();
    });
    it('should call copy circle', () => {
        const event = { pageX: 2, pageY: 4, button: MouseButton.Left } as MouseEvent;
        const mouseMove = { pageX: 200, pageY: 150 } as MouseEvent;
        const ellipseSelectionSpy = spyOn(service, 'ellipseSelection').and.callThrough();
        const copyCircleSpy = spyOn(service, 'copyCircle').and.callThrough();
        const getCircleImageDataSpy = spyOn(service, 'getCircleImageData').and.callThrough();
        service.selectionOption = false;
        service.onShiftDown(shiftEvent);
        service.onMouseDown(event);
        service.onMouseMove(mouseMove);
        expect(ellipseSelectionSpy).toHaveBeenCalled();
        expect(service['circle']).toBeTruthy();
        service.onMouseUp(mouseMove);
        expect(copyCircleSpy).toHaveBeenCalled();
        expect(getCircleImageDataSpy).toHaveBeenCalled();
        service.onShiftUp(shiftEvent);
        expect(service['circle']).toBeFalsy();
    });
    it('should step into second if of mouseDown ', () => {
        const mouseDownEvent = { pageX: 40, pageY: 20, button: MouseButton.Left } as MouseEvent;
        const widthRectangle = 100;
        const heightRectangle = 100;
        const imageData = drawingClone.baseCtx.getImageData(0, 0, widthRectangle, heightRectangle);
        service['imageResisedPos'].push({ x: 250, y: 90 });
        service['imageResisedPos'].push({ x: 20, y: 80 });
        spyOn(drawingClone.previewCtx, 'getImageData').and.returnValue(imageData);
        spyOn(drawingClone.previewCtx, 'putImageData').and.stub();
        const initialiseDataSpy = spyOn(service, 'initialiseData').and.callThrough();
        const drawInBasepy = spyOn(service, 'drawImageBaseCtx').and.stub();
        service.imagePosition.x = IMAGE_POSITION_X;
        service.imagePosition.y = IMAGE_POSITION_Y;
        service.mouseMove = true;
        service.isSelecting = true;
        service['isResizing'] = false;
        service['isResised'] = true;
        service.imageChanged = true;
        service.onMouseDown(mouseDownEvent);
        expect(initialiseDataSpy).toHaveBeenCalled();
        expect(drawInBasepy).toHaveBeenCalled();
    });
    it('should step into first if of mouseDown with drawing circle to true  ', () => {
        const mouseDownEvent = { pageX: 40, pageY: 20, button: MouseButton.Left } as MouseEvent;
        service.isSelecting = true;
        service['isDrawingCircle'] = true;
        service['isResised'] = false;
        service.onMouseDown(mouseDownEvent);
        expect(service['isResizing']).toBeFalsy();
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
        const mouseDownEvent = { pageX: 40, pageY: 20, button: MouseButton.Left } as MouseEvent;
        const drawInPreviewpy = spyOn(service, 'drawImagePrewiewCtx').and.callThrough();
        service.mouseDown = true;
        service['isResizing'] = true;
        service['first'] = false;
        service['isDrawingCircle'] = true;
        service.onMouseMove(mouseDownEvent);
        expect(drawInPreviewpy).toHaveBeenCalled();
    });
    it(' should call drawImagePreviewCtx with first = false and drawingcircle = true', () => {
        const drawInPreviewpy = spyOn(service, 'drawImagePrewiewCtx').and.callThrough();
        service.mouseDown = true;
        service['isResizing'] = true;
        service['first'] = false;
        service['isDrawingCircle'] = true;
        service.drawImagePrewiewCtx({ x: 50, y: 60 });
        expect(drawInPreviewpy).toHaveBeenCalled();
        expect(service['imageCanvas']).toBeDefined();
    });
    it(' should call onloadImageCanvas and boundingBox', () => {
        imageCanvas.src = imageSrc;
        const boundingBoxSpy = spyOn(service, 'boundingBox').and.callThrough();
        service['imageCanvas'] = new Image();
        service['imageCanvas'].src = imageCanvas.src;
        service['imageResisedPos'].push({ x: 250, y: 90 });
        service['imageResisedPos'].push({ x: 20, y: 80 });
        service.onloadImageCanvas({ x: 50, y: 60 }, IMAGE_WIDTH, IMAGE_HEIGHT);
        expect(boundingBoxSpy).toHaveBeenCalled();
    });
    it(' should call on MouseUp put isresizing to false and first to true ', () => {
        const mousEvent = { pageX: 40, pageY: 20 } as MouseEvent;
        const boundingBoxSpy = spyOn(service, 'boundingBox').and.callThrough();
        service.onMouseUp(mousEvent);
        expect(service['first']).toBeTruthy();
        expect(service['isResizing']).toBeFalsy();
        expect(boundingBoxSpy).toHaveBeenCalled();
    });
    it(' should call getEllipseImageData', () => {
        const mousEvent = { pageX: 40, pageY: 20, button: MouseButton.Left } as MouseEvent;
        const mouseMoveEvent = { pageX: 78, pageY: 36 } as MouseEvent;
        const getEllipseImageDataSpy = spyOn(service, 'getEllipseImageData').and.callThrough();
        service.selectionOption = false;
        service.onMouseDown(mousEvent);
        service.onMouseMove(mouseMoveEvent);
        service.onMouseUp(mouseMoveEvent);
        expect(getEllipseImageDataSpy).toHaveBeenCalled();
    });
    it(' should call boundingBox with isResizing = true', () => {
        const bounbdingSpy = spyOn(service, 'boundingBox').and.stub();
        service.selectionOption = false;
        service['isResizing'] = true;
        service.boundingBox(false);
        expect(bounbdingSpy).toHaveBeenCalledWith(false);
    });
    it(' should call putImage with arrow = false and isdrawingCircle = true', () => {
        const mousEvent = { pageX: 40, pageY: 20, button: MouseButton.Left } as MouseEvent;
        const mouseMoveEvent = { pageX: 78, pageY: 36 } as MouseEvent;
        const putImageSpy = spyOn(service, 'putImage').and.callThrough();
        service.onMouseDown(mousEvent);
        service.onMouseMove(mouseMoveEvent);
        service.onMouseUp(mouseMoveEvent);
        service.onMouseDown(mouseMoveEvent);
        service['isDrawingCircle'] = true;
        service['isResizing'] = false;
        service.mouseDown = true;
        service['selected'] = true;
        service['escapePressed'] = false;
        service.onMouseMove(mouseMoveEvent);
        expect(putImageSpy).toHaveBeenCalled();
    });
    it(' should call copy rect with the fourth case of the switch', () => {
        const mousEvent = { pageX: 550, pageY: 220, button: MouseButton.Left } as MouseEvent;
        const mouseMoveEvent = { pageX: 78, pageY: 36 } as MouseEvent;
        const copyRectSpy = spyOn(service, 'copyRect').and.callThrough();
        service.onMouseDown(mousEvent);
        service.onMouseMove(mouseMoveEvent);
        service.onMouseUp(mouseMoveEvent);
        expect(copyRectSpy).toHaveBeenCalled();
        expect(service.imagePosition.x).toEqual(service.mousePosition.x);
    });
    it(' should call copy rect with the second case of the switch', () => {
        const mousEvent = { pageX: 550, pageY: 20, button: MouseButton.Left } as MouseEvent;
        const mouseMoveEvent = { pageX: 78, pageY: 36 } as MouseEvent;
        const copyRectSpy = spyOn(service, 'copyRect').and.callThrough();
        service.onMouseDown(mousEvent);
        service.onMouseMove(mouseMoveEvent);
        service.onMouseUp(mouseMoveEvent);
        expect(copyRectSpy).toHaveBeenCalled();
        expect(service.imagePosition.y).toEqual(service.mouseDownCoord.y);
    });
    it(' should call copy rect with the third case of the switch', () => {
        const mousEvent = { pageX: 50, pageY: 200, button: MouseButton.Left } as MouseEvent;
        const mouseMoveEvent = { pageX: 78, pageY: 36 } as MouseEvent;
        const copyRectSpy = spyOn(service, 'copyRect').and.callThrough();
        service.onMouseDown(mousEvent);
        service.onMouseMove(mouseMoveEvent);
        service.onMouseUp(mouseMoveEvent);
        expect(copyRectSpy).toHaveBeenCalled();
        expect(service.imagePosition.y).toEqual(service.mousePosition.y);
    });
    it(' should call getCircleImageData with radius y > radius x ', () => {
        const mouseEvent = { pageX: 70, pageY: 15, button: MouseButton.Left } as MouseEvent;
        const mouseMoveEvent = { pageX: 78, pageY: 36 } as MouseEvent;
        const getCircleImageSpy = spyOn(service, 'getCircleImageData').and.callThrough();
        service.selectionOption = false;
        service['circle'] = true;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseMoveEvent);
        service.onMouseUp(mouseMoveEvent);
        expect(getCircleImageSpy).toHaveBeenCalled();
    });
    it('should copy the selection', () => {
        const widthRectangle = 100;
        const heightRectangle = 100;
        const imageData = drawingClone.baseCtx.getImageData(0, 0, widthRectangle, heightRectangle);

        service['imageData'] = imageData;
        service['shortcutDisabled'] = true;
        service['imageDataCopied'] = service['imageData'];
        service['isCopied'] = true;
        service['cutImage'] = false;
        service['isPasted'] = false;

        service.copyCanvas();

        expect(service['imageData']).toEqual(imageData);
        expect(service['shortcutDisabled']).toEqual(true);
        expect(service['imageDataCopied']).toEqual(service['imageData']);
        expect(service['isCopied']).toEqual(true);
        expect(service['cutImage']).toEqual(false);
        expect(service['isPasted']).toEqual(false);
        expect(service['imageData'].width).toEqual(widthRectangle);
        expect(service['imageData'].height).toEqual(heightRectangle);
        expect(service['imageDataCopied'].width).toEqual(widthRectangle);
        expect(service['imageData'].height).toEqual(heightRectangle);
    });

    it('should not paste selection if selection not copied', () => {
        service['shortcutDisabled'] = true;
        service['isCopied'] = false;
        service.pasteCanvas();
        expect(service['shortcutDisabled']).toEqual(true);
        expect(service['isCopied']).toEqual(false);
    });

    it('should paste selection after copying the selection', () => {
        const widthRectangle = 100;
        const heightRectangle = 100;
        const imageData = drawingClone.baseCtx.getImageData(0, 0, widthRectangle, heightRectangle);

        // drawingClone.previewCtx.putImageData(imageData, 2, 2);
        const spy = spyOn(service, 'drawImageBaseCtx').and.stub();
        const spyPoint = spyOn(service, 'controlePoint').and.callThrough();
        service['shortcutDisabled'] = true;
        service['isCopied'] = true;
        service['cutImage'] = false;
        service['selected'] = true;
        service['imageData'] = imageData;
        service['imageDataCopied'] = service['imageData'];
        service['isPasted'] = true;

        service.pasteCanvas();

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(spyPoint).toHaveBeenCalled();
        expect(service['shortcutDisabled']).toEqual(true);
        expect(service['cutImage']).toEqual(false);
        expect(service['selected']).toEqual(true);
        expect(service['isCopied']).toEqual(true);
        expect(service['imageData']).toEqual(imageData);
        expect(service['imageDataCopied']).toEqual(service['imageData']);
        expect(service['imageData'].width).toEqual(widthRectangle);
        expect(service['imageData'].height).toEqual(heightRectangle);
        expect(service['imageDataCopied'].width).toEqual(widthRectangle);
        expect(service['imageData'].height).toEqual(heightRectangle);
        expect(service['isPasted']).toEqual(true);
    });

    it('should cut the selection when selected a rectangle with counter = 1', () => {
        service['selectionOption'] = true;
        service['counter'] = 2;
        service.cutCanvas();

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(service['shortcutDisabled']).toEqual(true);
        expect(service['cutImage']).toEqual(true);
        expect(service['selected']).toEqual(false);
        expect(service['selectedBtn']).toEqual(false);
        expect(service['selectionOption']).toEqual(true);
    });
    it('should cut the selection when selected a rectangle with counter = 0', () => {
        service['selectionOption'] = true;
        service['counter'] = 0;
        service.cutCanvas();

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(service['shortcutDisabled']).toEqual(true);
        expect(service['cutImage']).toEqual(true);
        expect(service['selected']).toEqual(false);
        expect(service['selectedBtn']).toEqual(false);
        expect(service['selectionOption']).toEqual(true);
    });

    it('should cut the selection when selected an ellipse', () => {
        service['selectionOption'] = false;
        service['counter'] = 2;
        service.cutCanvas();

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(service['shortcutDisabled']).toEqual(true);
        expect(service['cutImage']).toEqual(true);
        expect(service['selected']).toEqual(false);
        expect(service['selectedBtn']).toEqual(false);
        expect(service['selectionOption']).toEqual(false);
    });
    it('should cut the selection when selected an ellipse with counter = 0', () => {
        service['selectionOption'] = false;
        service['counter'] = 0;
        service.cutCanvas();

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(service['shortcutDisabled']).toEqual(true);
        expect(service['cutImage']).toEqual(true);
        expect(service['selected']).toEqual(false);
        expect(service['selectedBtn']).toEqual(false);
        expect(service['selectionOption']).toEqual(false);
    });
    it('should on mouseUp with resizing = true ', () => {
        const widthRectangle = 100;
        const heightRectangle = 100;
        const eventMove = { pageX: 200, pageY: 40 } as MouseEvent;
        const imageData = drawingClone.baseCtx.getImageData(0, 0, widthRectangle, heightRectangle);

        service['imageResisedPos'].push({ x: 250, y: 90 });
        service['imageResisedPos'].push({ x: 20, y: 80 });

        spyOn(drawingClone.previewCtx, 'getImageData').and.returnValue(imageData);
        spyOn(drawingClone.previewCtx, 'putImageData').and.stub();
        service['isResizing'] = true;
        service.onMouseUp(eventMove);
        expect(service['first']).toBeTruthy();
        expect(service['isResizing']).toBeFalsy();
    });
    it('should call bounding box with isResing = true', () => {
        service['imageResisedPos'].push({ x: 250, y: 90 });
        service['imageResisedPos'].push({ x: 20, y: 80 });

        service['isResizing'] = true;
        service.boundingBox(false);
        expect(service['isResizing']).toBeTruthy();
    });

    it('should turn on magnetism when M is clicked', () => {
        service.magnetismOn = false;
        const eventMock = { key: 'm' } as KeyboardEvent;
        service.onKeyDown(eventMock);

        expect(service.magnetismOn).toBeTrue();
    });

    it('should call controlePoint, when selectControlPoint is called', () => {
        service.magnetismOn = false;
        const controlePointSpy = spyOn(service, 'controlePoint');
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
        const controlePointSpy = spyOn(service, 'controlePoint');
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
        spyOn(service, 'boundingBox').and.callThrough();
        spyOn(service, 'putImage').and.stub();
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const magnetismControlPointSpy = spyOn(service, 'magnetismControlPoint').and.callThrough();
        service.magnetismOn = true;
        service.mouseDown = true;
        service['isResizing'] = false;
        service['escapePressed'] = false;
        service['selected'] = true;

        service.onMouseDown(event);
        service.onMouseMove(event);

        expect(magnetismControlPointSpy).toHaveBeenCalled();
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowUp', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowRight = false;
        service.arrowLeft = false;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 100, y: 50 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowUp' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowUp, arrowRight true', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowRight = true;
        service.arrowLeft = false;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 150, y: 50 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowUp' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowUp, arrowLeft true', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowRight = false;
        service.arrowLeft = true;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 50, y: 50 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowUp' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowDown', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowRight = false;
        service.arrowLeft = false;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 100, y: 150 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowDown' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowDown, arrowRight true', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowRight = true;
        service.arrowLeft = false;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 150, y: 150 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowDown' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowDown, arrowLeft true', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowRight = false;
        service.arrowLeft = true;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 50, y: 150 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowDown' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowLeft', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowUp = false;
        service.arrowDown = false;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 50, y: 100 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowLeft' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowLeft, arrowUp true', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowUp = true;
        service.arrowDown = false;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 50, y: 50 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowLeft' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowLeft, arrowDown true', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowUp = false;
        service.arrowDown = true;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 50, y: 150 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowLeft' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowRight', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowUp = false;
        service.arrowDown = false;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 150, y: 100 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowRight' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowRight, ArrowUp true', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowUp = true;
        service.arrowDown = false;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 150, y: 50 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowRight' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    it('should modify imagePosition when magnetism is on, on switchKeyArrow, case ArrowRight, ArrowDown true', () => {
        spyOn(service, 'putImage').and.stub();
        service.magnetismOn = true;
        service.arrowUp = false;
        service.arrowDown = true;
        service.imagePosition = { x: 100, y: 100 };
        const result = { x: 150, y: 150 };
        const magnetismArrowSpy = spyOn(service, 'magnetismArrow');
        const eventMock = { key: 'ArrowRight' } as KeyboardEvent;
        service.switchKeyArrow(eventMock, false);
        expect(magnetismArrowSpy).toHaveBeenCalled();
        expect(service.imagePosition).toEqual(result);
    });

    // tslint:disable-next-line: max-file-line-count
});

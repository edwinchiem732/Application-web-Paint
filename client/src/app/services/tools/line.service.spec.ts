import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line.service';

/* tslint:disable:no-string-literal */
describe('LineService', () => {
    let service: LineService;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'clearCanvas', 'copyCanvas', 'pasteCanvas']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingClone }],
        });
        service = TestBed.inject(LineService);
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.previewCtx = previewCtxClone;
        drawingClone.canvas = canvas;
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseDown should be true onMouseClick', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.onMouseClick(event);
        expect(service.mouseDown).toBeTrue();
        expect(drawingClone.copyCanvas).toHaveBeenCalled();
    });

    it('if shift is true when onMouseClick, angleBetweenLine should be called', () => {
        const event = { offsetX: 10, offsetY: 2, button: MouseButton.Left } as MouseEvent;
        spyOn(service, 'junction').and.callFake(() => {
            return null;
        });
        spyOn(service, 'clearPath').and.callFake(() => {
            return null;
        });

        const angleBetweenLineSpy = spyOn(service, 'angleBetweenLine').and.stub();

        service.mouseDown = true;
        service['shift'] = true;

        service.onMouseClick(event);
        expect(angleBetweenLineSpy).toHaveBeenCalled();
    });

    it('if junctionOn is true when onMouseClick, junction should be called', () => {
        const event = { offsetX: 10, offsetY: 2, button: MouseButton.Left } as MouseEvent;

        spyOn(service, 'clearPath').and.callFake(() => {
            return null;
        });

        const junctionSpy = spyOn(service, 'junction');

        service.junctionOn = true;
        service.mouseDown = true;
        service['shift'] = false;

        service.onMouseClick(event);
        expect(junctionSpy).toHaveBeenCalled();
    });

    it('mouseDown should be false, but endline should be true onMouseDoubleClick', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;

        spyOn(service, 'twentyPxFromInitial').and.callFake(() => {
            return false;
        });
        spyOn(service, 'line').and.callFake(() => {
            return null;
        });

        service.onMouseDoubleClick(event);

        expect(service.mouseDown).toBeFalsy();
        expect(service['endLine']).toBeTruthy();
    });

    it('if twentyPxFromInitial is true on doubleClick, clearCanvas, copyCanvas and line are called', () => {
        const event = { offsetX: 20, offsetY: 21, button: MouseButton.Left } as MouseEvent;

        spyOn(service, 'twentyPxFromInitial').and.callFake(() => {
            return true;
        });

        const lineSpy = spyOn(service, 'line').and.stub();

        spyOn(service, 'clearPath').and.callFake(() => {
            return null;
        });

        service.onMouseDoubleClick(event);

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(lineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call clearCanvas and straigthLine if mouse was already down', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const straigthLineSpy = spyOn(service, 'straigthLine');

        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(event);
        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(straigthLineSpy).toHaveBeenCalled();
    });

    it('if shift is true when onMouseMove, angleBetweenLine should be called', () => {
        const event = { offsetX: 10, offsetY: 2, button: MouseButton.Left } as MouseEvent;
        spyOn(service, 'straigthLine').and.callFake(() => {
            return null;
        });
        spyOn(service, 'clearPath').and.callFake(() => {
            return null;
        });

        const angleBetweenLineSpy = spyOn(service, 'angleBetweenLine').and.stub();

        service.mouseDown = true;
        service['shift'] = true;

        service.onMouseMove(event);
        expect(angleBetweenLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call straigthLine if mouse was already down and angleBetweenLine if shift is true', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const straigthLineSpy = spyOn(service, 'straigthLine');
        const angleBetweenLineSpy = spyOn(service, 'angleBetweenLine');
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service['shift'] = true;

        service.onMouseUp(event);
        expect(straigthLineSpy).toHaveBeenCalled();
        expect(angleBetweenLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call straigthLine and not call angleBetweenLine if Shift is false', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const straigthLineSpy = spyOn(service, 'straigthLine');
        const angleBetweenLineSpy = spyOn(service, 'angleBetweenLine');
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service['shift'] = false;

        service.onMouseUp(event);
        expect(straigthLineSpy).toHaveBeenCalled();
        expect(angleBetweenLineSpy).not.toHaveBeenCalled();
    });

    it('on backspace, clearCanvas, pasteCanvas and line are called', () => {
        const event = new KeyboardEvent('backspace') as KeyboardEvent;
        const lineSpy = spyOn(service, 'line').and.callThrough();
        service.onBackspace(event);

        service.junctionOn = false;
        service['endLine'] = true;

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(drawingClone.pasteCanvas).toHaveBeenCalled();
        expect(lineSpy).toHaveBeenCalled();
        expect(service.mouseDown).toBeFalse();
        expect(service['endLine']).toBeTrue();
    });

    it('on backspace, if endline is false, straigthLine is called', () => {
        const event = new KeyboardEvent('backspace') as KeyboardEvent;
        const straigthLineSpy = spyOn(service, 'straigthLine');

        service['endLine'] = false;
        service.onBackspace(event);
        expect(straigthLineSpy).toHaveBeenCalled();
    });

    it('on backspace, if junctionOn is true, junction is called', () => {
        const event = new KeyboardEvent('backspace') as KeyboardEvent;
        spyOn(service, 'straigthLine').and.callFake(() => {
            return null;
        });
        spyOn(service, 'clearPath').and.callFake(() => {
            return null;
        });
        spyOn(service, 'line').and.callFake(() => {
            return null;
        });

        const junctionSpy = spyOn(service, 'junction').and.stub();

        service.pathData = [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 5, y: 6 },
            { x: 11, y: 12 },
        ];

        service['endLine'] = true;
        service.junctionOn = true;

        service.onBackspace(event);

        expect(junctionSpy).toHaveBeenCalled();
    });

    it('on escape, clearCanvas, pasteCanvas and line are called and mouseDown is false, but endLine is true', () => {
        const event = new KeyboardEvent('escape') as KeyboardEvent;
        service['endLine'] = false;
        service.onEscape(event);

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(drawingClone.pasteCanvas).toHaveBeenCalled();
        expect(service.mouseDown).toBeFalse();
        expect(service['endLine']).toBeTrue();
    });

    it('on shift down, ', () => {
        const event = new KeyboardEvent('shift') as KeyboardEvent;
        // tslint:disable-next-line: no-any
        spyOn<any>(service, 'angleBetweenLine').and.callFake(() => {
            return null;
        });
        const straigthLineSpy = spyOn(service, 'straigthLine');

        service.onShiftDown(event);

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(straigthLineSpy).toHaveBeenCalled();
    });

    it('on shift up, ', () => {
        const event = new KeyboardEvent('shift') as KeyboardEvent;
        const straigthLineSpy = spyOn(service, 'straigthLine');

        service.onShiftUp(event);

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(straigthLineSpy).toHaveBeenCalled();
    });

    it('canvas fonction are called when straigthLine is called', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;

        const path = { x: 20, y: 21 };

        const beginPathSpy = spyOn(baseCtxClone, 'beginPath');
        const setLineDashSpy = spyOn(baseCtxClone, 'setLineDash');
        const lineToSpy = spyOn(baseCtxClone, 'lineTo');
        const moveToSpy = spyOn(baseCtxClone, 'moveTo');
        const strokeSpy = spyOn(baseCtxClone, 'stroke');

        service.onMouseClick(event);
        service.straigthLine(baseCtxClone, path);

        expect(beginPathSpy).toHaveBeenCalled();
        expect(setLineDashSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('canvas fonction are called when line is called', () => {
        const path: Vec2[] = [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 5, y: 6 },
            { x: 11, y: 12 },
        ];

        const beginPathSpy = spyOn(baseCtxClone, 'beginPath');
        const lineToSpy = spyOn(baseCtxClone, 'lineTo');
        const moveToSpy = spyOn(baseCtxClone, 'moveTo');
        const strokeSpy = spyOn(baseCtxClone, 'stroke');

        spyOn(service, 'angleBetweenLine').and.returnValue({ x: 1, y: 2 });
        service.closestVerticalOrHorizontal({ x: 3, y: 500 }, { x: 2, y: 100 });
        service.line(drawingClone.baseCtx, path);

        expect(beginPathSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('canvas fonction are not called when line is called if path is empty', () => {
        const path: Vec2[] = [];

        const beginPathSpy = spyOn(baseCtxClone, 'beginPath');
        const lineToSpy = spyOn(baseCtxClone, 'lineTo');
        const moveToSpy = spyOn(baseCtxClone, 'moveTo');
        const strokeSpy = spyOn(baseCtxClone, 'stroke');

        service.line(drawingClone.baseCtx, path);

        expect(beginPathSpy).not.toHaveBeenCalled();
        expect(lineToSpy).not.toHaveBeenCalled();
        expect(moveToSpy).not.toHaveBeenCalled();
        expect(strokeSpy).not.toHaveBeenCalled();
    });

    it('canvas fonction are called when junction is called', () => {
        const path = { x: 1, y: 2 };
        const fillSpy = spyOn(baseCtxClone, 'fill');

        service.junction(baseCtxClone, path);

        expect(fillSpy).toHaveBeenCalled();
    });

    it('twentyPxFromInitial should return true', () => {
        service.pathData = [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 5, y: 6 },
            { x: 11, y: 12 },
        ];
        expect(service.twentyPxFromInitial()).toBeTrue();
    });

    it('twentyPxFromInitial should return false', () => {
        service.pathData = [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 5, y: 6 },
            { x: 21, y: 22 },
        ];
        expect(service.twentyPxFromInitial()).toBeFalse();
    });

    it('closestVerticalOrHorizontal should return same x value as previous point', () => {
        const cursorPoint = { x: 5, y: 6 } as Vec2;
        const previousPoint = { x: 7, y: 8 } as Vec2;
        const resultPoint = { x: 7, y: 6 } as Vec2;
        service.closestVerticalOrHorizontal(cursorPoint, previousPoint);
        expect(service.closestVerticalOrHorizontal(cursorPoint, previousPoint)).toEqual(resultPoint);
    });

    it('closestVerticalOrHorizontal should return same y value as previous point', () => {
        const cursorPoint = { x: 5, y: 6 } as Vec2;
        const previousPoint = { x: 8, y: 8 } as Vec2;
        const resultPoint = { x: 5, y: 8 } as Vec2;
        service.closestVerticalOrHorizontal(cursorPoint, previousPoint);
        expect(service.closestVerticalOrHorizontal(cursorPoint, previousPoint)).toEqual(resultPoint);
    });

    it('angleBetweenLine should return the correct value in quadrant 4, where value of x is equal to value of y', () => {
        const cursorPoint = { x: 70, y: 65 } as Vec2;
        const previousPoint = { x: 50, y: 50 } as Vec2;
        const resultPoint = { x: 67.67766952966369, y: 67.67766952966369 } as Vec2;
        service.angleBetweenLine(cursorPoint, previousPoint);
        expect(service.angleBetweenLine(cursorPoint, previousPoint)).toEqual(resultPoint);
    });

    it('angleBetweenLine should return the correct value in quadrant 3, where value of x is equal to value of y', () => {
        const cursorPoint = { x: 30, y: 35 } as Vec2;
        const previousPoint = { x: 50, y: 50 } as Vec2;
        const resultPoint = { x: 32.32233047033631, y: 32.32233047033631 } as Vec2;
        service.angleBetweenLine(cursorPoint, previousPoint);
        expect(service.angleBetweenLine(cursorPoint, previousPoint)).toEqual(resultPoint);
    });

    it('angleBetweenLine should return the correct value in quadrant 2, where value of x is equal to value of y', () => {
        const cursorPoint = { x: 70, y: 35 } as Vec2;
        const previousPoint = { x: 50, y: 50 } as Vec2;
        const resultPoint = { x: 67.67766952966369, y: 32.32233047033631 } as Vec2;
        service.angleBetweenLine(cursorPoint, previousPoint);
        expect(service.angleBetweenLine(cursorPoint, previousPoint)).toEqual(resultPoint);
    });

    it('angleBetweenLine should return the correct value in quadrant 1, where value of x is equal to value of y', () => {
        const cursorPoint = { x: 30, y: 65 } as Vec2;
        const previousPoint = { x: 50, y: 50 } as Vec2;
        const resultPoint = { x: 32.32233047033631, y: 67.67766952966369 } as Vec2;
        service.angleBetweenLine(cursorPoint, previousPoint);
        expect(service.angleBetweenLine(cursorPoint, previousPoint)).toEqual(resultPoint);
    });

    it('angleBetweenLine will enter the else and should return same y value as previous point', () => {
        const cursorPoint = { x: 20, y: 1 } as Vec2;
        const previousPoint = { x: 0, y: 0 } as Vec2;
        const resultPoint = { x: 20, y: 0 } as Vec2;
        service.angleBetweenLine(cursorPoint, previousPoint);
        expect(service.angleBetweenLine(cursorPoint, previousPoint)).toEqual(resultPoint);
    });
    // tslint:disable-next-line: max-file-line-count
});

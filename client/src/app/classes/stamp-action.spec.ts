import { TestBed } from '@angular/core/testing';
import { StampAction } from '@app/classes//stamp-action';
import { CANVAS_HEIGHT, CANVAS_WIDTH, CENTER_X, CENTER_Y, TEST_HEIGHT, TEST_WIDTH } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampService } from '@app/services/tools/stamp.service';
import { CanvasTestHelper } from './canvas-test-helper';

// tslint:disable:no-any
/* tslint:disable:no-string-literal */
describe('StampAction', () => {
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let stampServiceSpy: jasmine.SpyObj<StampService>;
    let stampNameStub: string;
    let mouseCenterXStub: number;
    let mouseCenterYStub: number;
    let stampPrintStub: HTMLImageElement;
    let canvasHeightStub: number;
    let canvasWidthStub: number;
    let newWidthStub: number;
    let newHeightStub: number;
    let stampActionStub: StampAction;
    let angleStub: number;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        stampNameStub = 'http://localhost:9876/stamp1';
        mouseCenterXStub = CENTER_X;
        mouseCenterYStub = CENTER_Y;
        newHeightStub = TEST_HEIGHT;
        newWidthStub = TEST_WIDTH;
        canvasHeightStub = CANVAS_HEIGHT;
        canvasWidthStub = CANVAS_WIDTH;
        angleStub = 0;

        stampPrintStub = new Image();
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['baseCtx', 'clearCanvas', 'imageCanvas', 'copyCanvas', 'drawImage']);
        stampServiceSpy = jasmine.createSpyObj('StampService', [], {
            stampName: stampNameStub,
            stampPrint: stampPrintStub,
            newWidth: newWidthStub,
            newHeight: newHeightStub,
            mouseCenterX: mouseCenterXStub,
            mouseCenterY: mouseCenterYStub,
            canvasHeight: canvasHeightStub,
            canvasWidth: canvasWidthStub,
            angle: angleStub,
        });

        stampActionStub = new StampAction(
            drawingServiceSpy,
            stampServiceSpy,
            stampNameStub,
            mouseCenterXStub,
            mouseCenterYStub,
            stampPrintStub,
            canvasHeightStub,
            canvasWidthStub,
            newWidthStub,
            newHeightStub,
            angleStub,
        );
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: StampAction, useValue: stampActionStub },
                { provide: StampService, useValue: stampServiceSpy },
            ],
        });

        drawingServiceSpy.baseCtx = baseCtxClone;
        drawingServiceSpy.canvas = canvas;

        stampServiceSpy = TestBed.inject(StampService) as jasmine.SpyObj<StampService>;
        stampActionStub = TestBed.inject(StampAction);
    });
    it('should create an instance', () => {
        expect(
            new StampAction(
                drawingServiceSpy,
                stampServiceSpy,
                stampNameStub,
                mouseCenterXStub,
                mouseCenterYStub,
                stampPrintStub,
                canvasHeightStub,
                canvasWidthStub,
                newWidthStub,
                newHeightStub,
                angleStub,
            ),
        ).toBeTruthy();
    });

    it('should apply actions when stamp is drawn on the canvas', () => {
        stampServiceSpy.stampName = stampNameStub;
        stampPrintStub.src = stampNameStub;
        stampServiceSpy.stampPrint = stampPrintStub;
        stampServiceSpy.newWidth = newWidthStub;
        stampServiceSpy.newHeight = newHeightStub;

        stampServiceSpy.canvasHeight = canvasHeightStub;
        stampServiceSpy.canvasWidth = canvasWidthStub;

        stampServiceSpy.mouseCenterX = mouseCenterXStub;
        stampServiceSpy.mouseCenterY = mouseCenterYStub;

        stampServiceSpy.angle = angleStub;

        stampActionStub.applyActions();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(stampServiceSpy.stampName).toEqual(stampNameStub);
        expect(stampPrintStub.src).toEqual(stampNameStub);
        expect(stampServiceSpy.stampPrint).toEqual(stampPrintStub);
        expect(stampServiceSpy.newWidth).toEqual(newWidthStub);
        expect(stampServiceSpy.newHeight).toEqual(newHeightStub);

        expect(stampServiceSpy.canvasHeight).toEqual(canvasHeightStub);
        expect(stampServiceSpy.canvasWidth).toEqual(canvasWidthStub);

        expect(stampServiceSpy.mouseCenterX).toEqual(mouseCenterXStub);
        expect(stampServiceSpy.mouseCenterY).toEqual(mouseCenterYStub);

        expect(stampServiceSpy.angle).toEqual(angleStub);
    });
});

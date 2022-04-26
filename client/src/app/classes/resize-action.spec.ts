import { TestBed } from '@angular/core/testing';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeAction } from './resize-action';

describe('ResizeAction', () => {
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let widthCanvas: number;
    let heightCanvas: number;

    let resizeActionStub: ResizeAction;
    let oldCanvas: string;

    beforeEach(() => {
        widthCanvas = DEFAULT_WIDTH;
        heightCanvas = DEFAULT_HEIGHT;

        oldCanvas = 'urlOldCanvas';

        drawingServiceSpy = jasmine.createSpyObj('DrawingService', [
            'dotSize',
            'canvasSize',
            'grabberSide',
            'grabberRight',
            'grabberBottom',
            'copiedCanvas',
            'copyCanvas',
        ]);
        resizeActionStub = new ResizeAction(drawingServiceSpy, widthCanvas, heightCanvas, oldCanvas);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ResizeAction, useValue: resizeActionStub },
            ],
        });

        resizeActionStub = TestBed.inject(ResizeAction);
    });

    it('should create an instance', () => {
        expect(new ResizeAction(drawingServiceSpy, widthCanvas, heightCanvas, oldCanvas)).toBeTruthy();
    });

    it('should apply actions for resized canvas', () => {
        drawingServiceSpy.dotSize = { x: widthCanvas, y: heightCanvas };

        drawingServiceSpy.canvasSize = drawingServiceSpy.dotSize;
        drawingServiceSpy.grabberSide = drawingServiceSpy.dotSize;

        drawingServiceSpy.grabberRight.x = drawingServiceSpy.dotSize.x;
        drawingServiceSpy.grabberRight.y = drawingServiceSpy.dotSize.y / 2;

        drawingServiceSpy.grabberBottom.x = drawingServiceSpy.dotSize.x / 2;
        drawingServiceSpy.grabberBottom.y = drawingServiceSpy.dotSize.y;
        drawingServiceSpy.copiedCanvas = oldCanvas;

        resizeActionStub.applyActions();
        expect(drawingServiceSpy.copyCanvas).toHaveBeenCalled();
        expect(drawingServiceSpy.dotSize).toEqual({ x: widthCanvas, y: heightCanvas });
        expect(drawingServiceSpy.canvasSize).toEqual(drawingServiceSpy.dotSize);
        expect(drawingServiceSpy.grabberSide).toEqual(drawingServiceSpy.dotSize);
        expect(drawingServiceSpy.grabberRight.x).toEqual(drawingServiceSpy.dotSize.x);
        expect(drawingServiceSpy.grabberRight.y).toEqual(drawingServiceSpy.dotSize.y / 2);
        expect(drawingServiceSpy.grabberBottom.x).toEqual(drawingServiceSpy.dotSize.x / 2);
        expect(drawingServiceSpy.grabberBottom.y).toEqual(drawingServiceSpy.dotSize.y);
        expect(drawingServiceSpy.copiedCanvas).toEqual(oldCanvas);
    });
});

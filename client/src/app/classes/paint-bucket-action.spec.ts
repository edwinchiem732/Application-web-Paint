import { TestBed } from '@angular/core/testing';
import { IMAGE_DATA_NUMBER } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasTestHelper } from './canvas-test-helper';
import { PaintBucketAction } from './paint-bucket-action';

describe('PaintBucketAction', () => {
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let imageData: ImageData;
    let paintBucketAction: PaintBucketAction;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['baseCtx', 'getImageData']);
        imageData = new ImageData(IMAGE_DATA_NUMBER, IMAGE_DATA_NUMBER);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        paintBucketAction = new PaintBucketAction(drawingServiceSpy, imageData);

        drawingServiceSpy.baseCtx = baseCtxClone;
        drawingServiceSpy.canvas = canvas;
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: PaintBucketAction, useValue: paintBucketAction },
            ],
        });

        paintBucketAction = TestBed.inject(PaintBucketAction);
    });
    it('should create an instance', () => {
        expect(new PaintBucketAction(drawingServiceSpy, imageData)).toBeTruthy();
    });

    it('should apply color to a rectangle', () => {
        const widthRectangle = 100;
        const heightRectangle = 150;
        imageData = drawingServiceSpy.baseCtx.getImageData(0, 0, widthRectangle, heightRectangle);

        paintBucketAction = new PaintBucketAction(drawingServiceSpy, imageData);

        paintBucketAction.applyActions();
    });
});

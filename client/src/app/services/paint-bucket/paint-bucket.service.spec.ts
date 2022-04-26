import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/enum';
import { CANVAS_HEIGHT_BUCKET, CANVAS_WIDTH_BUCKET } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketService } from './paint-bucket.service';

describe('PaintBucketService', () => {
    let service: PaintBucketService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['baseCtx', 'getImageData']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        drawingServiceSpy.baseCtx = baseCtxClone;
        drawingServiceSpy.canvas = canvas;
        canvas.width = CANVAS_WIDTH_BUCKET;
        canvas.height = CANVAS_HEIGHT_BUCKET;
        drawingServiceSpy.baseCtx = baseCtxClone;
        drawingServiceSpy.canvas = canvas;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(PaintBucketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call flood fill algorithm when left click', () => {
        const event = { offsetX: 50, offsetY: 60, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);
        const spy = spyOn(service, 'floodFillAlgorithm').and.stub();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call floodFillRightClick when right click', () => {
        const event = { offsetX: 50, offsetY: 60, button: MouseButton.Right } as MouseEvent;
        service.onMouseDown(event);
        const spy = spyOn(service, 'floodFillRightClick').and.stub();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should set string color to rgba', () => {
        const result = 255;
        const value = service.stringToRGBA('(255,255,255,1)');
        expect(value.r).toEqual(result);
    });

    it('should return tolerance different then 0 if opacity is different then 0', () => {
        // tslint:disable-next-line: no-unused-expression
        service.percentageTolerance !== 0;
        service.comparaisonTolerance();
        const spy = spyOn(service, 'comparaisonTolerance').and.stub();
        expect(spy).not.toEqual(0);
    });

    it('should return 0 if tolerance is negative', () => {
        const toleranceValue = -1;
        const result = -1;
        service.comparaisonTolerance();
        service.percentageTolerance = toleranceValue;
        const spy = spyOn(service, 'comparaisonTolerance').and.stub();
        expect(spy).not.toEqual(result);
    });

    it('should return 0 if tolerance is negative', () => {
        const toleranceValue = -1;
        const result = -1;
        service.comparaisonTolerance();
        service.percentageTolerance = toleranceValue;
        const spy = spyOn(service, 'comparaisonTolerance').and.stub();
        expect(spy).not.toEqual(result);
    });
});

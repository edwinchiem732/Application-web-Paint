import { TestBed } from '@angular/core/testing';
import { MIN_HEIGHT_WIDTH } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeCanvasService } from './resize-canvas.service';

describe('ResizeCanvasService', () => {
    let service: ResizeCanvasService;

    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            grabberBottom: { x: 0, y: 0 },
            grabberRight: { x: 0, y: 0 },
            grabberSide: { x: 0, y: 0 },
            dotSize: { x: 0, y: 0 },
            canvasSize: { x: 0, y: 0 },
        });

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpyObj }],
        }).compileComponents();
        service = TestBed.inject(ResizeCanvasService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' should change x coordinates to the minimun height and width', () => {
        const min = MIN_HEIGHT_WIDTH;
        service.changeToMinHeightWidht('x');
        expect(drawingServiceSpyObj.grabberBottom.x).toEqual(min / 2);
        expect(drawingServiceSpyObj.grabberRight.x).toEqual(min);
        expect(drawingServiceSpyObj.grabberSide.x).toEqual(min);
    });

    it(' should change the y coordinates to the minimum height and width', () => {
        service.changeToMinHeightWidht('y');
        const min = MIN_HEIGHT_WIDTH;
        expect(drawingServiceSpyObj.grabberBottom.y).toEqual(min);
        expect(drawingServiceSpyObj.grabberRight.y).toEqual(min / 2);
        expect(drawingServiceSpyObj.grabberSide.y).toEqual(min);
    });

    it(' should change the height of the dotted canvas to the minimum width (250px)', () => {
        const offsetY = -1000;
        service.resizerDotBottom(offsetY);
        const min = MIN_HEIGHT_WIDTH;
        expect(drawingServiceSpyObj.dotSize.y).toEqual(min);
    });

    it(' should change the width of the dotted canvas to the minimum width (250px)', () => {
        const offsetX = -1000;
        service.resizerDotRight(offsetX);
        const min = MIN_HEIGHT_WIDTH;
        expect(drawingServiceSpyObj.dotSize.x).toEqual(min);
    });

    it(' should change dotted canvas height and width dotSize.x and dotSize.y smaller than minimum width and height', () => {
        const offsetX = -1000;
        const offsetY = -1000;
        service.resizerDot(offsetX, offsetY);
        const min = MIN_HEIGHT_WIDTH;
        expect(drawingServiceSpyObj.dotSize.x).toEqual(min);
        expect(drawingServiceSpyObj.dotSize.y).toEqual(min);
    });

    it(' should change dotted canvas width if dotSize.x is smaller than minimum width', () => {
        const offsetX = 1000;
        const offsetY = -1000;
        service.resizerDot(offsetX, offsetY);
        const min = MIN_HEIGHT_WIDTH;
        expect(drawingServiceSpyObj.dotSize.x).toEqual(min);
    });

    it(' should change dotted canvas height if dotSize.y is smaller than minimum height', () => {
        const offsetX = -1000;
        const offsetY = 1000;
        service.resizerDot(offsetX, offsetY);
        const min = MIN_HEIGHT_WIDTH;
        expect(drawingServiceSpyObj.dotSize.y).toEqual(min);
    });

    it(' should add offsetY to grabber in y axis if dotSize.y is not smaller than 250px', () => {
        const offsetY = 1000;
        const resultBottom = 0 + offsetY;
        const resultRight = 0 + offsetY / 2;
        const resultSide = 0 + offsetY;
        service.resizerDotBottom(offsetY);
        expect(drawingServiceSpyObj.grabberBottom.y).toEqual(resultBottom);
        expect(drawingServiceSpyObj.grabberRight.y).toEqual(resultRight);
        expect(drawingServiceSpyObj.grabberSide.y).toEqual(resultSide);
    });

    it(' should resize the canvas size', () => {
        service.resizer();
        expect(drawingServiceSpyObj.canvasSize.x).toEqual(drawingServiceSpyObj.dotSize.x);
        expect(drawingServiceSpyObj.canvasSize.y).toEqual(drawingServiceSpyObj.dotSize.y);
    });
});

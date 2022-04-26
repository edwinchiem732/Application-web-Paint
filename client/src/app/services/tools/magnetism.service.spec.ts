import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { MagnetismService } from './magnetism.service';

describe('MagnetismService', () => {
    let service: MagnetismService;
    let spyGridService: jasmine.SpyObj<GridService>;

    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'gridCtx', 'clearCanvas', 'drawImage']);
        spyGridService = jasmine.createSpyObj('GridService', ['calculateGrid', 'closestIntersection'], {
            sizeOfGrid: 50,
        });

        canvasTestHelper = new CanvasTestHelper();
        canvas = canvasTestHelper.canvas;

        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: spyGridService }],
        });
        service = TestBed.inject(MagnetismService);

        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.canvas = canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return expected result when magnetismControlPoint is called, case middle', () => {
        const mousePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        const squareDistance = 50;
        const circle = true;
        const isDrawingCircle = true;
        service.middle = true;
        spyGridService.closestIntersection.and.returnValue(mousePosition);
        const position = service.magnetismControlPoint(mousePosition, image, squareDistance, circle, isDrawingCircle);
        const result = { x: 200, y: 200 };
        expect(position).toEqual(result);
    });

    it('should return expected result when magnetismControlPoint is called, case leftUp', () => {
        const mousePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        const squareDistance = 50;
        const circle = true;
        const isDrawingCircle = true;
        service.leftUp = true;
        spyGridService.closestIntersection.and.returnValue(mousePosition);
        const position = service.magnetismControlPoint(mousePosition, image, squareDistance, circle, isDrawingCircle);
        const result = { x: 225, y: 225 };
        expect(position).toEqual(result);
    });

    it('should return expected result when magnetismControlPoint is called, case leftDown', () => {
        const mousePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        const squareDistance = 50;
        const circle = true;
        const isDrawingCircle = true;
        service.leftDown = true;
        spyGridService.closestIntersection.and.returnValue(mousePosition);
        const position = service.magnetismControlPoint(mousePosition, image, squareDistance, circle, isDrawingCircle);
        const result = { x: 225, y: 175 };
        expect(position).toEqual(result);
    });

    it('should return expected result when magnetismControlPoint is called, case rightDown', () => {
        const mousePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        const squareDistance = 50;
        const circle = true;
        const isDrawingCircle = true;
        service.rightDown = true;
        spyGridService.closestIntersection.and.returnValue(mousePosition);
        const position = service.magnetismControlPoint(mousePosition, image, squareDistance, circle, isDrawingCircle);
        const result = { x: 175, y: 175 };
        expect(position).toEqual(result);
    });

    it('should return expected result when magnetismControlPoint is called, case rightUp', () => {
        const mousePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        const squareDistance = 50;
        const circle = true;
        const isDrawingCircle = true;
        service.rightUp = true;
        spyGridService.closestIntersection.and.returnValue(mousePosition);
        const position = service.magnetismControlPoint(mousePosition, image, squareDistance, circle, isDrawingCircle);
        const result = { x: 175, y: 225 };
        expect(position).toEqual(result);
    });

    it('should return expected result when magnetismControlPoint is called, case middleUp', () => {
        const mousePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        const squareDistance = 50;
        const circle = true;
        const isDrawingCircle = true;
        service.middleUp = true;
        spyGridService.closestIntersection.and.returnValue(mousePosition);
        const position = service.magnetismControlPoint(mousePosition, image, squareDistance, circle, isDrawingCircle);
        const result = { x: 200, y: 225 };
        expect(position).toEqual(result);
    });

    it('should return expected result when magnetismControlPoint is called, case middleDown', () => {
        const mousePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        const squareDistance = 50;
        const circle = true;
        const isDrawingCircle = true;
        service.middleDown = true;
        spyGridService.closestIntersection.and.returnValue(mousePosition);
        const position = service.magnetismControlPoint(mousePosition, image, squareDistance, circle, isDrawingCircle);
        const result = { x: 200, y: 175 };
        expect(position).toEqual(result);
    });

    it('should return expected result when magnetismControlPoint is called, case leftMiddle', () => {
        const mousePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        const squareDistance = 50;
        const circle = true;
        const isDrawingCircle = true;
        service.leftMiddle = true;
        spyGridService.closestIntersection.and.returnValue(mousePosition);
        const position = service.magnetismControlPoint(mousePosition, image, squareDistance, circle, isDrawingCircle);
        const result = { x: 225, y: 200 };
        expect(position).toEqual(result);
    });

    it('should return expected result when magnetismControlPoint is called, case rightMiddle', () => {
        const mousePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        const squareDistance = 50;
        const circle = true;
        const isDrawingCircle = true;
        service.rightMiddle = true;
        spyGridService.closestIntersection.and.returnValue(mousePosition);
        const position = service.magnetismControlPoint(mousePosition, image, squareDistance, circle, isDrawingCircle);
        const result = { x: 175, y: 200 };
        expect(position).toEqual(result);
    });

    it('should return expected result when magnetismControlPoint is called, default and when circle is false', () => {
        const mousePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        const squareDistance = 50;
        const circle = false;
        const isDrawingCircle = false;
        spyGridService.closestIntersection.and.returnValue(mousePosition);
        const position = service.magnetismControlPoint(mousePosition, image, squareDistance, circle, isDrawingCircle);
        const result = { x: 200, y: 200 };
        expect(position).toEqual(result);
    });

    it('should return expected value when magnetismArrow is called, case leftUp', () => {
        const imagePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        service.leftUp = true;
        // spyGridService.calculateGrid.and.returnValue({ x: 10, y: 5 });
        spyGridService.closestIntersection.and.returnValue(imagePosition);

        const position = service.magnetismArrow(imagePosition, image);
        const result = { x: 200, y: 200 };
        expect(position).toEqual(result);
    });

    it('should return expected value when magnetismArrow is called, case leftDown', () => {
        const imagePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        service.leftDown = true;
        spyGridService.closestIntersection.and.returnValue(imagePosition);
        const position = service.magnetismArrow(imagePosition, image);
        const result = { x: 200, y: 150 };
        expect(position).toEqual(result);
    });

    it('should return expected value when magnetismArrow is called, case rightDown', () => {
        const imagePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        service.rightDown = true;
        spyGridService.closestIntersection.and.returnValue(imagePosition);
        const position = service.magnetismArrow(imagePosition, image);
        const result = { x: 150, y: 150 };
        expect(position).toEqual(result);
    });

    it('should return expected value when magnetismArrow is called, case rightUp', () => {
        const imagePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        service.rightUp = true;
        spyGridService.closestIntersection.and.returnValue(imagePosition);
        const position = service.magnetismArrow(imagePosition, image);
        const result = { x: 150, y: 200 };
        expect(position).toEqual(result);
    });

    it('should return expected value when magnetismArrow is called, case middleUp', () => {
        const imagePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        service.middleUp = true;
        spyGridService.closestIntersection.and.returnValue(imagePosition);
        const position = service.magnetismArrow(imagePosition, image);
        const result = { x: 175, y: 200 };
        expect(position).toEqual(result);
    });

    it('should return expected value when magnetismArrow is called, case middleDown', () => {
        const imagePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        service.middleDown = true;
        spyGridService.closestIntersection.and.returnValue(imagePosition);
        const position = service.magnetismArrow(imagePosition, image);
        const result = { x: 175, y: 150 };
        expect(position).toEqual(result);
    });

    it('should return expected value when magnetismArrow is called, case leftMiddle', () => {
        const imagePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        service.leftMiddle = true;
        spyGridService.closestIntersection.and.returnValue(imagePosition);
        const position = service.magnetismArrow(imagePosition, image);
        const result = { x: 200, y: 175 };
        expect(position).toEqual(result);
    });

    it('should return expected value when magnetismArrow is called, case rightMiddle', () => {
        const imagePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        service.rightMiddle = true;
        spyGridService.closestIntersection.and.returnValue(imagePosition);
        const position = service.magnetismArrow(imagePosition, image);
        const result = { x: 150, y: 175 };
        expect(position).toEqual(result);
    });

    it('should return expected value when magnetismArrow is called, case middle', () => {
        const imagePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        service.middle = true;
        spyGridService.closestIntersection.and.returnValue(imagePosition);
        const position = service.magnetismArrow(imagePosition, image);
        const result = { x: 175, y: 175 };
        expect(position).toEqual(result);
    });

    it('should return expected value when magnetismArrow is called, default', () => {
        const imagePosition = { x: 200, y: 200 };
        const image = { width: 50, height: 50 } as ImageData;
        spyGridService.closestIntersection.and.returnValue(imagePosition);
        const position = service.magnetismArrow(imagePosition, image);
        const result = { x: 200, y: 200 };
        expect(position).toEqual(result);
    });

    it('initialise, should put all to false', () => {
        service.initialise();
        expect(service.middle).toEqual(false);
        expect(service.leftUp).toEqual(false);
        expect(service.middleUp).toEqual(false);
        expect(service.rightUp).toEqual(false);
        expect(service.leftMiddle).toEqual(false);
        expect(service.leftDown).toEqual(false);
        expect(service.middleDown).toEqual(false);
        expect(service.rightDown).toEqual(false);
        expect(service.rightMiddle).toEqual(false);
    });
});

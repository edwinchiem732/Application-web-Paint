import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from './grid.service';

describe('GridService', () => {
    let service: GridService;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let gridCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    const canvasWidth = 500;
    const canvasHeight = 250;
    const squareSize = 5;
    const mediumSquareSize = 50;
    const bigSquareSize = 125;

    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'gridCtx', 'clearCanvas', 'drawImage']);
        canvasTestHelper = new CanvasTestHelper();
        gridCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingClone }],
        });
        service = TestBed.inject(GridService);
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.gridCtx = gridCtxClone;
        drawingClone.canvas = canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when ngOnInit is called, drawGrid should be called', () => {
        const drawGridSpy = spyOn(service, 'drawGrid');
        service.ngOnInit();
        expect(drawGridSpy).toHaveBeenCalled();
    });

    it('when calculateGrid is called, verifie result', () => {
        drawingClone.canvas.width = canvasWidth;
        drawingClone.canvas.height = canvasHeight;
        service.sizeOfSquares = squareSize;

        const resultPoint = { x: 101, y: 51 } as Vec2;

        expect(service.calculateGrid()).toEqual(resultPoint);
    });

    it('when connectPoints is called, expected canvas functions to have been called', () => {
        const point1 = { x: 30, y: 35 } as Vec2;
        const point2 = { x: 50, y: 50 } as Vec2;

        const beginPathSpy = spyOn(gridCtxClone, 'beginPath');
        const moveToSpy = spyOn(gridCtxClone, 'moveTo');
        const lineToSpy = spyOn(gridCtxClone, 'lineTo');
        const strokeSpy = spyOn(gridCtxClone, 'stroke');

        service.connectPoints(gridCtxClone, point1, point2);

        expect(beginPathSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('when createTableX is called, expected calculateGrid to have been called', () => {
        // const point1 = { x: 30, y: 35 } as Vec2;
        // const point2 = { x: 50, y: 50 } as Vec2;

        const calculateGridSpy = spyOn(service, 'calculateGrid');
        calculateGridSpy.and.returnValue({ x: 0, y: 0 });
        service.createTableX();
        expect(calculateGridSpy).toHaveBeenCalled();
    });

    it('when createTableX is called, expected to return correct table of points for x', () => {
        drawingClone.canvas.width = canvasWidth;
        drawingClone.canvas.height = canvasHeight;
        service.sizeOfSquares = bigSquareSize;

        const resultTable: Vec2[] = [
            { x: 0, y: 0 },
            { x: 0, y: 250 },
            { x: 125, y: 0 },
            { x: 125, y: 250 },
            { x: 250, y: 0 },
            { x: 250, y: 250 },
            { x: 375, y: 0 },
            { x: 375, y: 250 },
            { x: 500, y: 0 },
            { x: 500, y: 250 },
        ];
        expect(service.createTableX()).toEqual(resultTable);
    });

    it('when createTableY is called, expected calculateGrid to have been called', () => {
        const calculateGridSpy = spyOn(service, 'calculateGrid');
        calculateGridSpy.and.returnValue({ x: 0, y: 0 });
        service.createTableY();
        expect(calculateGridSpy).toHaveBeenCalled();
    });

    it('when createTableY is called, expected to return correct table of points for y', () => {
        drawingClone.canvas.width = canvasWidth;
        drawingClone.canvas.height = canvasHeight;
        service.sizeOfSquares = bigSquareSize;

        const resultTable: Vec2[] = [
            { x: 0, y: 0 },
            { x: 500, y: 0 },
            { x: 0, y: 125 },
            { x: 500, y: 125 },
            { x: 0, y: 250 },
            { x: 500, y: 250 },
        ];
        expect(service.createTableY()).toEqual(resultTable);
    });

    it('when generateGridX is called, expected connectPoints to have been called', () => {
        const createTableXSpy = spyOn(service, 'createTableX');
        const calculateGridSpy = spyOn(service, 'calculateGrid');
        calculateGridSpy.and.returnValue({ x: 0, y: 0 });
        service.generateGridOnX();
        expect(createTableXSpy).toHaveBeenCalled();
    });

    it('when generateGridY is called, expected connectPoints to have been called', () => {
        const createTableYSpy = spyOn(service, 'createTableY');
        const calculateGridSpy = spyOn(service, 'calculateGrid');
        calculateGridSpy.and.returnValue({ x: 0, y: 0 });
        service.generateGridOnY();
        expect(createTableYSpy).toHaveBeenCalled();
    });

    it('when drawGrid is called, expected clearCanvas, generateGridX and generateGridY to have been called', () => {
        const generateGridOnXSpy = spyOn(service, 'generateGridOnX');
        const generateGridOnYSpy = spyOn(service, 'generateGridOnY');

        service.gridOn = true;
        service.drawGrid();

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(generateGridOnXSpy).toHaveBeenCalled();
        expect(generateGridOnYSpy).toHaveBeenCalled();
    });

    it('when drawGrid is called, expected clearCanvas to have been called and generateGridX and generateGridY not to have been called', () => {
        const generateGridOnXSpy = spyOn(service, 'generateGridOnX');
        const generateGridOnYSpy = spyOn(service, 'generateGridOnY');

        service.gridOn = false;
        service.drawGrid();

        expect(drawingClone.clearCanvas).toHaveBeenCalled();
        expect(generateGridOnXSpy).not.toHaveBeenCalled();
        expect(generateGridOnYSpy).not.toHaveBeenCalled();
    });

    it('when intersectionPath is called, expected calculateGrid to have been called', () => {
        service.sizeOfSquares = mediumSquareSize;
        const calculateGridSpy = spyOn(service, 'calculateGrid');
        calculateGridSpy.and.returnValue({ x: 0, y: 0 });
        service.intersectionPath();
        expect(calculateGridSpy).toHaveBeenCalled();
    });

    it('when closestIntersection is called, expected intersectionPath to have been called', () => {
        service.sizeOfSquares = mediumSquareSize;
        spyOn(service, 'calculateGrid').and.returnValue({ x: 10, y: 5 });
        expect(service.closestIntersection({ x: 3, y: 3 })).toEqual({ x: 0, y: 0 });
    });
});

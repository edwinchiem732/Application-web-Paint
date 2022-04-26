import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { GridComponent } from './grid.component';

/* tslint:disable:no-string-literal */
describe('GridComponent', () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;
    let spyGridService: jasmine.SpyObj<GridService>;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let gridCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    const squareSize = 50;
    const upperBound = 100;
    const lowerBound = 5;
    const sizeIncrement = 5;

    beforeEach(async(() => {
        spyGridService = jasmine.createSpyObj('GridService', ['drawGrid']);
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'clearCanvas', 'drawImage']);
        TestBed.configureTestingModule({
            declarations: [GridComponent],
            providers: [{ provide: GridService, useValue: spyGridService }],
        }).compileComponents();
        canvasTestHelper = new CanvasTestHelper();
        gridCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.gridCtx = gridCtxClone;
        drawingClone.canvas = canvas;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call drawGrid when window keydown +', () => {
        spyGridService.sizeOfSquares = squareSize;
        const event = { key: '+' } as KeyboardEvent;
        const size = 50;
        component.size = size;
        component['upperBound'] = upperBound;
        component.changeSizeShortcut(event);
        expect(spyGridService.sizeOfSquares).toEqual(size + sizeIncrement);
        expect(spyGridService.drawGrid).toHaveBeenCalled();
    });

    it('should call drawGrid when window keydown -', () => {
        const event = { key: '-' } as KeyboardEvent;
        const size = 50;
        component.size = size;
        component['lowerBound'] = 0;
        component.changeSizeShortcut(event);
        expect(spyGridService.sizeOfSquares).toEqual(size - sizeIncrement);
        expect(spyGridService.drawGrid).toHaveBeenCalled();
    });

    it('should call drawGrid when window keydown =', () => {
        spyGridService.sizeOfSquares = squareSize;
        const event = { key: '=' } as KeyboardEvent;
        const size = 50;
        component.size = size;
        component['upperBound'] = upperBound;
        component.changeSizeShortcut(event);
        expect(spyGridService.sizeOfSquares).toEqual(size + sizeIncrement);
        expect(spyGridService.drawGrid).toHaveBeenCalled();
    });

    it('should not call drawGrid when out of bound when window keydown +', () => {
        spyGridService.sizeOfSquares = squareSize;
        const event = { key: '+' } as KeyboardEvent;
        const size = 105;
        component.size = size;
        component['upperBound'] = upperBound;
        component.changeSizeShortcut(event);
        expect(spyGridService.drawGrid).not.toHaveBeenCalled();
    });

    it('should not call drawGrid when out of bound when window keydown -', () => {
        const event = { key: '-' } as KeyboardEvent;
        const size = 0;
        component.size = size;
        component['lowerBound'] = lowerBound;
        component.changeSizeShortcut(event);
        expect(spyGridService.drawGrid).not.toHaveBeenCalled();
    });

    it('should not call drawGrid when out of bound when window keydown =', () => {
        spyGridService.sizeOfSquares = squareSize;
        const event = { key: '=' } as KeyboardEvent;
        const size = 105;
        component.size = size;
        component['upperBound'] = upperBound;
        component.changeSizeShortcut(event);
        expect(spyGridService.drawGrid).not.toHaveBeenCalled();
    });

    it('should change the opacity of the grid', () => {
        const opacity = 0.1;
        const event = { value: opacity } as MatSliderChange;

        component.gridOpacity(event);
        expect(component.opacity).toEqual(opacity);
        expect(spyGridService.opacityValue).toEqual(opacity);
    });

    it('should change the size of the grid', () => {
        const size = 50;
        const event = { value: size } as MatSliderChange;
        component.gridSize(event);
        expect(component.size).toEqual(size);
        expect(spyGridService.sizeOfSquares).toEqual(size);
    });
});

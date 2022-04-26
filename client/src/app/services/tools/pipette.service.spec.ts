import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/enum';
import { ColorService } from '@app/services/color.service';
// import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PipetteService } from './pipette.service';
// import { PipetteComponent } from '@app/pipette/pipette.component';

describe('PipetteService', () => {
    let service: PipetteService;
    let colorService: jasmine.SpyObj<ColorService>;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'clearCanvas']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        colorService = jasmine.createSpyObj('ColorService', ['addPreviousColorToList', 'getColor'], {});
        TestBed.configureTestingModule({
            providers: [{ provide: ColorService, useValue: colorService }],
        });
        service = TestBed.inject(PipetteService);
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.previewCtx = previewCtxClone;
        drawingClone.canvas = canvas;
        service.drawingService = drawingClone;
        service.drawingService.baseCtx = drawingClone.baseCtx;
        service.drawingService.previewCtx = drawingClone.previewCtx;
        service.drawingService.canvas = drawingClone.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call addPreviousColorToList function when left clicking on mouse', () => {
        const event = { offsetX: 10, offsetY: 10, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);

        expect(colorService.addPreviousColorToList).toHaveBeenCalled();
    });

    it('should call addPreviousColorToList function when right clicking on mouse', () => {
        const event = { offsetX: 10, offsetY: 10, button: MouseButton.Right } as MouseEvent;
        service.onMouseDown(event);

        expect(colorService.addPreviousColorToList).toHaveBeenCalled();
    });

    it('cursorOut should not be true if offset is bigger than the canvas', () => {
        const event = { offsetX: 800, offsetY: 800, button: MouseButton.Left } as MouseEvent;
        service.onMouseMove(event);
        expect(service.cursorOut).not.toBeTruthy();
    });

    it('cursorOut should be false if offset is smaller than the canvas', () => {
        const event = { offsetX: 10, offsetY: 10, button: MouseButton.Left } as MouseEvent;
        service.onMouseMove(event);
        expect(service.cursorOut).not.toBeTruthy();
    });
});

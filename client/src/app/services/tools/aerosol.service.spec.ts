import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/mouse-button';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from './aerosol.service';

/* tslint:disable:no-string-literal */
describe('AerosolService', () => {
    let service: AerosolService;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'clearCanvas', 'drawImage']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingClone }],
        });
        service = TestBed.inject(AerosolService);
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.previewCtx = previewCtxClone;
        drawingClone.canvas = canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseDown should be true onMouseDown and spray should be called ', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const spraySpy = spyOn(service, 'spray').and.stub();
        service.onMouseDown(event);
        expect(service.mouseDown).toBeTrue();
        expect(spraySpy).toHaveBeenCalled();
    });

    it('when mouseDown is called and isClearTimer is true, isClearTimer becomes false  ', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;

        service['isClearTimer'] = true;
        service['mouseDown'] = true;

        service.onMouseDown(event);

        expect(service['isClearTimer']).toBeFalse();
    });

    it('when mouseDown is called and MouseDown is false, mousedown stays true', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.onMouseDown(event);

        expect(service.mouseDown).toBeTrue();
    });

    it('when mouseDown is called and MouseDown is false, mousedown stays true', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Right } as MouseEvent;
        service.onMouseDown(event);

        expect(service.mouseDown).toBeFalse();
    });

    it('when mouseMouve is called and MouseDown is true, getMousePosition gets called', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Right } as MouseEvent;
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.stub();
        service.mouseDown = true;
        service.onMouseMove(event);

        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('when mouseMove is called and MouseDown is false, mouseDown stays false', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Right } as MouseEvent;
        service.mouseDown = false;
        service.onMouseMove(event);

        expect(service.mouseDown).toBeFalse();
    });

    it(' when onMouseUp and mouseDown is true, mouseDown and sprayOn false, isClearTimer should be true and DrawImage should be called', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;

        drawingClone.canvas = document.createElement('canvas');
        drawingClone.baseCtx = drawingClone.canvas.getContext('2d') as CanvasRenderingContext2D;

        drawingClone.previewCanvas = document.createElement('canvas');
        drawingClone.previewCtx = drawingClone.previewCanvas.getContext('2d') as CanvasRenderingContext2D;
        const drawImageSpy = spyOn(drawingClone.baseCtx, 'drawImage');

        service.mouseDown = true;
        service.onMouseUp(event);

        expect(service.mouseDown).toBeFalse();
        expect(service.sprayOn).toBeFalse();
        expect(service['isClearTimer']).toBeTrue();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('onMouseUp, when mouseDown is false, mouseDown and sprayOn true, isClearTimer should be false and DrawImage not should be called', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;

        drawingClone.canvas = document.createElement('canvas');
        drawingClone.baseCtx = drawingClone.canvas.getContext('2d') as CanvasRenderingContext2D;

        drawingClone.previewCanvas = document.createElement('canvas');
        drawingClone.previewCtx = drawingClone.previewCanvas.getContext('2d') as CanvasRenderingContext2D;

        const drawImageSpy = spyOn(drawingClone.baseCtx, 'drawImage');
        service.sprayOn = true;
        service['isClearTimer'] = false;
        service.mouseDown = false;
        service.onMouseUp(event);

        expect(service.mouseDown).toBeFalse();
        expect(service.sprayOn).toBeTrue();
        expect(service['isClearTimer']).toBeFalse();
        expect(drawImageSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp not should call drawImage if mouseDown is false', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const drawImageSpy = jasmine.createSpy('drawImage');

        service.mouseDown = false;
        service.onMouseUp(event);

        expect(drawImageSpy).not.toHaveBeenCalled();
    });

    it('mouseMove should call getPositionFromMouse  when mouseDown is true', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.stub();
        service.mouseDown = true;
        service.onMouseMove(event);

        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('mouseOut should call spray', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        const spraySpy = spyOn(service, 'spray').and.stub();
        service.onMouseOut(event);

        expect(spraySpy).toHaveBeenCalled();
    });

    it('spray should call randomDroplets when sprayOn is true', () => {
        const sprayOn = true;

        const randomDropletsSpy = spyOn(service, 'randomDroplets').and.returnValue({ x: 1, y: 1 });
        service.spray(drawingClone.baseCtx, sprayOn);

        expect(randomDropletsSpy).toHaveBeenCalled();
    });

    it('spray should not call randomDroplets when sprayOn is false', () => {
        const sprayOn = false;

        const randomDropletsSpy = spyOn(service, 'randomDroplets').and.returnValue({ x: 1, y: 1 });
        service.spray(drawingClone.baseCtx, sprayOn);

        expect(randomDropletsSpy).not.toHaveBeenCalled();
    });

    it('reSpray should call randomDroplets', () => {
        const path: Vec2[] = [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 5, y: 6 },
            { x: 11, y: 12 },
        ];

        const randomDropletsSpy = spyOn(service, 'randomDroplets').and.returnValue({ x: 1, y: 1 });
        service.reSpray(drawingClone.baseCtx, path);

        expect(randomDropletsSpy).toHaveBeenCalled();
    });
});

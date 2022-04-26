import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserComponent } from './eraser.component';

describe('EraserComponent', () => {
    let component: EraserComponent;
    let fixture: ComponentFixture<EraserComponent>;
    let spyOnDrawing: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(async(() => {
        spyOnDrawing = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'cursorImage', 'clearCanvas', 'checkEmptyCanvas']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        spyOnDrawing.eraserCtx = previewCtxClone;
        spyOnDrawing.previewCtx = previewCtxClone;
        spyOnDrawing.baseCtx = baseCtxClone;
        spyOnDrawing.canvas = canvas;

        TestBed.configureTestingModule({
            declarations: [EraserComponent],
            providers: [{ provide: DrawingService, useValue: spyOnDrawing }],
        }).compileComponents();

        spyOnDrawing = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EraserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the width of the eraser', () => {
        const width = 10;
        const event = { value: width } as MatSliderChange;
        component.changeEraserSize(event);
        expect(component.widthEraser).toEqual(width);
        expect(component.eraserService.eraserWidth).toEqual(width);
        expect(component.drawingService.eraserCtx.canvas.height).toEqual(width);
        expect(component.drawingService.eraserCtx.canvas.width).toEqual(width);
    });
});

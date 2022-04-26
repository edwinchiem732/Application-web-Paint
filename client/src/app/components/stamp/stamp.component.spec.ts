/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { STAMP } from '@app/classes/stamp';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampComponent } from './stamp.component';

describe('StampComponent', () => {
    let component: StampComponent;
    let fixture: ComponentFixture<StampComponent>;
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

        spyOnDrawing.secondCtx = previewCtxClone;
        spyOnDrawing.previewCtx = previewCtxClone;
        spyOnDrawing.baseCtx = baseCtxClone;
        spyOnDrawing.canvas = canvas;

        TestBed.configureTestingModule({
            declarations: [StampComponent],
            providers: [{ provide: DrawingService, useValue: spyOnDrawing }],
        }).compileComponents();

        spyOnDrawing = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StampComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the width of the stamp', () => {
        const width = 10;
        const height = 10;
        const event = { value: width } as MatSliderChange;
        component.changeStampSize(event);
        expect(previewCtxClone.canvas.width).toEqual(width);
        expect(previewCtxClone.canvas.height).toEqual(height);
        expect(component.drawingService.secondCtx.canvas.height).toEqual(width);
        expect(component.drawingService.secondCtx.canvas.width).toEqual(width);
    });

    it('should change the angle of the stamp', () => {
        const angle = 15;
        const event = { value: angle } as MatSliderChange;
        component.changeStampAngle(event);
        expect(component.stampService.angle).toEqual(angle);
    });

    it('should choose stamp1', () => {
        const stampChoice = 'stamp1';
        const event = { value: stampChoice } as MatSelectChange;
        component.changeStampImage(event);
        expect(component.stampService.currentStampName).toEqual(STAMP.stamp1);
    });

    it('should choose stamp2', () => {
        const stampChoice = 'stamp2';
        const event = { value: stampChoice } as MatSelectChange;
        component.changeStampImage(event);
        expect(component.stampService.currentStampName).toEqual(STAMP.stamp2);
    });

    it('should choose stamp3', () => {
        const stampChoice = 'stamp3';
        const event = { value: stampChoice } as MatSelectChange;
        component.changeStampImage(event);
        expect(component.stampService.currentStampName).toEqual(STAMP.stamp3);
    });

    it('should choose stamp4', () => {
        const stampChoice = 'stamp4';
        const event = { value: stampChoice } as MatSelectChange;
        component.changeStampImage(event);
        expect(component.stampService.currentStampName).toEqual(STAMP.stamp4);
    });

    it('should choose stamp5', () => {
        const stampChoice = 'stamp5';
        const event = { value: stampChoice } as MatSelectChange;
        component.changeStampImage(event);
        expect(component.stampService.currentStampName).toEqual(STAMP.stamp5);
    });
});

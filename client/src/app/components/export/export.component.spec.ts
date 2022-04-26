import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportComponent } from './export.component';

describe('ExportComponent', () => {
    let component: ExportComponent;
    let fixture: ComponentFixture<ExportComponent>;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    const dialogMock = { close: () => ({}) };

    beforeEach(async(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'clearCanvas', 'drawImage']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        TestBed.configureTestingModule({
            declarations: [ExportComponent],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: dialogMock,
                },
                { provide: DrawingService, useValue: drawingClone },
            ],
        }).compileComponents();
        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.previewCtx = previewCtxClone;
        drawingClone.canvas = canvas;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should apply "none" filter when user choses that filter', () => {
        const filter = 'none';
        const event = { value: filter } as MatRadioChange;
        // component.draw(event.value);
        const spy = spyOn(component, 'draw').and.callThrough();
        component.filterToApply(event);
        expect(component.filter).toEqual(filter);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply "blur" filter when user choses that filter', () => {
        const filter = 'blur(4px)';
        const event = { value: filter } as MatRadioChange;
        // component.draw(event.value);
        const spy = spyOn(component, 'draw').and.callThrough();
        component.filterToApply(event);
        expect(component.filter).toEqual(filter);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply "contrast" filter when user choses that filter', () => {
        const filter = 'contrast(1.4) sepia(1) drop-shadow(-9px 9px 3px #e81)';
        const event = { value: filter } as MatRadioChange;
        // component.draw(event.value);
        const spy = spyOn(component, 'draw').and.callThrough();
        component.filterToApply(event);
        expect(component.filter).toEqual(filter);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply "sepia" filter when user choses that filter', () => {
        const filter = 'sepia(60%)';
        const event = { value: filter } as MatRadioChange;
        // component.draw(event.value);
        const spy = spyOn(component, 'draw').and.callThrough();
        component.filterToApply(event);
        expect(component.filter).toEqual(filter);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply "grayscale" filter when user choses that filter', () => {
        const filter = 'grayscale(100%)';
        const event = { value: filter } as MatRadioChange;
        // component.draw(event.value);
        const spy = spyOn(component, 'draw').and.callThrough();
        component.filterToApply(event);
        expect(component.filter).toEqual(filter);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply "hue-rotate" filter when user choses that filter', () => {
        const filter = 'hue-rotate(90deg) drop-shadow(9px 2px 6px #e81)';
        const event = { value: filter } as MatRadioChange;
        // component.draw(event.value);
        const spy = spyOn(component, 'draw').and.callThrough();
        component.filterToApply(event);
        expect(component.filter).toEqual(filter);
        expect(spy).toHaveBeenCalled();
    });

    it('should apply "png" format when user choses that format', () => {
        const format = 'png';
        component.modes[0] = 'png';
        const event = { value: format } as MatRadioChange;
        component.chooseExportMode(event);
        // tslint:disable:no-string-literal
        expect(component['modeExport']).toEqual(format);
    });

    it('should apply "jpeg" format when user choses that format', () => {
        const format = 'jpeg';
        const event = { value: format } as MatRadioChange;
        component.chooseExportMode(event);
        // tslint:disable:no-string-literal
        expect(component['modeExport']).toEqual(format);
    });

    it('should export in "png" format', () => {
        // tslint:disable:no-string-literal
        component['modeExport'] = 'png';
        const spy = spyOn(component, 'exportDraw');
        component.exportImage();
        expect(spy).toHaveBeenCalled();
    });

    it('should export in "jpeg" format', () => {
        // tslint:disable:no-string-literal
        component['modeExport'] = 'jpeg';
        const spy = spyOn(component, 'exportDraw');
        component.exportImage();
        expect(spy).toHaveBeenCalled();
    });

    it('should export in "no" format', () => {
        // tslint:disable:no-string-literal
        component['modeExport'] = '';
        const spy = spyOn(component, 'exportDraw');
        component.exportImage();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should upload in "png" format', () => {
        // tslint:disable:no-string-literal
        component['modeExport'] = 'png';
        const spy = spyOn(component, 'apiImgur');
        component.uploadImgur();
        expect(spy).toHaveBeenCalled();
    });

    it('should upload in "jpeg" format', () => {
        // tslint:disable:no-string-literal
        component['modeExport'] = 'jpeg';
        const spy = spyOn(component, 'apiImgur');
        component.uploadImgur();
        expect(spy).toHaveBeenCalled();
    });

    it('should upload in "no" format', () => {
        // tslint:disable:no-string-literal
        component['modeExport'] = '';
        const spy = spyOn(component, 'apiImgur');
        component.uploadImgur();
        expect(spy).toHaveBeenCalled();
    });

    it('when exportDraw is called, call cancel', () => {
        const cancelSpy = spyOn(component, 'cancel');
        spyOn(window, 'confirm').and.returnValue(true);

        component.exportDraw('', '');
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('when exportDraw is called and confirm false, dont call cancel ', () => {
        const cancelSpy = spyOn(component, 'cancel');
        spyOn(window, 'confirm').and.returnValue(false);

        component.exportDraw('', '');
        expect(cancelSpy).not.toHaveBeenCalled();
    });

    it('when cancel is called, dialog.close should be called ', () => {
        const closeSpy = spyOn(dialogMock, 'close');
        component.cancel();
        expect(closeSpy).toHaveBeenCalled();
    });
});

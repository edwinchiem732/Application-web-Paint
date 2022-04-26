import { TestBed } from '@angular/core/testing';
import { cursorOptions } from '@app/classes/cursor-options';
import { ToolOptions } from '@app/classes/tool';
import { SwitchToolsService } from './switch-tools.service';

// tslint:disable:no-any

describe('SwitchToolsService', () => {
    let service: SwitchToolsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SwitchToolsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set an image to cursorImage and switch the tool service ', () => {
        const randomString = 'unknown string';
        service.switchToolButtons(randomString, ToolOptions.Crayon);
        expect(service.currentName).toEqual(ToolOptions.Crayon);
        expect(service.drawingService.cursorImage).toEqual(randomString);
    });

    it('should set the the cursor image to crayon and switch the tool service to PencilService ', () => {
        const spy = spyOn(service, 'switchToolButtons').and.callThrough();
        service.pencilButton();
        expect(spy).toHaveBeenCalled();
        expect(service.drawingService.cursorImage).toEqual(cursorOptions.crayon);
        expect(service.currentName).toEqual(ToolOptions.Crayon);
    });

    it('should set the the cursor image to efface and switch the tool service to EraserService ', () => {
        const spy = spyOn(service, 'switchToolButtons').and.callThrough();
        service.eraserButton();
        expect(spy).toHaveBeenCalled();
        expect(service.drawingService.cursorImage).toEqual(cursorOptions.efface);
        expect(service.currentName).toEqual(ToolOptions.Efface);
    });

    it('should set the the cursor image to test and switch the tool service to RectangleService ', () => {
        const spy = spyOn(service, 'switchToolButtons').and.callThrough();
        service.rectangleButton();
        expect(spy).toHaveBeenCalled();
        expect(service.drawingService.cursorImage).toEqual(cursorOptions.test);
        expect(service.currentName).toEqual(ToolOptions.Rectangle);
    });

    it('should set the the cursor image to test and switch the tool service to EllipseService ', () => {
        const spy = spyOn(service, 'switchToolButtons').and.callThrough();
        service.ellipseButton();
        expect(spy).toHaveBeenCalled();
        expect(service.drawingService.cursorImage).toEqual(cursorOptions.test);
        expect(service.currentName).toEqual(ToolOptions.Ellipse);
    });

    it('should set the the cursor image to base and switch the tool service to LineService ', () => {
        const spy = spyOn(service, 'switchToolButtons').and.callThrough();
        service.lineButton();
        expect(spy).toHaveBeenCalled();
        expect(service.drawingService.cursorImage).toEqual(cursorOptions.test);
        expect(service.currentName).toEqual(ToolOptions.Line);
    });

    it('should set the the cursor image to base and switch the tool service to PaintBucketService ', () => {
        const spy = spyOn(service, 'switchToolButtons').and.callThrough();
        service.paintBucketButton();
        expect(spy).toHaveBeenCalled();
        expect(service.drawingService.cursorImage).toEqual(cursorOptions.test);
        expect(service.currentName).toEqual(ToolOptions.PaintBucket);
    });
});

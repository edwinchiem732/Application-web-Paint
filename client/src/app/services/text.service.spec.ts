import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/classes/enum';
import {
    BREAK_LINE_LARGE,
    BREAK_LINE_MEDIUM,
    BREAK_LINE_SMALL,
    DEFAULT_INPUT_HEIGHT,
    DEFAULT_INPUT_WIDTH,
    LARGE_FONT_SIZE_TEST,
    MEDIUM_FONT_SIZE_TEST,
    SMALL_FONT_SIZE_TEST,
} from '@app/constant/constants';
import { ColorService } from './color.service';
import { DrawingService } from './drawing/drawing.service';
import { TextService } from './text.service';

describe('TextService', () => {
    let service: TextService;
    let baseCtxClone: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    let drawingClone: jasmine.SpyObj<DrawingService>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        drawingClone = jasmine.createSpyObj('DrawingService', ['baseCtx']);
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        colorServiceSpyObj = jasmine.createSpyObj('ColorService', [], {
            primaryColor: 'rgba(1,1,1,1)',
        });

        TestBed.configureTestingModule({});
        service = TestBed.inject(TextService);

        drawingClone = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        drawingClone.baseCtx = baseCtxClone;
        drawingClone.canvas = canvas;

        service.input = {
            style: { fontFamily: 'initialFont', left: '50px', top: '50px' },
            value: 'test',
        } as HTMLInputElement;

        service.lines = {
            length: 5,
        } as string[];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' should set the initials input properties', () => {
        const fontFamily = 'Arial';
        service.initPosition = { x: 500, y: 500 };
        const result = '500px';
        service.initialInputStyle();
        expect(service.input.style.display).toEqual('block');
        expect(service.input.style.left).toEqual(result);
        expect(service.input.style.top).toEqual(result);
        expect(service.input.style.width).toEqual(DEFAULT_INPUT_WIDTH);
        expect(service.input.style.height).toEqual(DEFAULT_INPUT_HEIGHT);
        expect(service.input.style.fontFamily).toEqual(fontFamily);
        expect(service.input.style.color).toEqual(colorServiceSpyObj.primaryColor);
    });

    it(' should apply the text depending on user choice of alignement', () => {
        const measureTextSpy = spyOn(baseCtxClone, 'measureText').and.callThrough();
        service.applyText();
        expect(measureTextSpy).toHaveBeenCalled();
    });

    it(' should apply the text depending on user choice of alignement, font size small', () => {
        service.fontSize = SMALL_FONT_SIZE_TEST;
        const measureTextSpy = spyOn(baseCtxClone, 'measureText').and.callThrough();
        service.applyText();
        expect(measureTextSpy).toHaveBeenCalled();
        expect(service.breakLineHeight).toEqual(BREAK_LINE_SMALL);
    });

    it(' should apply the text depending on user choice of alignement, font size medium', () => {
        service.fontSize = MEDIUM_FONT_SIZE_TEST;
        const measureTextSpy = spyOn(baseCtxClone, 'measureText').and.callThrough();
        service.applyText();
        expect(measureTextSpy).toHaveBeenCalled();
        expect(service.breakLineHeight).toEqual(BREAK_LINE_MEDIUM);
    });

    it(' should apply the text depending on user choice of alignement, font size large', () => {
        service.fontSize = LARGE_FONT_SIZE_TEST;
        const measureTextSpy = spyOn(baseCtxClone, 'measureText').and.callThrough();
        service.applyText();
        expect(measureTextSpy).toHaveBeenCalled();
        expect(service.breakLineHeight).toEqual(BREAK_LINE_LARGE);
    });

    it('should cancel text when user click on escape key', () => {
        const escapeEvent = { key: 'escape' } as KeyboardEvent;
        service.onEscape(escapeEvent);
        expect(service.input.style.display).toEqual('none');
        expect(service.input.value).toEqual('');
        expect(service.disableShortcut).toEqual(false);
    });

    it('should set the alignements to left', () => {
        service.allignLeft();
        expect(service.input.style.textAlign).toEqual('left');
        expect(service.isAlignLeft).toEqual(true);
        expect(service.isAlignCenter).toEqual(false);
        expect(service.isAlignRight).toEqual(false);
    });

    it('should set the alignements to center', () => {
        service.allignCenter();
        expect(service.input.style.textAlign).toEqual('center');
        expect(service.isAlignCenter).toEqual(true);
        expect(service.isAlignLeft).toEqual(false);
        expect(service.isAlignRight).toEqual(false);
        expect(service.defaultAlign).toEqual(false);
    });

    it('should set the alignements to right', () => {
        service.allignRight();
        expect(service.input.style.textAlign).toEqual('right');
        expect(service.isAlignRight).toEqual(true);
        expect(service.isAlignLeft).toEqual(false);
        expect(service.isAlignCenter).toEqual(false);
        expect(service.defaultAlign).toEqual(false);
    });

    it('should set isBold to true when user wants Bold ', () => {
        service.isBold = false;
        service.applyBold();
        expect(service.isBold).toEqual(true);
    });

    it('should set isBold to false when user does not want Bold', () => {
        service.isBold = true;
        service.applyBold();
        expect(service.isBold).toEqual(false);
    });

    it('should set isItalic to true when user wants Italic ', () => {
        service.isItalic = false;
        service.applyItalic();
        expect(service.isItalic).toEqual(true);
    });

    it('should set isItalic to false when user does not want Italic', () => {
        service.isItalic = true;
        service.applyItalic();
        expect(service.isItalic).toEqual(false);
    });

    it('onMouseDown, enter if', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.initPos = false;
        service.input.style.display = 'block';
        const initialInputStyleSpy = spyOn(service, 'initialInputStyle');
        service.onMouseDown(event);
        expect(service.mouseDown).toBeTrue();
        expect(service.initPosition).toEqual(service.mousePosition);
        expect(service.initPos).toBeTrue();
        expect(initialInputStyleSpy).toHaveBeenCalled();
        expect(service.disableShortcut).toBeTrue();
    });

    it('onMouseDown, doesnt enter if', () => {
        const event = { offsetX: 5, offsetY: 6, button: MouseButton.Left } as MouseEvent;
        service.initPos = true;
        service.input.style.display = 'block';
        const initialInputStyleSpy = spyOn(service, 'initialInputStyle');
        service.onMouseDown(event);
        expect(service.mouseDown).toBeTrue();
        expect(service.initPosition).not.toEqual(service.mousePosition);
        expect(service.initPos).toBeTrue();
        expect(initialInputStyleSpy).toHaveBeenCalled();
        expect(service.disableShortcut).toBeTrue();
    });

    it('should call fillTextBaseCtx for left align', () => {
        service.isAlignLeft = true;
        service.defaultAlign = true;
        const fillTextSpy = spyOn(baseCtxClone, 'fillText');
        service.fillTextBaseCtx();
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it('should call fillTextBaseCtx and measureText for center align', () => {
        service.isAlignLeft = false;
        service.defaultAlign = false;
        service.isAlignCenter = true;
        const fillTextSpy = spyOn(baseCtxClone, 'fillText');
        const measureTextSpy = spyOn(baseCtxClone, 'measureText').and.callThrough();
        service.applyText();
        service.fillTextBaseCtx();
        expect(fillTextSpy).toHaveBeenCalled();
        expect(measureTextSpy).toHaveBeenCalled();
    });

    it('should call fillTextBaseCtx and measureText for right align', () => {
        service.isAlignLeft = false;
        service.defaultAlign = false;
        service.isAlignCenter = false;
        service.isAlignRight = true;
        const fillTextSpy = spyOn(baseCtxClone, 'fillText');
        const measureTextSpy = spyOn(baseCtxClone, 'measureText').and.callThrough();
        service.applyText();
        service.fillTextBaseCtx();
        expect(fillTextSpy).toHaveBeenCalled();
        expect(measureTextSpy).toHaveBeenCalled();
    });

    // it('should call applyText, on mouse down if user click outside of box', () => {
    //     const event = { offsetX: 0, offsetY: 0, button: MouseButton.Left } as MouseEvent;
    //     service.initPos = true;
    //     service.mousePosition = { x: 0, y: 0 };
    //     service.initPosition = { x: 50, y: 50 };
    //     const applyTextSpy = spyOn(service, 'applyText');
    //     service.onMouseDown(event);
    //     expect(applyTextSpy).toHaveBeenCalled();
    // });
});

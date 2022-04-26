import { TestBed } from '@angular/core/testing';
import { BREAK_LINE_SMALL, FONT_SIZE_SMALL } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from '@app/services/text.service';
import { TextAction } from './text-action';
import { Vec2 } from './vec2';

describe('TextAction', () => {
    let textActionStub: TextAction;
    let textServiceSpy: jasmine.SpyObj<TextService>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let color: string;
    let linesArray: string[];
    let fontSizeStub: number;
    let fontFamilyStub: string;
    let isBoldStub: boolean;
    let isItalicStub: boolean;
    let breakLineHeightStub: number;
    let position: Vec2;
    let isAlignCenterStub: boolean;
    let isAlignLeftStub: boolean;
    let isAlignRightStub: boolean;
    let defaultAllignStub: boolean;
    let textWidthStub: number;
    let inputStub: HTMLInputElement;

    beforeEach(() => {
        isBoldStub = true;
        isItalicStub = false;
        fontSizeStub = FONT_SIZE_SMALL;
        fontFamilyStub = 'Arial';
        breakLineHeightStub = BREAK_LINE_SMALL;
        position = { x: 170, y: 248 };
        inputStub = {
            style: { fontWeight: 'bold', fontStyle: 'normal' },
            value: 'hello world!',
        } as HTMLInputElement;
        linesArray = ['hello world!'];
        isAlignCenterStub = false;
        isAlignLeftStub = true;
        isAlignRightStub = false;
        defaultAllignStub = true;
        textWidthStub = linesArray.length;
        color = '#FFFFFF';

        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['baseCtx']);

        textServiceSpy = jasmine.createSpyObj('TextService', ['fillTextBaseCtx'], {
            fontSize: fontSizeStub,
            fontFamily: fontFamilyStub,
            input: inputStub,
            isBold: isBoldStub,
            isItalic: isItalicStub,
            breakLineHeight: breakLineHeightStub,
            initPosition: position,
            modifiedPositionY: position.y,
            isAlignCenter: isAlignCenterStub,
            isAlignLeft: isAlignLeftStub,
            isAlignRight: isAlignRightStub,
            defaultAlign: defaultAllignStub,
            textWidth: textWidthStub,
            lines: linesArray,
        });

        textActionStub = new TextAction(
            textServiceSpy,
            drawingServiceSpy,
            color,
            linesArray,
            fontSizeStub,
            fontFamilyStub,
            isBoldStub,
            isItalicStub,
            breakLineHeightStub,
            position,
            isAlignCenterStub,
            isAlignLeftStub,
            isAlignRightStub,
            defaultAllignStub,
            textWidthStub,
            inputStub,
        );

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: TextAction, useValue: textActionStub },
                { provide: TextService, useValue: textServiceSpy },
            ],
        });

        textServiceSpy = TestBed.inject(TextService) as jasmine.SpyObj<TextService>;
        textActionStub = TestBed.inject(TextAction);
    });

    it('should create an instance', () => {
        expect(
            new TextAction(
                textServiceSpy,
                drawingServiceSpy,
                color,
                linesArray,
                fontSizeStub,
                fontFamilyStub,
                isBoldStub,
                isItalicStub,
                breakLineHeightStub,
                position,
                isAlignCenterStub,
                isAlignLeftStub,
                isAlignRightStub,
                defaultAllignStub,
                textWidthStub,
                inputStub,
            ),
        ).toBeTruthy();
    });

    it('should apply actions when a text is written on the canvas', () => {
        textServiceSpy.textWidth = textWidthStub;
        drawingServiceSpy.baseCtx.fillStyle = color;
        textServiceSpy.lines = linesArray;
        textServiceSpy.fontSize = fontSizeStub;
        textServiceSpy.fontFamily = fontFamilyStub;
        textServiceSpy.input.style.fontWeight = inputStub.style.fontWeight;
        textServiceSpy.input.style.fontStyle = inputStub.style.fontStyle;
        textServiceSpy.isBold = isBoldStub;
        textServiceSpy.isItalic = isItalicStub;
        textServiceSpy.breakLineHeight = breakLineHeightStub;
        textServiceSpy.initPosition.x = position.x;
        textServiceSpy.modifiedPositionY = position.y;
        textServiceSpy.isAlignCenter = isAlignCenterStub;
        textServiceSpy.isAlignLeft = isAlignLeftStub;
        textServiceSpy.isAlignRight = isAlignRightStub;
        textServiceSpy.defaultAlign = defaultAllignStub;
        textServiceSpy.input = inputStub;
        textServiceSpy.textWidth = textWidthStub;

        const font =
            textServiceSpy.input.style.fontStyle +
            ' ' +
            textServiceSpy.input.style.fontWeight +
            ' ' +
            textServiceSpy.fontSize +
            'px' +
            ' ' +
            textServiceSpy.fontFamily;

        drawingServiceSpy.baseCtx.font = font;

        textActionStub.applyActions();

        expect(textServiceSpy.fillTextBaseCtx).toHaveBeenCalled();
        expect(textServiceSpy.textWidth).toEqual(textWidthStub);
        expect(drawingServiceSpy.baseCtx.fillStyle).toEqual(color);
        expect(textServiceSpy.lines).toEqual(linesArray);
        expect(textServiceSpy.fontSize).toEqual(fontSizeStub);
        expect(textServiceSpy.fontFamily).toEqual(fontFamilyStub);
        expect(textServiceSpy.input.style.fontWeight).toEqual(inputStub.style.fontWeight);
        expect(textServiceSpy.input.style.fontStyle).toEqual(inputStub.style.fontStyle);
        expect(textServiceSpy.isBold).toEqual(isBoldStub);
        expect(textServiceSpy.isItalic).toEqual(isItalicStub);
        expect(textServiceSpy.breakLineHeight).toEqual(breakLineHeightStub);
        expect(textServiceSpy.initPosition.x).toEqual(position.x);
        expect(textServiceSpy.modifiedPositionY).toEqual(position.y);
        expect(textServiceSpy.isAlignCenter).toEqual(isAlignCenterStub);
        expect(textServiceSpy.isAlignLeft).toEqual(isAlignLeftStub);
        expect(textServiceSpy.isAlignRight).toEqual(isAlignRightStub);
        expect(textServiceSpy.defaultAlign).toEqual(defaultAllignStub);
        expect(textServiceSpy.input).toEqual(inputStub);
        expect(textServiceSpy.textWidth).toEqual(textWidthStub);
        expect(drawingServiceSpy.baseCtx.font).toEqual(font);
    });
});

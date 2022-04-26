import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { FONT_SIZE_TEST, POSITION_TEST } from '@app/constant/constants';
import { TextService } from '@app/services/text.service';
import { TextComponent } from './text.component';

describe('TextComponent', () => {
    let component: TextComponent;
    let fixture: ComponentFixture<TextComponent>;
    let textServiceSpyObj: jasmine.SpyObj<TextService>;

    // tslint:disable-next-line: prefer-const
    let buttonBoldStub: HTMLButtonElement;
    // tslint:disable-next-line: prefer-const
    let buttonItalicStub: HTMLButtonElement;
    let inputStub: HTMLInputElement;
    // tslint:disable-next-line: prefer-const
    let fontFamilyStub: string;
    let fontSizeStub: number;
    let positionStub: number;

    let enterEvent: KeyboardEvent;
    let arrowRightEvent: KeyboardEvent;

    beforeEach(async(() => {
        inputStub = {
            style: { fontFamily: 'initialFont' },
            value: 'test',
        } as HTMLInputElement;

        fontSizeStub = FONT_SIZE_TEST;

        textServiceSpyObj = jasmine.createSpyObj('TextService', ['setSelectionRange', 'input'], {
            buttonBold: buttonBoldStub,
            buttonItalic: buttonItalicStub,
            input: inputStub,
            fontFamily: fontFamilyStub,
            fontSize: fontSizeStub,
            cursorPosition: positionStub,
            counterLeft: 1,
            counterRight: 1,
        });

        TestBed.configureTestingModule({
            declarations: [TextComponent],
            providers: [{ provide: TextService, useValue: textServiceSpyObj }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        enterEvent = new KeyboardEvent('keydown', {
            key: 'enter',
        });

        arrowRightEvent = new KeyboardEvent('keydown', {
            key: 'arrowRight',
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the font family of the text', () => {
        const family = component.defaultStyleFamily;
        const event = { value: family } as MatSelectChange;
        component.changeFontStyle(event);
        expect(textServiceSpyObj.input.style.fontFamily).toEqual(family);
    });

    it('should change the font size of the text', () => {
        // component['textService'] = ({ fontsize: 1, input: inputStub } as unknown) as TextService;
        const size = 12;
        const event = { value: 12 } as MatSliderChange;
        component.changeFontSize(event);
        expect(component.fontSize).toEqual(size);
        // expect(component.textServiceSpy.fontSize).toEqual(size);
        expect(textServiceSpyObj.fontSize).toEqual(size);
    });

    it('should add break line when user press enter key', () => {
        const result = 'test\n';
        component.breakLine(enterEvent);
        expect(textServiceSpyObj.input.value).toEqual(result);
    });

    it('should not move cursor position to the right if cursorPosition is bigger than value length', () => {
        positionStub = POSITION_TEST;
        component.moveRight(arrowRightEvent);
        expect(textServiceSpyObj.counterLeft).toEqual(1);
    });
});

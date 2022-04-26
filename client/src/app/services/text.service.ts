import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { TextAction } from '@app/classes/text-action';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import {
    BREAK_LINE_LARGE,
    BREAK_LINE_MEDIUM,
    BREAK_LINE_SMALL,
    DEFAULT_INPUT_HEIGHT,
    DEFAULT_INPUT_WIDTH,
    FONT_SIZE_MEDIUM,
    FONT_SIZE_SMALL,
} from '@app/constant/constants';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    fontFamily: string = 'Arial';
    fontSize: number = 12;
    input: HTMLInputElement;
    disableShortcut: boolean = false;
    buttonBold: HTMLButtonElement;
    buttonItalic: HTMLButtonElement;
    isBold: boolean = false;
    isItalic: boolean = false;
    isAlignLeft: boolean = false;
    isAlignCenter: boolean = false;
    isAlignRight: boolean = false;
    defaultAlign: boolean = true;
    mousePosition: Vec2 = { x: 0, y: 0 };
    initPosition: Vec2 = { x: 0, y: 0 };
    initPos: boolean = false;
    modifiedPositionY: number;
    textWidth: number;
    cursorPosition: number;
    counterLeft: number = 1;
    counterRight: number = 1;
    lines: string[];
    breakLineHeight: number;
    widthOfEachLine: number[] = [];
    private textAction: TextAction;

    constructor(public drawingService: DrawingService, public colorService: ColorService, public undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mousePosition = this.getPositionFromMouse(event);
            if (!this.initPos) {
                this.initPosition.x = this.mousePosition.x;
                this.initPosition.y = this.mousePosition.y;
                this.initPos = true;
            }
            this.initialInputStyle();
            this.modifiedPositionY = this.initPosition.y + (parseInt(this.input.style.height, 10) + this.initPosition.y - this.initPosition.y) / 2;
            if (this.input.style.display === 'block') {
                this.disableShortcut = true;
            }
            if (
                this.mousePosition.x < this.initPosition.x ||
                this.mousePosition.x > this.initPosition.x + parseInt(this.input.style.width, 10) ||
                this.mousePosition.y < this.initPosition.y ||
                this.mousePosition.y > this.initPosition.y + parseInt(this.input.style.height, 10)
            ) {
                this.applyText();
                this.textAction = new TextAction(
                    this,
                    this.drawingService,
                    this.colorService.primaryColor,
                    this.lines,
                    this.fontSize,
                    this.fontFamily,
                    this.isBold,
                    this.isItalic,
                    this.breakLineHeight,
                    { x: this.initPosition.x, y: this.modifiedPositionY },
                    this.isAlignCenter,
                    this.isAlignLeft,
                    this.isAlignRight,
                    this.defaultAlign,
                    this.textWidth,
                    this.input,
                );
                this.undoRedoService.addAction(this.textAction);
            }
        }
    }

    initialInputStyle(): void {
        this.input.style.display = 'block';
        this.input.style.left = String(this.initPosition.x) + 'px';
        this.input.style.top = String(this.initPosition.y) + 'px';
        this.input.style.width = DEFAULT_INPUT_WIDTH;
        this.input.style.height = DEFAULT_INPUT_HEIGHT;
        this.input.style.fontFamily = this.fontFamily;
        this.input.style.color = this.colorService.primaryColor;
    }

    applyText(): void {
        this.textWidth = this.drawingService.baseCtx.measureText(this.input.value).width;
        this.drawingService.baseCtx.fillStyle = this.colorService.primaryColor;
        this.drawingService.baseCtx.font =
            this.input.style.fontStyle + ' ' + this.input.style.fontWeight + ' ' + this.fontSize + 'px' + ' ' + this.fontFamily;
        this.lines = this.input.value.split('\n');
        if (this.fontSize < FONT_SIZE_SMALL) {
            this.breakLineHeight = BREAK_LINE_SMALL;
        } else if (this.fontSize < FONT_SIZE_MEDIUM) {
            this.breakLineHeight = BREAK_LINE_MEDIUM;
        } else if (this.fontSize >= FONT_SIZE_MEDIUM) {
            this.breakLineHeight = BREAK_LINE_LARGE;
        }

        this.fillTextBaseCtx();

        this.counterLeft = 1;
        this.counterRight = 1;
        this.input.style.display = 'none';
        this.input.value = '';
        this.disableShortcut = false;
        this.initPos = false;
    }

    fillTextBaseCtx(): void {
        if (this.isAlignLeft || this.defaultAlign) {
            for (let i = 0; i < this.lines.length; i++) {
                this.drawingService.baseCtx.fillText(this.lines[i], this.initPosition.x, this.modifiedPositionY + i * this.breakLineHeight);
            }
        } else if (this.isAlignCenter) {
            for (let i = 0; i < this.lines.length; i++) {
                this.widthOfEachLine[i] = this.drawingService.baseCtx.measureText(this.lines[i]).width;
                this.drawingService.baseCtx.fillText(
                    this.lines[i],
                    this.initPosition.x + parseInt(DEFAULT_INPUT_WIDTH, 10) / 2 - this.widthOfEachLine[i] / 2,
                    this.modifiedPositionY + i * this.breakLineHeight,
                );
            }
        } else if (this.isAlignRight) {
            for (let i = 0; i < this.lines.length; i++) {
                this.widthOfEachLine[i] = this.drawingService.baseCtx.measureText(this.lines[i]).width;
                this.drawingService.baseCtx.fillText(
                    this.lines[i],
                    this.initPosition.x + parseInt(this.input.style.width, 10) - this.widthOfEachLine[i],
                    this.modifiedPositionY + i * this.breakLineHeight,
                );
            }
        }
    }

    onEscape(event: KeyboardEvent): void {
        this.input.style.display = 'none';
        this.input.value = '';
        this.disableShortcut = false;
    }

    allignLeft(): void {
        this.input.style.textAlign = 'left';
        this.isAlignLeft = true;
        this.isAlignCenter = false;
        this.isAlignRight = false;
    }

    allignCenter(): void {
        this.input.style.textAlign = 'center';
        this.isAlignCenter = true;
        this.isAlignLeft = false;
        this.isAlignRight = false;
        this.defaultAlign = false;
    }

    allignRight(): void {
        this.input.style.textAlign = 'right';
        this.isAlignRight = true;
        this.isAlignLeft = false;
        this.isAlignCenter = false;
        this.defaultAlign = false;
    }

    applyBold(): void {
        if (!this.isBold) {
            this.input.style.fontWeight = 'bold';
            this.isBold = true;
        } else {
            this.input.style.fontWeight = 'normal';
            this.isBold = false;
        }
    }

    applyItalic(): void {
        if (!this.isItalic) {
            this.input.style.fontStyle = 'italic';
            this.isItalic = true;
        } else {
            this.input.style.fontStyle = 'normal';
            this.isItalic = false;
        }
    }
}

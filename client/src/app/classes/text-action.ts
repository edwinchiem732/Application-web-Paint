import { UndoRedoAbs } from '@app/classes/undo-redo';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from '@app/services/text.service';
import { Vec2 } from './vec2';
export class TextAction extends UndoRedoAbs {
    widthOfEachLine: number[];
    constructor(
        public textService: TextService,
        public drawingService: DrawingService,
        public color: string,
        public linesArray: string[],
        public fontSize: number,
        public fontFamily: string,
        public isBold: boolean,
        public isItalic: boolean,
        public breakLineHeight: number,
        public position: Vec2,
        public isAlignCenter: boolean,
        public isAlignLeft: boolean,
        public isAlignRight: boolean,
        public defaultAlign: boolean,
        public textWidth: number,
        public input: HTMLInputElement,
    ) {
        super();
    }

    applyActions(): void {
        this.textService.textWidth = this.textWidth;
        this.drawingService.baseCtx.fillStyle = this.color;
        this.textService.lines = this.linesArray;
        this.textService.fontSize = this.fontSize;
        this.textService.fontFamily = this.fontFamily;
        this.textService.input.style.fontWeight = this.input.style.fontWeight;
        this.textService.input.style.fontStyle = this.input.style.fontStyle;
        this.textService.isBold = this.isBold;
        this.textService.isItalic = this.isItalic;
        this.textService.breakLineHeight = this.breakLineHeight;
        this.textService.initPosition.x = this.position.x;
        this.textService.modifiedPositionY = this.position.y;
        this.textService.isAlignCenter = this.isAlignCenter;
        this.textService.isAlignLeft = this.isAlignLeft;
        this.textService.isAlignRight = this.isAlignRight;
        this.textService.defaultAlign = this.defaultAlign;
        this.textService.input = this.input;
        this.textService.textWidth = this.textWidth;

        this.drawingService.baseCtx.font =
            this.textService.input.style.fontStyle +
            ' ' +
            this.textService.input.style.fontWeight +
            ' ' +
            this.textService.fontSize +
            'px' +
            ' ' +
            this.textService.fontFamily;

        this.textService.fillTextBaseCtx();
    }
}

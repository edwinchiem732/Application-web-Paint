import { UndoRedoAbs } from '@app/classes/undo-redo';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { Vec2 } from './vec2';

export class EraserAction extends UndoRedoAbs {
    constructor(
        private eraserService: EraserService,
        private drawingService: DrawingService,
        private color: string,
        private eraserWidth: number,
        private pathData: Vec2[],
    ) {
        super();
    }

    applyActions(): void {
        this.drawingService.baseCtx.strokeStyle = this.color;
        this.drawingService.baseCtx.lineWidth = this.eraserWidth;
        this.drawingService.baseCtx.lineCap = 'round';
        this.eraserService.drawLine(this.drawingService.baseCtx, this.pathData);
    }
}

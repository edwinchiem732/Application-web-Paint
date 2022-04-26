import { UndoRedoAbs } from '@app/classes/undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil.service';

export class PencilAction extends UndoRedoAbs {
    constructor(
        private pencilService: PencilService,
        private drawingService: DrawingService,
        private color: string,
        private widthLine: number,
        private pathPencil: Vec2[],
    ) {
        super();
    }

    applyActions(): void {
        this.drawingService.baseCtx.strokeStyle = this.color;
        this.drawingService.baseCtx.lineWidth = this.widthLine;
        this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.lineJoin = 'round';
        this.pencilService.drawLine(this.drawingService.baseCtx, this.pathPencil);
    }
}

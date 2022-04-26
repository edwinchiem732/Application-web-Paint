import { UndoRedoAbs } from '@app/classes/undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '@app/services/tools/line.service';

export class LineAction extends UndoRedoAbs {
    constructor(
        private lineService: LineService,
        private drawingService: DrawingService,
        private color: string,
        private widthLine: number,
        private pathData: Vec2[],
        private junctionRadius: number,
        private isJunctionOn: boolean,
    ) {
        super();
    }

    applyActions(): void {
        this.drawingService.baseCtx.strokeStyle = this.color;
        this.drawingService.baseCtx.lineWidth = this.widthLine;
        this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.baseCtx.lineJoin = 'round';
        this.drawingService.baseCtx.setLineDash([]);
        this.lineService.junctionRadius = this.junctionRadius;

        this.lineService.line(this.drawingService.baseCtx, this.pathData);
        if (this.isJunctionOn) {
            for (const point of this.pathData) {
                this.lineService.junction(this.drawingService.baseCtx, point);
            }
        }
    }
}

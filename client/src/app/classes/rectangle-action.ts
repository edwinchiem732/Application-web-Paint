import { UndoRedoAbs } from '@app/classes/undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';

export class RectangleAction extends UndoRedoAbs {
    constructor(
        private drawingService: DrawingService,
        private rectangleService: RectangleService,
        private borderColor: string,
        private fillColor: string,
        private borderWidth: number,
        private rectangleMode: string,
        private mouseDownCoord: Vec2,
        private distanceX: number,
        private distanceY: number,
        private isSquareOn: boolean,
    ) {
        super();
    }

    applyActions(): void {
        this.drawingService.baseCtx.strokeStyle = this.borderColor;
        this.drawingService.baseCtx.fillStyle = this.fillColor;
        this.drawingService.baseCtx.lineWidth = this.borderWidth;
        this.drawingService.baseCtx.lineCap = 'square';
        this.rectangleService.square = this.isSquareOn;

        this.rectangleService.distanceX = this.distanceX;
        this.rectangleService.distanceY = this.distanceY;

        if (this.rectangleMode === 'plein' || this.rectangleMode === 'pleinContour') {
            this.rectangleService.rectangleFill(this.drawingService.baseCtx, this.mouseDownCoord);
        }
        this.rectangleService.rectangleBorder(this.drawingService.baseCtx, this.mouseDownCoord);
    }
}

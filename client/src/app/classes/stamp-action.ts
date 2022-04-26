import { UndoRedoAbs } from '@app/classes/undo-redo';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampService } from '@app/services/tools/stamp.service';
export class StampAction extends UndoRedoAbs {
    constructor(
        private drawingService: DrawingService,
        private stampService: StampService,
        private stampName: string,
        private mouseCenterX: number,
        private mouseCenterY: number,
        private stampPrint: HTMLImageElement,
        private canvasHeight: number,
        private canvasWidth: number,
        private newWidth: number,
        private newHeight: number,
        private angle: number,
    ) {
        super();
    }

    applyActions(): void {
        this.stampService.stampName = this.stampName;
        this.stampPrint.src = this.stampName;
        this.stampService.stampPrint = this.stampPrint;
        this.stampService.newWidth = this.newWidth;
        this.stampService.newHeight = this.newHeight;

        this.stampService.canvasHeight = this.canvasHeight;
        this.stampService.canvasWidth = this.canvasWidth;

        this.stampService.mouseCenterX = this.mouseCenterX;
        this.stampService.mouseCenterY = this.mouseCenterY;

        this.stampService.angle = this.angle;

        this.drawingService.baseCtx.drawImage(this.stampService.stampPrint, this.stampService.mouseCenterX, this.stampService.mouseCenterY);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}

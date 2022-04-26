import { UndoRedoAbs } from '@app/classes/undo-redo';
import { DrawingService } from '@app/services/drawing/drawing.service';

export class ResizeAction extends UndoRedoAbs {
    constructor(
        private drawingService: DrawingService,
        private canvasSizeWidth: number,
        private canvasSizeHeight: number,
        private oldCanvas: string,
    ) {
        super();
    }

    applyActions(): void {
        this.drawingService.dotSize = { x: this.canvasSizeWidth, y: this.canvasSizeHeight };

        this.drawingService.canvasSize = this.drawingService.dotSize;
        this.drawingService.grabberSide = this.drawingService.dotSize;

        this.drawingService.grabberRight.x = this.drawingService.dotSize.x;
        this.drawingService.grabberRight.y = this.drawingService.dotSize.y / 2;

        this.drawingService.grabberBottom.x = this.drawingService.dotSize.x / 2;
        this.drawingService.grabberBottom.y = this.drawingService.dotSize.y;
        this.drawingService.copiedCanvas = this.oldCanvas;
        this.drawingService.copyCanvas();
    }
}

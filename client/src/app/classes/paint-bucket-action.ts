import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoAbs } from './undo-redo';

export class PaintBucketAction extends UndoRedoAbs {
    constructor(public drawingService: DrawingService, public imageData: ImageData) {
        super();
    }

    applyActions(): void {
        this.drawingService.baseCtx.putImageData(this.imageData, 0, 0);
    }
}

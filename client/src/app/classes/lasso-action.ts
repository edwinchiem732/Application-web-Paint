import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionLassoService } from '@app/services/tools/selection-lasso.service';
import { UndoRedoAbs } from './undo-redo';

export class LassoAction extends UndoRedoAbs {
    constructor(
        private drawingService: DrawingService,
        private selectionLassoService: SelectionLassoService,
        private imageData: ImageData,
        private imagePosition: Vec2,
        private selected: boolean,
        private gotCopied: boolean,
        private erasedImage: ImageData,
        private erasedPosition: Vec2,
        private rejoinedOrigin: boolean,
        private imageCanvas: HTMLImageElement,
        private imageDataCopied: ImageData,
        private isCopied: boolean,
        private pasted: boolean,
        private cutImage: boolean,
    ) {
        super();
    }

    applyActions(): void {
        this.selected = false;
        this.selectionLassoService.imagePosition = this.imagePosition;
        this.selectionLassoService.imageData = this.imageData;
        this.selectionLassoService.selected = this.selected;
        this.selectionLassoService.gotCopied = this.gotCopied;
        this.selectionLassoService.erasedImage = this.erasedImage;
        this.selectionLassoService.erasedPosition = this.erasedPosition;
        this.selectionLassoService.rejoinedOrigin = this.rejoinedOrigin;
        this.selectionLassoService.imageCanvas = this.imageCanvas;
        this.selectionLassoService.imageDataCopiedLasso = this.imageDataCopied;
        this.selectionLassoService.isCopied = this.isCopied;
        this.selectionLassoService.pasted = this.pasted;
        this.selectionLassoService.cutImage = this.cutImage;

        if (!this.selectionLassoService.selected && !this.selectionLassoService.gotCopied) {
            this.drawingService.baseCtx.putImageData(
                this.selectionLassoService.imageData,
                this.selectionLassoService.imagePosition.x,
                this.selectionLassoService.imagePosition.y,
            );
            this.selectionLassoService.eraseImage();
            this.drawingService.baseCtx.setLineDash([]);
        } else if (!this.selectionLassoService.selected && this.selectionLassoService.pasted) {
            this.drawingService.baseCtx.putImageData(
                this.selectionLassoService.imageDataCopiedLasso,
                this.selectionLassoService.imagePosition.x,
                this.selectionLassoService.imagePosition.y,
            );
            this.drawingService.baseCtx.setLineDash([]);
        } else if (this.selectionLassoService.cutImage) {
            this.selectionLassoService.eraseImage();
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionLassoService.isSelecting = false;
        this.selectionLassoService.selectedBtn = false;
    }
}

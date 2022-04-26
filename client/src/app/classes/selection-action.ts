import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoAbs } from './undo-redo';
import { Vec2 } from './vec2';

export class SelectionAction extends UndoRedoAbs {
    constructor(
        private drawingService: DrawingService,
        private selectionService: SelectionService,
        private imageData: ImageData,
        private mousePosition: Vec2,
        private diameter: Vec2,
        private imagePosition: Vec2,
        private mouseDownCoord: Vec2,
        private selected: boolean,
        private selectionOption: boolean,
        private copied: boolean,
        private center: Vec2,
        private radius: Vec2,
        private cutImage: boolean,
        private isPasted: boolean,
        private imageDataCopied: ImageData,
        private isResizing: boolean,
        private imageResizedPos: Vec2[],
    ) {
        super();
    }

    applyActions(): void {
        this.selectionService.mouseDownCoord = this.mouseDownCoord;
        this.selectionService.imageData = this.imageData;
        this.selectionService.mousePosition = this.mousePosition;
        this.selectionService.diameter = this.diameter;
        this.selectionService.imagePosition = this.imagePosition;
        this.selectionService.selectionOption = this.selectionOption;
        this.selectionService.center = this.center;
        this.selectionService.radius = this.radius;
        this.selectionService.cutImage = this.cutImage;
        this.selectionService.copied = this.copied;
        this.selectionService.isPasted = this.isPasted;
        this.selectionService.imageDataCopied = this.imageDataCopied;
        this.selectionService.selected = this.selected;
        this.selectionService.isResizing = this.isResizing;
        this.selectionService.imageResisedPos = this.imageResizedPos;

        if (this.selectionService.selected && !this.selectionService.isPasted) {
            this.selectionService.putImage();
            this.selectionService.boundingBox(true);
        } else if (!this.selectionService.selected && !this.selectionService.isPasted) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.selectionService.mouseMove && !this.selectionService.copied && this.selectionService.selectionOption) {
                this.putRectangleNotResized();
            } else if (this.selectionService.mouseMove && !this.selectionService.copied && !this.selectionService.selectionOption) {
                this.selectionService.copyEllipse();
                this.drawingService.baseCtx.putImageData(
                    this.selectionService.imageData,
                    this.selectionService.imagePosition.x,
                    this.selectionService.imagePosition.y,
                );
            }
            this.selectionService.isSelecting = true;
        } else if (!this.selectionService.selected && this.selectionService.isPasted) {
            this.drawingService.baseCtx.putImageData(
                this.selectionService.imageDataCopied,
                this.selectionService.imagePosition.x,
                this.selectionService.imagePosition.y,
            );
        } else if (this.selectionService.cutImage) {
            this.drawingService.baseCtx.putImageData(this.imageData, this.imagePosition.x, this.imagePosition.y);
        } else if (this.selectionService.isResizing) {
            this.resizing();
        } else {
            this.fillBlancSelection();
        }
    }

    putRectangleNotResized(): void {
        this.drawingService.baseCtx.fillRect(
            this.selectionService.imagePosition.x,
            this.selectionService.imagePosition.y,
            this.selectionService.imageData.width,
            this.selectionService.imageData.height,
        );
        this.drawingService.baseCtx.putImageData(this.imageData, this.selectionService.imagePosition.x, this.selectionService.imagePosition.y);
    }
    resizing(): void {
        this.drawingService.baseCtx.putImageData(
            this.imageData,
            this.selectionService.imageResisedPos[1].x,
            this.selectionService.imageResisedPos[1].y,
        );
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fillRect(this.imagePosition.x, this.imagePosition.y, this.imageData.width, this.imageData.height);
    }

    fillBlancSelection(): void {
        this.drawingService.baseCtx.fillStyle = 'white';
        if (this.selectionService.selectionOption) {
            this.drawingService.baseCtx.fillRect(this.imagePosition.x, this.imagePosition.y, this.diameter.x, this.diameter.y);
        } else {
            this.drawingService.baseCtx.ellipse(
                this.imagePosition.x,
                this.imagePosition.y,
                Math.abs(this.radius.x),
                Math.abs(this.radius.y),
                0,
                0,
                2 * Math.PI,
            );
        }
    }
}

import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygonService } from '@app/services/tools/polygon.service';
import { UndoRedoAbs } from './undo-redo';
import { Vec2 } from './vec2';

export class PolygonAction extends UndoRedoAbs {
    constructor(
        private drawingService: DrawingService,
        private polygonService: PolygonService,
        private polygonMode: string,
        private borderColor: string,
        private fillColor: string,
        private borderWidth: number,
        private mouseDownCoord: Vec2,
        private distance: Vec2,
        private radius: number,
        private sidesNumber: number,
    ) {
        super();
    }

    applyActions(): void {
        this.drawingService.baseCtx.strokeStyle = this.borderColor;
        this.drawingService.baseCtx.fillStyle = this.fillColor;
        this.drawingService.baseCtx.lineWidth = this.borderWidth;
        this.drawingService.baseCtx.setLineDash([]);
        this.polygonService.distance.x = this.distance.x;
        this.polygonService.distance.y = this.distance.y;
        this.polygonService.radius = this.radius;
        this.polygonService.sidesNumber = this.sidesNumber;
        this.polygonService.polygonMode = this.polygonMode;

        this.polygonService.polygonFill(this.drawingService.baseCtx, this.mouseDownCoord);
    }
}

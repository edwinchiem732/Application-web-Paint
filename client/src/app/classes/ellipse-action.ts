import { UndoRedoAbs } from '@app/classes/undo-redo';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse.service';

export class EllipseAction extends UndoRedoAbs {
    constructor(
        private drawingService: DrawingService,
        private ellipseService: EllipseService,
        private borderColor: string,
        private fillColor: string,
        private borderWidth: number,
        private ellipseTrace: string,
        private center: Vec2,
        private radius: Vec2,
        private circleRadius: number,
        private isCircleOn: boolean,
    ) {
        super();
    }

    applyActions(): void {
        this.drawingService.baseCtx.strokeStyle = this.borderColor;
        this.drawingService.baseCtx.fillStyle = this.fillColor;
        this.drawingService.baseCtx.lineWidth = this.borderWidth;
        this.drawingService.baseCtx.lineCap = 'square';
        this.ellipseService.circleRadius = this.circleRadius;
        this.ellipseService.center.x = this.center.x;
        this.ellipseService.center.y = this.center.y;
        this.ellipseService.radius.x = this.radius.x;
        this.ellipseService.radius.y = this.radius.y;
        this.ellipseService.circle = this.isCircleOn;
        this.ellipseService.ellipseTrace = this.ellipseTrace;
        this.ellipseService.shapeFill(this.drawingService.baseCtx);
    }
}

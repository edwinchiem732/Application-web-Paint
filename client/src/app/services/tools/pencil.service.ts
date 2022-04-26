import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/enum';
import { PencilAction } from '@app/classes/pencil-action';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
// import { actions } from '@app/constant/constants';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    constructor(drawingService: DrawingService, private colorService: ColorService, private undoRedoService: UndoRedoService) {
        super(drawingService);
        this.clearPath();
    }
    private pencilAction: PencilAction;
    private pathData: Vec2[];
    pencilWidth: number = 5;
    tool: Tool;

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor;
            this.drawingService.previewCtx.strokeStyle = this.colorService.primaryColor;

            this.drawingService.previewCtx.globalAlpha = this.colorService.colorOpacity;
            this.drawingService.baseCtx.globalAlpha = this.colorService.colorOpacity;

            this.drawingService.baseCtx.lineWidth = this.pencilWidth;
            this.drawingService.previewCtx.lineWidth = this.pencilWidth;

            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    // when mouseUp and decides to start drawing
    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.drawLine(this.drawingService.baseCtx, this.pathData);

            // add actions to listActions
            this.pencilAction = new PencilAction(this, this.drawingService, this.colorService.primaryColor, this.pencilWidth, this.pathData);
            this.undoRedoService.addAction(this.pencilAction);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // We draw on the preview canvas and delete it each time the mouse is moved
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseOut(event: MouseEvent): void {
        this.drawLine(this.drawingService.previewCtx, this.pathData);
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.setLineDash([]);
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.lineCap = 'round'; // make our line round
        ctx.lineJoin = 'round';
        // ctx.lineWidth = this.pencilWidth;
        // ctx.strokeStyle = this.colorService.primaryColor;

        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}

import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { RectangleAction } from '@app/classes/rectangle-action';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    square: boolean = false;
    width: number = 5;
    mousePosition: Vec2;
    distanceX: number = 0;
    distanceY: number = 0;
    rectangleMode: string = 'contour';
    private rectangleAction: RectangleAction;

    constructor(drawingService: DrawingService, private colorService: ColorService, private undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.rectangleMode === 'plein' || this.rectangleMode === 'pleinContour') {
                this.rectangleFill(this.drawingService.baseCtx, this.mouseDownCoord);
            }
            this.rectangleBorder(this.drawingService.baseCtx, this.mouseDownCoord);

            this.rectangleAction = new RectangleAction(
                this.drawingService,
                this,
                this.colorService.secondaryColor,
                this.colorService.primaryColor,
                this.width,
                this.rectangleMode,
                this.mouseDownCoord,
                this.distanceX,
                this.distanceY,
                this.square,
            );

            this.undoRedoService.addAction(this.rectangleAction);

            this.distanceX = 0;
            this.distanceY = 0;
            this.mouseDown = false;
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.rectangleSelect(mousePosition);
        }
    }

    onShiftDown(event: KeyboardEvent): void {
        this.square = true;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.rectangleMode === 'plein' || this.rectangleMode === 'pleinContour') {
                this.rectangleFill(this.drawingService.previewCtx, this.mouseDownCoord);
            }
            this.rectangleBorder(this.drawingService.previewCtx, this.mouseDownCoord);
        }
    }

    onShiftUp(event: KeyboardEvent): void {
        this.square = false;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.rectangleMode === 'plein' || this.rectangleMode === 'pleinContour') {
                this.rectangleFill(this.drawingService.previewCtx, this.mouseDownCoord);
            }
            this.rectangleBorder(this.drawingService.previewCtx, this.mouseDownCoord);
        }
    }

    traceStyle(ctx: CanvasRenderingContext2D): void {
        switch (this.rectangleMode) {
            case 'contour': {
                ctx.strokeStyle = this.colorService.secondaryColor;
                break;
            }
            case 'plein': {
                ctx.fillStyle = this.colorService.primaryColor;
                ctx.strokeStyle = this.colorService.primaryColor;
                break;
            }
            case 'pleinContour': {
                ctx.strokeStyle = this.colorService.secondaryColor;
                ctx.fillStyle = this.colorService.primaryColor;
                break;
            }
        }
    }

    // rectangleFill(ctx: CanvasRenderingContext2D, mouseDownCoord: Vec2): void {
    //     this.traceStyle(ctx);
    //     ctx.setLineDash([]);
    //     ctx.lineCap = 'square';
    //     if (this.square) {
    //         ctx.fillRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.distanceX, this.distanceX); // x = y
    //     } else {
    //         ctx.fillRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.distanceX, this.distanceY); // x != y
    //     }
    // }
    rectangleFill(ctx: CanvasRenderingContext2D, mouseDownCoord: Vec2): void {
        this.traceStyle(ctx);
        ctx.setLineDash([]);
        ctx.lineCap = 'square';
        if (this.square) {
            ctx.fillRect(mouseDownCoord.x, mouseDownCoord.y, this.distanceX, this.distanceX); // x = y
        } else {
            ctx.fillRect(mouseDownCoord.x, mouseDownCoord.y, this.distanceX, this.distanceY); // x != y
        }
    }

    // rectangleBorder(ctx: CanvasRenderingContext2D): void {
    //     this.traceStyle(ctx);
    //     ctx.lineWidth = this.width;
    //     ctx.setLineDash([]);

    //     // transform into square
    //     ctx.lineCap = 'square';
    //     if (this.square) {
    //         ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.distanceX, this.distanceX); // x = y
    //     } else {
    //         ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.distanceX, this.distanceY); // x != y
    //     }
    // }
    rectangleBorder(ctx: CanvasRenderingContext2D, mouseDownCoord: Vec2): void {
        this.traceStyle(ctx);
        ctx.lineWidth = this.width;
        ctx.setLineDash([]);

        // transform into square
        ctx.lineCap = 'square';
        if (this.square) {
            ctx.strokeRect(mouseDownCoord.x, mouseDownCoord.y, this.distanceX, this.distanceX); // x = y
        } else {
            ctx.strokeRect(mouseDownCoord.x, mouseDownCoord.y, this.distanceX, this.distanceY); // x != y
        }
    }

    rectangleSelect(mousePosition: Vec2): void {
        this.distanceX = mousePosition.x - this.mouseDownCoord.x;
        this.distanceY = mousePosition.y - this.mouseDownCoord.y;

        if (this.rectangleMode === 'plein' || this.rectangleMode === 'pleinContour') {
            this.rectangleFill(this.drawingService.previewCtx, this.mouseDownCoord);
        }
        this.rectangleBorder(this.drawingService.previewCtx, this.mouseDownCoord);
    }
}

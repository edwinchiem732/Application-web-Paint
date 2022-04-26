import { Injectable } from '@angular/core';
import { EraserAction } from '@app/classes/eraser-action';
import { ERASER } from '@app/classes/eraser-image';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from './undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private eraserAction: EraserAction;
    private color: string = '#FFFFFF';
    private pathData: Vec2[];
    private offSetX: number;
    private offSetY: number;
    private canvasWidth: number;
    private canvasHeight: number;

    currentImage: HTMLImageElement;
    eraserImage: string = ERASER.image;
    eraserWidth: number = 5;

    constructor(drawingService: DrawingService, private undoRedoService: UndoRedoService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.drawingService.baseCtx.strokeStyle = this.color;
            this.drawingService.baseCtx.lineWidth = this.eraserWidth;
            this.drawingService.previewCtx.strokeStyle = this.color;
            this.drawingService.previewCtx.lineWidth = this.eraserWidth;
            this.mouseMove = false;
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.mouseDown) {
            if (this.mouseMove) {
                this.drawLine(this.drawingService.baseCtx, this.pathData);
            } else {
                this.pathData.push(mousePosition);
                this.drawingService.baseCtx.fillStyle = this.color;
                this.drawingService.baseCtx.fillRect(
                    mousePosition.x - this.eraserWidth / 2,
                    mousePosition.y - this.eraserWidth / 2,
                    this.eraserWidth,
                    this.eraserWidth,
                );
                this.drawingService.previewCtx.fillStyle = this.color;
                this.drawingService.previewCtx.fillRect(mousePosition.x, mousePosition.y, this.eraserWidth, this.eraserWidth);
            }
            this.eraserAction = new EraserAction(this, this.drawingService, this.color, this.eraserWidth, this.pathData);
            this.undoRedoService.addAction(this.eraserAction);
        }
        this.mouseDown = false;
        this.clearPath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        this.canvasWidth = this.drawingService.eraserCtx.canvas.offsetWidth / 2;
        this.canvasHeight = this.drawingService.eraserCtx.canvas.offsetHeight / 2;
        this.drawingService.eraserCtx.canvas.style.left = event.offsetX - this.canvasWidth + 'px';
        this.drawingService.eraserCtx.canvas.style.top = event.offsetY - this.canvasHeight + 'px';
        this.currentImage = new Image();
        this.currentImage.src = this.eraserImage;
        this.generateImage();

        // taken from pencil-service (given)
        if (this.mouseDown) {
            this.mouseMove = true;
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // We draw on the preview canvas and delete it each time the mouse is moved
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseOut(event: MouseEvent): void {
        this.drawingService.eraserCtx.canvas.style.display = 'none';
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.eraserCtx.canvas.style.display = 'inline-block';
        this.currentImage = new Image();
        this.currentImage.src = this.eraserImage;
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // taken from pencil-service (given)
        ctx.beginPath();
        ctx.setLineDash([]);
        // ctx.lineCap = 'square';
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        // taken from pencil-service (given)
        this.pathData = [];
    }

    generateImage(): void {
        this.drawingService.eraserCtx.clearRect(0, 0, this.drawingService.eraserCtx.canvas.width, this.drawingService.eraserCtx.canvas.height);
        const temp = this.currentImage.width / this.currentImage.height;
        this.eraserWidth = this.drawingService.eraserCtx.canvas.width;
        this.eraserWidth = this.eraserWidth / temp;

        this.offSetX =
            this.eraserWidth < this.drawingService.eraserCtx.canvas.width ? (this.drawingService.eraserCtx.canvas.width - this.eraserWidth) / 2 : 0;
        this.offSetY =
            this.eraserWidth < this.drawingService.eraserCtx.canvas.height ? (this.drawingService.eraserCtx.canvas.height - this.eraserWidth) / 2 : 0;

        this.drawingService.eraserCtx.save();
        this.drawingService.eraserCtx.drawImage(this.currentImage, this.offSetX, this.offSetY, this.eraserWidth, this.eraserWidth);
        this.drawingService.eraserCtx.restore();
    }
}

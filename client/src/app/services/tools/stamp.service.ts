import { Injectable } from '@angular/core';
import { StampAction } from '@app/classes//stamp-action';
import { STAMP } from '@app/classes/stamp';
import { Tool } from '@app/classes/tool';
import { FLAT_ANGLE, SIZE_ADJUSTMENT_FIFTEEN } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

@Injectable({
    providedIn: 'root',
})

// https://stackoverflow.com/questions/39619967/js-center-image-inside-canvas-element/39620144
export class StampService extends Tool {
    canvasWidth: number;
    canvasHeight: number;
    private offSetX: number;
    private offSetY: number;
    mouseCenterX: number;
    mouseCenterY: number;

    private currentImage: HTMLImageElement;
    currentStampName: string = STAMP.stamp1;
    stampPrint: HTMLImageElement;
    stampName: string;
    newWidth: number;
    newHeight: number;
    angle: number = 0;
    private isWheelUp: boolean = false;
    private isAltPressed: boolean = false;
    private stampAction: StampAction;
    private isLoaded: boolean = false;

    constructor(drawingService: DrawingService, private undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseMove(event: MouseEvent): void {
        this.canvasWidth = this.drawingService.secondCtx.canvas.offsetWidth / 2;
        this.canvasHeight = this.drawingService.secondCtx.canvas.offsetHeight / 2;
        this.drawingService.secondCtx.canvas.style.left = event.offsetX - this.canvasWidth + 'px';
        this.drawingService.secondCtx.canvas.style.top = event.offsetY - this.canvasHeight + 'px';

        if (!this.isLoaded) {
            this.currentImage = new Image();
            this.currentImage.src = this.currentStampName;
            this.currentImage.onload = () => {
                this.drawingService.secondCtx.drawImage(this.currentImage, this.mouseCenterX, this.mouseCenterY);
            };
        }
        this.isLoaded = true;
        this.generateImage();
    }

    onMouseDown(event: MouseEvent): void {
        this.stampName = this.drawingService.secondCtx.canvas.toDataURL();
        this.stampPrint = new Image();
        this.stampPrint.src = this.stampName;

        this.mouseCenterX = event.offsetX - this.canvasWidth;
        this.mouseCenterY = event.offsetY - this.canvasHeight;
        this.stampPrint.onload = () => {
            this.drawingService.baseCtx.drawImage(this.stampPrint, this.mouseCenterX, this.mouseCenterY);
        };

        // undo redo
        this.stampAction = new StampAction(
            this.drawingService,
            this,
            this.stampName,
            this.mouseCenterX,
            this.mouseCenterY,
            this.stampPrint,
            this.canvasHeight,
            this.canvasWidth,
            this.newWidth,
            this.newHeight,
            this.angle,
        );
        this.undoRedoService.addAction(this.stampAction);
    }

    onMouseOut(event: MouseEvent): void {
        this.drawingService.secondCtx.canvas.style.display = 'none';
    }

    onMouseEnter(event: MouseEvent): void {
        this.drawingService.secondCtx.canvas.style.display = 'inline-block';
        this.currentImage = new Image();
        this.currentImage.src = this.currentStampName;
        this.currentImage.onload = () => {
            this.drawingService.secondCtx.drawImage(this.currentImage, this.mouseCenterX, this.mouseCenterY);
        };
    }

    changeAngle(): void {
        if (!this.isWheelUp) {
            if (!this.isAltPressed) {
                this.angle += SIZE_ADJUSTMENT_FIFTEEN;
            } else {
                this.angle += 1;
            }
        }
        if (this.angle > FLAT_ANGLE * 2) {
            this.angle = 0;
        }
        this.generateImage();
    }

    generateImage(): void {
        this.drawingService.secondCtx.clearRect(0, 0, this.drawingService.secondCtx.canvas.width, this.drawingService.secondCtx.canvas.height);
        const temp = this.currentImage.width / this.currentImage.height;
        this.newWidth = this.drawingService.secondCtx.canvas.width;
        this.newHeight = this.newWidth / temp;

        this.offSetX =
            this.newWidth < this.drawingService.secondCtx.canvas.width ? (this.drawingService.secondCtx.canvas.width - this.newWidth) / 2 : 0;
        this.offSetY =
            this.newHeight < this.drawingService.secondCtx.canvas.height ? (this.drawingService.secondCtx.canvas.height - this.newHeight) / 2 : 0;

        this.drawingService.secondCtx.save();
        this.drawingService.secondCtx.translate(this.drawingService.secondCtx.canvas.width / 2, this.drawingService.secondCtx.canvas.height / 2);
        this.drawingService.secondCtx.rotate((this.angle * Math.PI) / FLAT_ANGLE);
        this.drawingService.secondCtx.translate(-this.drawingService.secondCtx.canvas.width / 2, -this.drawingService.secondCtx.canvas.height / 2);
        this.drawingService.secondCtx.drawImage(this.currentImage, this.offSetX, this.offSetY, this.newWidth, this.newHeight);
        this.drawingService.secondCtx.restore();
    }
}

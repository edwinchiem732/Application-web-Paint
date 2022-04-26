import { Injectable } from '@angular/core';
import { MIN_HEIGHT_WIDTH } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ResizeCanvasService {
    constructor(private drawingService: DrawingService) {}

    changeToMinHeightWidht(coord: string): void {
        if (coord === 'x') {
            this.drawingService.grabberBottom.x = MIN_HEIGHT_WIDTH / 2;
            this.drawingService.grabberRight.x = MIN_HEIGHT_WIDTH;
            this.drawingService.grabberSide.x = MIN_HEIGHT_WIDTH;
        } else if (coord === 'y') {
            this.drawingService.grabberBottom.y = MIN_HEIGHT_WIDTH;
            this.drawingService.grabberRight.y = MIN_HEIGHT_WIDTH / 2;
            this.drawingService.grabberSide.y = MIN_HEIGHT_WIDTH;
        }
    }

    changeToOffset(coord: string, offsetX: number, offsetY: number): void {
        if (coord === 'x') {
            this.drawingService.grabberBottom.x += offsetX / 2;
            this.drawingService.grabberRight.x += offsetX;
            this.drawingService.grabberSide.x += offsetX;
        } else if (coord === 'y') {
            this.drawingService.grabberBottom.y += offsetY;
            this.drawingService.grabberRight.y += offsetY / 2;
            this.drawingService.grabberSide.y += offsetY;
        }
    }

    // Resize the dotted canvas with the bottom grabber
    resizerDotBottom(offsetY: number): void {
        this.drawingService.dotSize.y += offsetY;

        if (this.drawingService.dotSize.y <= MIN_HEIGHT_WIDTH) {
            this.changeToMinHeightWidht('y');

            this.drawingService.dotSize.y = MIN_HEIGHT_WIDTH;
        } else {
            this.drawingService.grabberBottom.y += offsetY;
            this.drawingService.grabberRight.y += offsetY / 2;
            this.drawingService.grabberSide.y += offsetY;
        }
    }

    // Resize the dotted canvas with the right grabber
    resizerDotRight(offsetX: number): void {
        this.drawingService.dotSize.x += offsetX;

        if (this.drawingService.dotSize.x <= MIN_HEIGHT_WIDTH) {
            this.changeToMinHeightWidht('x');

            this.drawingService.dotSize.x = MIN_HEIGHT_WIDTH;
        } else {
            this.changeToOffset('x', offsetX, 0);
        }
    }

    // Resize the dotted canvas with the bottom right grabber
    resizerDot(offsetY: number, offsetX: number): void {
        this.drawingService.dotSize.x += offsetX;
        this.drawingService.dotSize.y += offsetY;

        if (this.drawingService.dotSize.x <= MIN_HEIGHT_WIDTH && this.drawingService.dotSize.y <= MIN_HEIGHT_WIDTH) {
            this.changeToMinHeightWidht('x');
            this.changeToMinHeightWidht('y');

            this.drawingService.dotSize.x = MIN_HEIGHT_WIDTH;
            this.drawingService.dotSize.y = MIN_HEIGHT_WIDTH;
        } else if (this.drawingService.dotSize.x <= MIN_HEIGHT_WIDTH) {
            this.changeToMinHeightWidht('x');

            this.changeToOffset('y', offsetX, offsetY);

            this.drawingService.dotSize.x = MIN_HEIGHT_WIDTH;
        } else if (this.drawingService.dotSize.y <= MIN_HEIGHT_WIDTH) {
            this.changeToMinHeightWidht('y');

            this.changeToOffset('x', offsetX, offsetY);

            this.drawingService.dotSize.y = MIN_HEIGHT_WIDTH;
        } else {
            this.changeToOffset('x', offsetX, offsetY);

            this.changeToOffset('y', offsetX, offsetY);
        }
    }

    resizer(): void {
        this.drawingService.canvasSize.y = this.drawingService.dotSize.y;
        this.drawingService.canvasSize.x = this.drawingService.dotSize.x;
    }
}

import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { PaintBucketAction } from '@app/classes/paint-bucket-action';
import { RGBA } from '@app/classes/redgreenbluealpha';
import { Tool } from '@app/classes/tool';
import {
    ALPHA_COMPONENT,
    BLUE_COMPONENT,
    FIRST_POSITION,
    GREEN_COMPONENT,
    MAX_VALUE,
    NULL,
    OPACITY_VALUE,
    POSITIVE_VALUE,
    RADIX_TEN,
    RED_COMPONENT,
    RGBA_LENGTH,
    SECOND_POSITION,
} from '@app/constant/constants';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    private paintBucketAction: PaintBucketAction;
    percentageTolerance: number;
    pixelCanvasSelection: ImageData;
    pixelCanvasEverything: ImageData;

    constructor(public drawingService: DrawingService, public colorService: ColorService, public undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseDown(evt: MouseEvent): void {
        if (evt.button === MouseButton.Left) {
            this.floodFillAlgorithm(evt.offsetX, evt.offsetY, this.colorService.primaryColor);
            return;
        } else if (evt.button === MouseButton.Right) {
            this.floodFillRightClick(evt.offsetX, evt.offsetY);

            // undo redo
            this.paintBucketAction = new PaintBucketAction(this.drawingService, this.pixelCanvasEverything);
            this.undoRedoService.addAction(this.paintBucketAction);

            return;
        }
    }

    stringToRGBA(colorInString: string): RGBA {
        // regx au lieu de slice et split?
        let red: number;
        let green: number;
        let blue: number;
        let alpha: number;
        const temp = colorInString.split('(')[SECOND_POSITION].split(')')[FIRST_POSITION];
        temp.slice(FIRST_POSITION, SECOND_POSITION);
        const temp2 = temp.split(',', RGBA_LENGTH);
        red = parseInt(temp2[RED_COMPONENT], RADIX_TEN);
        green = parseInt(temp2[GREEN_COMPONENT], RADIX_TEN);
        blue = parseInt(temp2[BLUE_COMPONENT], RADIX_TEN);
        alpha = parseInt(temp2[ALPHA_COMPONENT], RADIX_TEN);
        return { r: red, g: green, b: blue, a: alpha };
    }

    // inspired from http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/, but modified
    // tslint:disable-next-line: cyclomatic-complexity
    floodFillAlgorithm(positionX: number, positionY: number, newColor: string): void {
        this.pixelCanvasSelection = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.canvas.width,
            this.drawingService.canvas.height,
        );
        const pixelData = this.pixelCanvasSelection.data;
        const coordonates: number = this.getPixel(positionX, positionY);
        const color = {
            r: this.pixelCanvasSelection.data[coordonates],
            g: this.pixelCanvasSelection.data[coordonates + GREEN_COMPONENT],
            b: this.pixelCanvasSelection.data[coordonates + BLUE_COMPONENT],
            a: this.pixelCanvasSelection.data[coordonates + ALPHA_COMPONENT],
        };
        const savePixels: number[][] = [[positionX, positionY]];
        const otherColor = this.stringToRGBA(newColor);

        if (this.checkEmptyCanvas(color, otherColor) === false) {
            return;
        } else {
            while (savePixels.length) {
                const nextPixel: number[] = savePixels.pop() as number[];
                const pixelPositionX: number = nextPixel[FIRST_POSITION];
                let pixelPositionY: number = nextPixel[SECOND_POSITION];
                let position: number = this.getPixel(pixelPositionX, pixelPositionY);
                while (
                    pixelPositionY-- >= POSITIVE_VALUE &&
                    this.pixelCanvasSelection.data[position] === color.r &&
                    this.pixelCanvasSelection.data[position + GREEN_COMPONENT] === color.g &&
                    this.pixelCanvasSelection.data[position + BLUE_COMPONENT] === color.b &&
                    this.pixelCanvasSelection.data[position + ALPHA_COMPONENT] === color.a
                ) {
                    position -= this.drawingService.canvas.width * RGBA_LENGTH;
                }
                position += this.drawingService.canvas.width * RGBA_LENGTH;
                pixelPositionY++;
                let left = false;
                let right = true;

                while (
                    pixelPositionY++ < this.drawingService.canvas.height - SECOND_POSITION &&
                    this.pixelCanvasSelection.data[position] === color.r &&
                    this.pixelCanvasSelection.data[position + GREEN_COMPONENT] === color.g &&
                    this.pixelCanvasSelection.data[position + BLUE_COMPONENT] === color.b &&
                    this.pixelCanvasSelection.data[position + ALPHA_COMPONENT] === color.a
                ) {
                    pixelData[position] = otherColor.r;
                    pixelData[position + GREEN_COMPONENT] = otherColor.g;
                    pixelData[position + BLUE_COMPONENT] = otherColor.b;
                    pixelData[position + ALPHA_COMPONENT] = otherColor.a * OPACITY_VALUE;

                    if (pixelPositionX > POSITIVE_VALUE) {
                        if (
                            this.pixelCanvasSelection.data[position - RGBA_LENGTH] === color.r &&
                            this.pixelCanvasSelection.data[position - RGBA_LENGTH + GREEN_COMPONENT] === color.g &&
                            this.pixelCanvasSelection.data[position - RGBA_LENGTH + BLUE_COMPONENT] === color.b &&
                            this.pixelCanvasSelection.data[position - RGBA_LENGTH + ALPHA_COMPONENT] === color.a
                        ) {
                            if (!left) {
                                savePixels.push([pixelPositionX - SECOND_POSITION, pixelPositionY]);
                                left = true;
                            } else if (left) {
                                left = false;
                            }
                        }
                    }
                    if (pixelPositionX < this.drawingService.canvas.width - SECOND_POSITION) {
                        if (
                            this.pixelCanvasSelection.data[position + RGBA_LENGTH] === color.r &&
                            this.pixelCanvasSelection.data[position + RGBA_LENGTH + GREEN_COMPONENT] === color.g &&
                            this.pixelCanvasSelection.data[position + RGBA_LENGTH + BLUE_COMPONENT] === color.b &&
                            this.pixelCanvasSelection.data[position + RGBA_LENGTH + ALPHA_COMPONENT] === color.a
                        ) {
                            if (!right) {
                                savePixels.push([pixelPositionX + SECOND_POSITION, pixelPositionY]);
                                right = true;
                            } else if (right) {
                                right = false;
                            }
                        }
                        position += this.drawingService.canvas.width * RGBA_LENGTH;
                    }
                }
            }
            this.pixelCanvasSelection.data.set(pixelData);
            this.drawingService.baseCtx.putImageData(this.pixelCanvasSelection, FIRST_POSITION, FIRST_POSITION);

            // undo redo
            this.paintBucketAction = new PaintBucketAction(this.drawingService, this.pixelCanvasSelection);
            this.undoRedoService.addAction(this.paintBucketAction);
        }
    }

    floodFillRightClick(positionX: number, positionY: number): void {
        this.pixelCanvasEverything = this.drawingService.baseCtx.getImageData(
            FIRST_POSITION,
            FIRST_POSITION,
            this.drawingService.canvas.width,
            this.drawingService.canvas.height,
        );
        const pixelData = this.pixelCanvasEverything.data;
        const coordonates: number = this.getPixel(positionX, positionY);
        const color = {
            r: this.pixelCanvasEverything.data[coordonates],
            g: this.pixelCanvasEverything.data[coordonates + GREEN_COMPONENT],
            b: this.pixelCanvasEverything.data[coordonates + BLUE_COMPONENT],
            a: this.pixelCanvasEverything.data[coordonates + ALPHA_COMPONENT],
        };
        const otherColor = this.stringToRGBA(this.colorService.primaryColor);

        for (let i = FIRST_POSITION; i < this.drawingService.canvas.width - SECOND_POSITION; i++) {
            for (let j = FIRST_POSITION; j < this.drawingService.canvas.height - SECOND_POSITION; j++) {
                const pixelsAtPresentCoordonates: number = this.getPixel(i, j);
                if (
                    this.pixelCanvasEverything.data[pixelsAtPresentCoordonates + RGBA_LENGTH] >= color.r - this.comparaisonTolerance() &&
                    this.pixelCanvasEverything.data[pixelsAtPresentCoordonates + RGBA_LENGTH + GREEN_COMPONENT] >=
                        color.g - this.comparaisonTolerance() &&
                    this.pixelCanvasEverything.data[pixelsAtPresentCoordonates + RGBA_LENGTH + BLUE_COMPONENT] >=
                        color.b - this.comparaisonTolerance() &&
                    this.pixelCanvasEverything.data[pixelsAtPresentCoordonates + RGBA_LENGTH + ALPHA_COMPONENT] >=
                        color.a - this.comparaisonTolerance()
                ) {
                    this.pixelCanvasEverything.data[pixelsAtPresentCoordonates] = otherColor.r;
                    this.pixelCanvasEverything.data[pixelsAtPresentCoordonates + GREEN_COMPONENT] = otherColor.g;
                    this.pixelCanvasEverything.data[pixelsAtPresentCoordonates + BLUE_COMPONENT] = otherColor.b;
                    this.pixelCanvasEverything.data[pixelsAtPresentCoordonates + ALPHA_COMPONENT] = otherColor.a * OPACITY_VALUE;
                }
            }
        }
        this.pixelCanvasEverything.data.set(pixelData);
        this.drawingService.baseCtx.putImageData(this.pixelCanvasEverything, FIRST_POSITION, FIRST_POSITION);
    }

    comparaisonTolerance(): number {
        if (this.percentageTolerance === NULL) {
            return 0;
        } else if (this.percentageTolerance === MAX_VALUE) {
            return OPACITY_VALUE;
        } else {
            return Math.trunc(this.percentageTolerance / MAX_VALUE) * OPACITY_VALUE;
        }
    }

    getPixel(positionX: number, positionY: number): number {
        return (positionY * this.drawingService.canvas.width + positionX) * RGBA_LENGTH;
    }

    checkEmptyCanvas(color: RGBA, newColor: RGBA): boolean {
        if (color.r === newColor.r && color.g === newColor.g && color.b === newColor.b && color.a === newColor.a * OPACITY_VALUE) {
            return false;
        }
        return true;
    }
}

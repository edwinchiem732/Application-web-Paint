import { Injectable } from '@angular/core';
import { LassoAction } from '@app/classes/lasso-action';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import {
    LINE_DASH_FIVE,
    MIN_NUMBER_LINES,
    RGBA_LENGTH,
    SIZE_ADJUSTMENT_EIGHT,
    SIZE_ADJUSTMENT_THREE,
    SIZE_ADJUSTMENT_TWO,
    START_LEFT_CORNER,
    WHITE_PIXEL,
} from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { LineService } from '@app/services/tools/line.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';
import { MagnetismService } from './magnetism.service';
import { ResizeSelectionService } from './resize-selection.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionLassoService extends Tool {
    endLine: boolean = true;
    mousePosition: Vec2 = {} as Vec2;
    pathData: Vec2[] = [];
    shift: boolean = false;
    twentyPxInitialPoint: number = 20;
    dotsSpace: number = 10;
    // private dataPoints: Vec2[] = [];
    // private points: Vec2 = { x: 0, y: 0 };
    // tslint:disable-next-line: typedef
    imagePosition = {} as Vec2;
    // tslint:disable-next-line: typedef
    imageData = {} as ImageData;
    // tslint:disable-next-line: typedef
    erasedImage = {} as ImageData;
    // tslint:disable-next-line: typedef
    rectangleMin = {} as Vec2;
    rectangleWidth: number = 0;
    rectangleHeight: number = 0;
    copied: boolean = false;
    isSelecting: boolean = false;
    escapePressed: boolean = false;
    selected: boolean = false;
    // tslint:disable-next-line: typedef
    selectedPosition = {} as Vec2;
    imageCanvas: HTMLImageElement;
    rejoinedOrigin: boolean = false;
    // tslint:disable-next-line: typedef
    erasedPosition = {} as Vec2;

    // manipulations
    selectedBtn: boolean = false;
    isCopied: boolean = false;
    // tslint:disable-next-line: typedef
    imageDataCopiedLasso = {} as ImageData;
    shortcutDisabledLasso: boolean = false;
    cutImage: boolean = false;
    continuousMouvment: boolean = false;
    lassoAction: LassoAction;
    gotCopied: boolean = false;
    pasted: boolean = true;
    // tslint:disable-next-line: typedef
    mousePos = {} as Vec2;

    // resize
    private isResizing: boolean = false;
    resizeService: ResizeSelectionService = new ResizeSelectionService();
    imageResisedPos: Vec2[];
    resizeBothCorner: boolean = false;
    first: boolean = false;
    copiedCanvas: string = '';
    isResised: boolean = false;

    // magnetism
    magnetism: MagnetismService = new MagnetismService(this.gridService);
    magnetismOn: boolean = false;

    constructor(
        public drawingService: DrawingService,
        public lineService: LineService,
        private undoRedoService: UndoRedoService,
        public selectionService: SelectionService,
        private gridService: GridService,
    ) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.rejoinedOrigin) {
            this.selectedPosition = this.getPositionFromMouse(event);
            if (this.isSelecting) {
                this.isResizing = this.resizeService.isOnControlePoint(
                    this.selectedPosition,
                    this.imagePosition,
                    this.imageData.width,
                    this.imageData.height,
                );
                this.first = true;
            }

            if (!this.isSelected(this.selectedPosition) && this.mouseMove && this.isSelecting && !this.isResizing) {
                this.lassoAction = new LassoAction(
                    this.drawingService,
                    this,
                    this.imageData,
                    this.imagePosition,
                    this.selected,
                    this.gotCopied,
                    this.erasedImage,
                    this.erasedPosition,
                    this.rejoinedOrigin,
                    this.imageCanvas,
                    this.imageDataCopiedLasso,
                    this.isCopied,
                    this.pasted,
                    this.cutImage,
                );
                this.drawImageBaseCtx(this.imageData);
                this.undoRedoService.addAction(this.lassoAction);
                this.imagePosition = {} as Vec2;
                this.imageData = {} as ImageData;
                this.mousePosition = {} as Vec2;
                this.copied = false;
                this.isSelecting = false;
                this.mouseMove = false;
                this.escapePressed = false;
                this.selected = false;
                this.rejoinedOrigin = false;
                this.pathData = [];
                this.selectedBtn = false;
                this.gotCopied = false;
                this.isResizing = false;
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.rejoinedOrigin && !this.isResizing) {
            this.mouseDown = false;
            if (!this.selected) {
                /*this.endLine = true;
                this.pathData.pop();
                this.pathData.pop();
                this.pathData.push(this.pathData[0]);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                this.drawingService.pasteCanvas();
                this.lineService.line(this.drawingService.baseCtx, this.pathData);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);*/
                this.reachedEnd();
            }
        } else if (!this.rejoinedOrigin && !this.isResizing) {
            // reset current line
            if (this.endLine) {
                this.drawingService.copyCanvas();
                this.lineService.clearPath();
                this.endLine = false;
            }
            if (this.mouseDown) {
                this.mouseDownCoord = this.getPositionFromMouse(event); // mets les anciens points pour le straightLine
                let mousePosition = (this.mousePosition = this.getPositionFromMouse(event));

                if (this.shift) {
                    mousePosition = this.lineService.angleBetweenLine(mousePosition, this.pathData[this.pathData.length - 1]);
                }
                this.pathData.push(mousePosition);
            }
            this.selectionRectangle(this.drawingService.previewCtx);
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mousePos = { x: event.offsetX, y: event.offsetY };
        console.log('gros caca');
        console.log(this.mousePos.x);
        console.log(this.mousePos.y);
        console.log(event.offsetX);
        console.log(event.offsetY);
        console.log('caliss');
        if (this.isResizing) {
            /*this.imageData = this.drawingService.previewCtx.getImageData(
                this.imageResisedPos[1].x,
                this.imageResisedPos[1].y,
                this.imageResisedPos[0].x,
                this.imageResisedPos[0].y,
            );
            this.isResizing = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // this.drawingService.previewCtx.putImageData(this.imageData, this.imageResisedPos[1].x, this.imageResisedPos[1].y);
            this.imagePosition.x = this.imageResisedPos[1].x;
            this.imagePosition.y = this.imageResisedPos[1].y;
            this.first = true;
            this.isResised = true;*/
            this.gotResized();
        }
        if (this.rejoinedOrigin && !this.isResizing) {
            if (
                this.mousePos.x < this.drawingService.canvasSize.x &&
                this.mousePos.y < this.drawingService.canvasSize.y &&
                this.mousePos.x > 0 &&
                this.mousePos.y > 0
            ) {
                this.selectionBox(
                    this.rectangleMin.x - SIZE_ADJUSTMENT_THREE,
                    this.rectangleMin.y - SIZE_ADJUSTMENT_THREE,
                    this.rectangleWidth + SIZE_ADJUSTMENT_THREE * 2,
                    this.rectangleHeight + SIZE_ADJUSTMENT_THREE * 2,
                    false,
                );
                this.controlPoint({ x: this.rectangleMin.x - SIZE_ADJUSTMENT_THREE, y: this.rectangleMin.y - SIZE_ADJUSTMENT_THREE });
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                if (this.selected && !this.gotCopied) {
                    this.selectionBox(
                        this.imagePosition.x - SIZE_ADJUSTMENT_THREE,
                        this.imagePosition.y - SIZE_ADJUSTMENT_THREE,
                        this.rectangleWidth + SIZE_ADJUSTMENT_THREE * 2,
                        this.rectangleHeight + SIZE_ADJUSTMENT_THREE * 2,
                        false,
                    );
                    this.controlPoint({ x: this.imagePosition.x - SIZE_ADJUSTMENT_THREE, y: this.imagePosition.y - SIZE_ADJUSTMENT_THREE });
                } else if (this.selected && this.gotCopied) {
                    this.selectionBox(
                        this.imagePosition.x - SIZE_ADJUSTMENT_THREE,
                        this.imagePosition.y - SIZE_ADJUSTMENT_THREE,
                        this.imageDataCopiedLasso.width + SIZE_ADJUSTMENT_THREE * 2,
                        this.imageDataCopiedLasso.height + SIZE_ADJUSTMENT_THREE * 2,
                        false,
                    );
                    this.controlPoint({ x: this.imagePosition.x - SIZE_ADJUSTMENT_THREE, y: this.imagePosition.y - SIZE_ADJUSTMENT_THREE });
                }
                this.putImage();
            }
        }
        if (!this.rejoinedOrigin) {
            if (this.shift) {
                this.mousePos = this.lineService.angleBetweenLine(this.mousePos, this.pathData[this.pathData.length - 1]);
            }
            this.straigthLine(this.drawingService.baseCtx, this.mousePos); // dessine la ligne
            // this.selectionRectangle(this.drawingService.previewCtx);
        }
    }

    onMouseMove(event: MouseEvent): void {
        // console.log(this.mousePosition);
        if (this.mouseDown) {
            if (!this.isResizing) {
                let mousePosition = (this.mousePosition = this.getPositionFromMouse(event));
                this.mouseDownCoord = this.pathData[this.pathData.length - 1];

                if (this.shift) {
                    mousePosition = this.lineService.angleBetweenLine(mousePosition, this.pathData[this.pathData.length - 1]);
                }

                // Drawing preview when mouse mouves
                if (!this.rejoinedOrigin) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.straigthLine(this.drawingService.previewCtx, mousePosition);
                }

                if (this.rejoinedOrigin) {
                    this.mouseMove = true;
                    this.mousePosition = this.getPositionFromMouse(event);
                    this.selectionInsideCanvas();

                    if (this.selected && !this.escapePressed && !this.gotCopied) {
                        this.drawingService.clearCanvas(this.drawingService.previewCtx);
                        this.selectionBox(
                            this.imagePosition.x - SIZE_ADJUSTMENT_THREE,
                            this.imagePosition.y - SIZE_ADJUSTMENT_THREE,
                            this.rectangleWidth + SIZE_ADJUSTMENT_THREE * 2,
                            this.rectangleHeight + SIZE_ADJUSTMENT_THREE * 2,
                            true,
                        );
                        this.putImage();
                        this.eraseImage();
                    } else if (this.selected && !this.escapePressed && this.gotCopied) {
                        this.drawingService.clearCanvas(this.drawingService.previewCtx);
                        if (this.magnetismOn) {
                            this.magnetismControlPoint();
                        }
                        this.selectionBox(
                            this.imagePosition.x - SIZE_ADJUSTMENT_THREE,
                            this.imagePosition.y - SIZE_ADJUSTMENT_THREE,
                            this.imageDataCopiedLasso.width + SIZE_ADJUSTMENT_THREE * 2,
                            this.imageDataCopiedLasso.height + SIZE_ADJUSTMENT_THREE * 2,
                            true,
                        );
                        this.putImage();
                        if (!this.gotCopied) {
                            this.eraseImage();
                        }
                    }
                }
            } else {
                console.log('resing', this.isResizing);
                const positionOnControlePoint = this.getPositionFromMouse(event);
                this.drawImagePrewiewCtx(positionOnControlePoint);
            }
        }
    }

    onShiftDown(event: KeyboardEvent): void {
        this.shift = event.shiftKey;
        const coords = this.lineService.angleBetweenLine(this.mousePosition, this.pathData[this.pathData.length - 1]);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.straigthLine(this.drawingService.previewCtx, coords);
    }

    onShiftUp(event: KeyboardEvent): void {
        this.shift = event.shiftKey;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.straigthLine(this.drawingService.previewCtx, this.mousePosition);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'm') {
            this.magnetismOn = !this.magnetismOn;
        }
    }

    reachedEnd(): void {
        this.endLine = true;
        this.pathData.pop();
        this.pathData.pop();
        this.pathData.push(this.pathData[0]);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.pasteCanvas();
        this.lineService.line(this.drawingService.baseCtx, this.pathData);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    gotResized(): void {
        this.imageData = this.drawingService.previewCtx.getImageData(
            this.imageResisedPos[1].x,
            this.imageResisedPos[1].y,
            this.imageResisedPos[0].x,
            this.imageResisedPos[0].y,
        );
        this.isResizing = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        // this.drawingService.previewCtx.putImageData(this.imageData, this.imageResisedPos[1].x, this.imageResisedPos[1].y);
        this.imagePosition.x = this.imageResisedPos[1].x;
        this.imagePosition.y = this.imageResisedPos[1].y;
        this.first = true;
        this.isResised = true;
    }

    /// ----------------------------------
    pasteCanvas(): void {
        this.shortcutDisabledLasso = true;
        this.gotCopied = true;
        this.pasted = true;
        if (this.isCopied) {
            this.drawImageBaseCtx(this.imageData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.putImageData(this.imageDataCopiedLasso, START_LEFT_CORNER, START_LEFT_CORNER);

            this.selected = true;
            this.imagePosition = { x: START_LEFT_CORNER, y: START_LEFT_CORNER };
            // rectangle border preview for selection
            this.selectionBox(
                this.imagePosition.x - SIZE_ADJUSTMENT_THREE,
                this.imagePosition.y - SIZE_ADJUSTMENT_THREE,
                this.imageDataCopiedLasso.width + SIZE_ADJUSTMENT_THREE * 2,
                this.imageDataCopiedLasso.height + SIZE_ADJUSTMENT_THREE * 2,
                false,
            );
            this.controlPoint({ x: this.imagePosition.x - 2, y: this.imagePosition.y - 2 });
            // this.putImage();

            this.imageData = this.imageDataCopiedLasso;
            this.selected = false;
            this.cutImage = false;
        }
    }

    cutCanvas(): void {
        this.rectangleMin.x = this.imagePosition.x;
        this.rectangleMin.y = this.imagePosition.y;
        this.shortcutDisabledLasso = true;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selected = false;
        this.erasePolygon();
        this.eraseImage();
        this.selectedBtn = false;
        this.pasted = false;
        this.cutImage = true;
    }

    copyCanvas(): void {
        this.shortcutDisabledLasso = true;
        this.imageDataCopiedLasso = this.imageData;
        this.isCopied = true;
        this.pasted = false;
        this.cutImage = false;
    }

    // --------------------------------------------
    onBackspace(event: KeyboardEvent): void {
        if (this.pathData.length > 0) {
            this.pathData.pop();
        }

        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if (this.pathData.length >= 1) {
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
        }

        // Instant preview
        if (this.endLine === false) {
            this.mouseDownCoord = this.pathData[this.pathData.length - 1];
            this.straigthLine(this.drawingService.previewCtx, this.mousePosition);
        }

        this.drawingService.pasteCanvas();
        this.lineService.line(this.drawingService.previewCtx, this.pathData);
    }

    onEscape(event: KeyboardEvent): void {
        if (!this.endLine) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.clearPath();
            this.drawingService.pasteCanvas();
            this.mouseDown = false;
            this.endLine = true;
        }
    }

    clearPath(): void {
        this.pathData = [];
    }

    straigthLine(ctx: CanvasRenderingContext2D, path: Vec2): void {
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.setLineDash([this.dotsSpace, this.dotsSpace]);
        ctx.moveTo(this.mouseDownCoord.x, this.mouseDownCoord.y); // point precedent
        ctx.lineTo(path.x, path.y); // current point
        ctx.stroke();
        ctx.strokeStyle = 'gray';
    }

    // maybe pas besoin????
    twentyPxFromInitial(): boolean {
        if (
            Math.sqrt(
                Math.pow(this.pathData[this.pathData.length - 1].x - this.pathData[0].x, 2) +
                    Math.pow(this.pathData[this.pathData.length - 1].y - this.pathData[0].y, 2),
            ) <= this.twentyPxInitialPoint
        ) {
            return true;
        } else {
            return false;
        }
    }

    selectionRectangle(ctx: CanvasRenderingContext2D): void {
        let minX = this.pathData[0].x;
        let maxX = this.pathData[0].x;
        let minY = this.pathData[0].y;
        let maxY = this.pathData[0].y;

        for (let i = 0; i < this.pathData.length; i++) {
            if (minX >= this.pathData[i].x) {
                minX = this.pathData[i].x;
            }
            if (maxX <= this.pathData[i].x) {
                maxX = this.pathData[i].x;
            }
            if (minY >= this.pathData[i].y) {
                minY = this.pathData[i].y;
            }
            if (maxY <= this.pathData[i].y) {
                maxY = this.pathData[i].y;
            }
            if (
                Math.sqrt(
                    Math.pow(this.pathData[this.pathData.length - 1].x - this.pathData[0].x, 2) +
                        Math.pow(this.pathData[this.pathData.length - 1].y - this.pathData[0].y, 2),
                ) <= this.twentyPxInitialPoint &&
                i >= MIN_NUMBER_LINES
            ) {
                this.pathData[this.pathData.length - 1] = this.pathData[0];
                this.rejoinedOrigin = true;
            }
            if (this.pathData.length === 2 && this.rejoinedOrigin) {
                this.pathData = [];
                this.drawingService.previewCtx.setLineDash([]);
                this.drawingService.baseCtx.setLineDash([]);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                return;
            }
        }

        if (this.pathData.length >= MIN_NUMBER_LINES && this.rejoinedOrigin) {
            this.rectangleMin = { x: minX, y: minY };
            this.rectangleWidth = maxX - minX;
            this.rectangleHeight = maxY - minY;
            if (!this.copied) {
                this.copyRect();
                this.isSelecting = true;
            }
            this.selectionBox(
                minX - SIZE_ADJUSTMENT_THREE,
                minY - SIZE_ADJUSTMENT_THREE,
                maxX - minX + SIZE_ADJUSTMENT_THREE * 2,
                maxY - minY + SIZE_ADJUSTMENT_THREE * 2,
                false,
            );
            this.controlPoint({ x: minX - SIZE_ADJUSTMENT_THREE, y: minY - SIZE_ADJUSTMENT_THREE });
        }
    }

    copyRect(): void {
        this.imageData = this.drawingService.baseCtx.getImageData(
            this.rectangleMin.x,
            this.rectangleMin.y,
            this.rectangleWidth,
            this.rectangleHeight,
        );
        this.isInPolygon(this.mousePosition);
        this.erasePolygon();
        this.imagePosition.x = this.rectangleMin.x;
        this.imagePosition.y = this.rectangleMin.y;
        console.log(this.imagePosition, 'copyrecrtimagePOS');
        this.drawingService.previewCtx.putImageData(this.imageData, this.imagePosition.x, this.imagePosition.y);
        this.copied = true;
    }
    // when pressing outside the selection box
    putImage(): void {
        this.imagePosition.x = this.mousePosition.x - this.imageData.width / 2;
        this.imagePosition.y = this.mousePosition.y - this.imageData.height / 2;
        this.drawingService.previewCtx.putImageData(this.imageData, this.imagePosition.x, this.imagePosition.y);
    }

    eraseImage(): void {
        this.erasedPosition.x = this.rectangleMin.x;
        this.erasedPosition.y = this.rectangleMin.y;
        this.drawingService.baseCtx.putImageData(this.erasedImage, this.erasedPosition.x, this.erasedPosition.y);
    }

    isSelected(position: Vec2): boolean {
        const positionImageBeginX = this.imagePosition.x;
        const positionImageBeginY = this.imagePosition.y;

        const positionImageEndX = this.imagePosition.x + this.imageData.width;
        const positionImageEndY = this.imagePosition.y + this.imageData.height;
        if (
            !this.escapePressed &&
            positionImageBeginX < position.x &&
            positionImageBeginY < position.y &&
            position.x < positionImageEndX &&
            position.y < positionImageEndY
        ) {
            this.selected = true;
            return true;
        }
        return false;
    }

    drawImageBaseCtx(image: ImageData): void {
        const imageCopy = image;
        const imagePosX = this.imagePosition.x;
        const imagePosY = this.imagePosition.y;
        const copiedCanvas = this.drawingService.previewCanvas.toDataURL();
        this.imageCanvas = new Image();
        this.imageCanvas.src = copiedCanvas;
        let imageWidth: number;
        let imageHeight: number;
        imageWidth = imageCopy.width;
        imageHeight = imageCopy.height;
        this.imageCanvas.onload = () => {
            this.drawingService.baseCtx.drawImage(
                this.imageCanvas,
                imagePosX,
                imagePosY,
                imageWidth,
                imageHeight,
                imagePosX,
                imagePosY,
                imageWidth,
                imageHeight,
            );
        };
    }

    selectionInsideCanvas(): void {
        if (this.mousePosition.x > this.drawingService.canvas.width && this.mousePosition.y > this.drawingService.canvas.height) {
            this.mousePosition.x = this.drawingService.canvas.width;
            this.mousePosition.y = this.drawingService.canvas.height;
        } else {
            switch (true) {
                case this.mousePosition.x > this.drawingService.canvas.width: {
                    this.mousePosition.x = this.drawingService.canvas.width;
                    break;
                }
                case this.mousePosition.y > this.drawingService.canvas.height: {
                    this.mousePosition.y = this.drawingService.canvas.height;
                    break;
                }
            }
        }
    }
    erasePolygon(): void {
        this.erasedImage = this.drawingService.baseCtx.getImageData(
            this.rectangleMin.x,
            this.rectangleMin.y,
            this.rectangleWidth,
            this.rectangleHeight,
        );
        for (let row = 0; row < this.rectangleWidth; row++) {
            for (let column = 0; column < this.rectangleHeight; column++) {
                const index = (column * this.erasedImage.width + row) * RGBA_LENGTH;
                if (this.isInsideShape(this.pathData.length - 1, this.pathData, { x: row + this.rectangleMin.x, y: column + this.rectangleMin.y })) {
                    this.erasedImage.data[index] = WHITE_PIXEL;
                    this.erasedImage.data[index + 1] = WHITE_PIXEL;
                    this.erasedImage.data[index + 2] = WHITE_PIXEL;
                    this.erasedImage.data[index + SIZE_ADJUSTMENT_THREE] = WHITE_PIXEL;
                }
            }
        }
        this.imagePosition.x = this.rectangleMin.x;
        this.imagePosition.y = this.rectangleMin.x;
        this.drawImageBaseCtx(this.erasedImage);
    }

    isInPolygon(mousePosition: Vec2): void {
        this.selectedBtn = true;
        const image: ImageData = this.drawingService.baseCtx.getImageData(
            this.rectangleMin.x,
            this.rectangleMin.y,
            this.rectangleWidth,
            this.rectangleHeight,
        );
        for (let row = 0; row < this.rectangleWidth; row++) {
            for (let column = 0; column < this.rectangleHeight; column++) {
                const index = (column * image.width + row) * RGBA_LENGTH;
                if (!this.isInsideShape(this.pathData.length - 1, this.pathData, { x: row + this.rectangleMin.x, y: column + this.rectangleMin.y })) {
                    // if outside polygone
                    this.imageData.data[index] = image.data[index];
                    this.imageData.data[index + 1] = image.data[index + 1];
                    this.imageData.data[index + 2] = image.data[index + 2];
                    this.imageData.data[index + SIZE_ADJUSTMENT_THREE] = 0;
                }
            }
        }
    }
    // nbVertices = this.pathData.length
    isInsideShape(nbVertices: number, pathVertices: Vec2[], points: Vec2): boolean {
        let isOutside = false;
        let i = 0;
        let j = 0;
        for (i = 0, j = nbVertices - 1; i < nbVertices; j = i++) {
            // tslint:disable-next-line: no-conditional-assignment
            if (
                pathVertices[i].y > points.y !== pathVertices[j].y > points.y &&
                points.x <
                    ((pathVertices[j].x - pathVertices[i].x) * (points.y - pathVertices[i].y)) / (pathVertices[j].y - pathVertices[i].y) +
                        pathVertices[i].x
            ) {
                // inside polygon = true
                isOutside = !isOutside;
            }
        }
        return isOutside;
    }

    selectionBox(coordX: number, coordY: number, width: number, height: number, lineFill: boolean): void {
        if (lineFill) {
            this.drawingService.previewCtx.setLineDash([1, LINE_DASH_FIVE]);
        } else {
            this.drawingService.previewCtx.setLineDash([]);
        }
        this.drawingService.previewCtx.lineWidth = SIZE_ADJUSTMENT_THREE;
        this.drawingService.previewCtx.strokeStyle = '#FF0000';
        this.drawingService.previewCtx.strokeRect(coordX, coordY, width, height);
        // this.controlPoint({ x: coordX, y: coordY });
    }

    drawImagePrewiewCtx(positionOnControlePoint: Vec2): void {
        const image = this.imageData;
        console.log(this.imageData);
        const imagePos = this.imagePosition;
        console.log(image.width, image.height);
        this.imageResisedPos = this.resizeService.resizeImage(this.imagePosition, positionOnControlePoint, image.width, image.height, false);
        console.log('imageResisedPos', this.imageResisedPos);
        if (this.first) {
            this.drawingService.previewCtx.putImageData(this.imageData, this.imagePosition.x, this.imagePosition.y);
            this.copiedCanvas = this.drawingService.previewCanvas.toDataURL();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.first = false;
        }
        this.imageCanvas = new Image();
        this.imageCanvas.src = this.copiedCanvas;
        let imageWidth: number;
        let imageHeight: number;
        imageWidth = image.width;
        imageHeight = image.height;
        console.log(imagePos, 'imabgePos', this.imagePosition, 'this.imagePosition');
        this.imageCanvas.onload = () => {
            this.onloadImageCanvas(imagePos, imageWidth, imageHeight);
        };
    }

    onloadImageCanvas(imagePos: Vec2, imageWidth: number, imageHeight: number): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.drawImage(
            this.imageCanvas,
            imagePos.x,
            imagePos.y,
            imageWidth,
            imageHeight,
            this.imageResisedPos[1].x,
            this.imageResisedPos[1].y,
            this.imageResisedPos[0].x,
            this.imageResisedPos[0].y,
        );
        this.selectionBox(this.imageResisedPos[1].x, this.imageResisedPos[1].y, this.imageResisedPos[0].x, this.imageResisedPos[0].y, true);
    }

    // magnetism
    controlPoint(imagePosition: Vec2): void {
        let width;
        let height;
        if (!this.gotCopied) {
            width = this.rectangleWidth;
            height = this.rectangleHeight;
        } else {
            width = this.imageDataCopiedLasso.width;
            height = this.imageDataCopiedLasso.height;
        }
        if (!this.continuousMouvment) {
            this.drawingService.previewCtx.fillStyle = '#0000FF';
            this.drawingService.previewCtx.fillRect(
                imagePosition.x - SIZE_ADJUSTMENT_TWO * SIZE_ADJUSTMENT_THREE,
                imagePosition.y - SIZE_ADJUSTMENT_TWO * SIZE_ADJUSTMENT_THREE,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
            this.drawingService.previewCtx.fillRect(
                imagePosition.x + width / 2 - SIZE_ADJUSTMENT_EIGHT,
                imagePosition.y - SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
            this.drawingService.previewCtx.fillRect(
                imagePosition.x + width + SIZE_ADJUSTMENT_TWO * SIZE_ADJUSTMENT_THREE,
                imagePosition.y - SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
            this.drawingService.previewCtx.fillRect(
                imagePosition.x - SIZE_ADJUSTMENT_EIGHT,
                imagePosition.y + height / 2 - SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
            this.drawingService.previewCtx.fillRect(
                imagePosition.x - SIZE_ADJUSTMENT_EIGHT,
                imagePosition.y + height + SIZE_ADJUSTMENT_TWO * SIZE_ADJUSTMENT_THREE,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
            this.drawingService.previewCtx.fillRect(
                imagePosition.x + width + SIZE_ADJUSTMENT_TWO * 2,
                imagePosition.y + height / 2 - SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
            this.drawingService.previewCtx.fillRect(
                imagePosition.x + width + SIZE_ADJUSTMENT_TWO * 2,
                imagePosition.y + height + SIZE_ADJUSTMENT_TWO * 2,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
            this.drawingService.previewCtx.fillRect(
                imagePosition.x + width / 2 - SIZE_ADJUSTMENT_EIGHT,
                imagePosition.y + height + SIZE_ADJUSTMENT_TWO * 2,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
        }
    }

    selectControlPoint(): void {
        this.controlPoint(this.imagePosition);
        let width;
        let height;
        width = this.imageData.width;
        height = this.imageData.height;
        if (this.magnetismOn) {
            switch (true) {
                case this.magnetism.middle: {
                    this.drawingService.previewCtx.fillStyle = '#00FF00';
                    this.drawingService.previewCtx.fillRect(
                        this.imagePosition.x + width / 2 - SIZE_ADJUSTMENT_EIGHT,
                        this.imagePosition.y + height / 2 - SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                    );
                    break;
                }
                case this.magnetism.leftUp: {
                    this.drawingService.previewCtx.fillStyle = '#00FF00';
                    this.drawingService.previewCtx.fillRect(
                        this.imagePosition.x - SIZE_ADJUSTMENT_EIGHT,
                        this.imagePosition.y - SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                    );
                    break;
                }
                case this.magnetism.leftDown: {
                    this.drawingService.previewCtx.fillStyle = '#00FF00';
                    this.drawingService.previewCtx.fillRect(
                        this.imagePosition.x - SIZE_ADJUSTMENT_EIGHT,
                        this.imagePosition.y + height,
                        SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                    );
                    break;
                }
                case this.magnetism.rightDown: {
                    this.drawingService.previewCtx.fillStyle = '#00FF00';
                    this.drawingService.previewCtx.fillRect(
                        this.imagePosition.x + width,
                        this.imagePosition.y + height,
                        SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                    );
                    break;
                }
                case this.magnetism.rightUp: {
                    this.drawingService.previewCtx.fillStyle = '#00FF00';
                    this.drawingService.previewCtx.fillRect(
                        this.imagePosition.x + width,
                        this.imagePosition.y - SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                    );
                    break;
                }
                case this.magnetism.middleUp: {
                    this.drawingService.previewCtx.fillStyle = '#00FF00';
                    this.drawingService.previewCtx.fillRect(
                        this.imagePosition.x + width / 2 - SIZE_ADJUSTMENT_EIGHT,
                        this.imagePosition.y - SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                    );
                    break;
                }
                case this.magnetism.middleDown: {
                    this.drawingService.previewCtx.fillStyle = '#00FF00';
                    this.drawingService.previewCtx.fillRect(
                        this.imagePosition.x + width / 2 - SIZE_ADJUSTMENT_EIGHT,
                        this.imagePosition.y + height,
                        SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                    );
                    break;
                }
                case this.magnetism.leftMiddle: {
                    this.drawingService.previewCtx.fillStyle = '#00FF00';
                    this.drawingService.previewCtx.fillRect(
                        this.imagePosition.x - SIZE_ADJUSTMENT_EIGHT,
                        this.imagePosition.y + height / 2 - SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                    );
                    break;
                }
                case this.magnetism.rightMiddle: {
                    this.drawingService.previewCtx.fillStyle = '#00FF00';
                    this.drawingService.previewCtx.fillRect(
                        this.imagePosition.x + width,
                        this.imagePosition.y + height / 2 - SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                        SIZE_ADJUSTMENT_EIGHT,
                    );
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    magnetismControlPoint(): void {
        this.mousePosition = this.magnetism.magnetismControlPoint(this.mousePosition, this.imageData, 0, false, false);
    }

    magnetismArrow(): void {
        this.imagePosition = this.magnetism.magnetismArrow(this.imagePosition, this.imageData);
    }
    // tslint:disable-next-line: max-file-line-count
}

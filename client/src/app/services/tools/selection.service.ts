import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { SelectionAction } from '@app/classes/selection-action';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import {
    BORDER_BOX_SELECTION,
    HUNDRED,
    INDEX_FOUR,
    LASTDATE,
    LINE_DASH_FIVE,
    SIZE_ADJUSTMENT_EIGHT,
    SIZE_ADJUSTMENT_FIFTEEN,
    SIZE_ADJUSTMENT_FOUR,
    SIZE_ADJUSTMENT_THREE,
    SIZE_ADJUSTMENT_TWO,
    START_LEFT_CORNER,
} from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { ResizeSelectionService } from '@app/services/tools/resize-selection.service';
import { UndoRedoService } from './undo-redo.service';
@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    private resizeService: ResizeSelectionService = new ResizeSelectionService();
    magnetism: MagnetismService = new MagnetismService(this.gridService);

    imageChanged: boolean = false;

    mouseDown: boolean = false;
    // tslint:disable-next-line: typedef
    mouseDownCoord = {} as Vec2;
    mouseMove: boolean = false;
    // tslint:disable-next-line: typedef
    mousePosition = {} as Vec2;
    // tslint:disable-next-line: typedef
    private selectedPosition = {} as Vec2;
    // tslint:disable-next-line: typedef
    imagePosition = {} as Vec2;
    // tslint:disable-next-line: typedef
    imageData = {} as ImageData;
    selected: boolean = false;
    selectionOption: boolean = true;
    private escapePressed: boolean = false;
    private square: boolean = false;
    private squareDistance: number;
    private selectAll: boolean = false;
    isSelecting: boolean = false;
    private isDrawingCircle: boolean = false;
    copied: boolean = false;
    private date: number;
    private lastDate: number;
    private arrow: boolean = false;
    private circleDiameter: number = 0;
    arrowUp: boolean = false;
    arrowDown: boolean = false;
    arrowLeft: boolean = false;
    arrowRight: boolean = false;
    // tslint:disable-next-line: typedef
    diameter = {} as Vec2;
    // tslint:disable-next-line: typedef
    radius = {} as Vec2;
    // tslint:disable-next-line: typedef
    center = {} as Vec2;
    // tslint:disable-next-line: typedef
    private circleCenter = {} as Vec2;
    private circleRadius: number = 0;
    private isResised: boolean = false;

    private circle: boolean = false;
    // tslint:disable-next-line: typedef
    continuousMouvment = false;
    width: number = 5;
    private imageCanvas: HTMLImageElement;
    squareDiameter: number;
    isResizing: boolean;
    private copiedCanvas: string;
    private first: boolean = true;
    // tslint:disable-next-line: typedef
    imageResisedPos = [{ x: 0, y: 0 }];
    // tslint:disable-next-line: typedef
    oldImagePosition = {} as Vec2;
    isPasted: boolean = false;
    isCopied: boolean = false;
    resizeBothCorner: boolean = false;

    private selectionAction: SelectionAction;

    // manipulations
    imageDataCopied: ImageData;
    shortcutDisabled: boolean = false;
    selectedBtn: boolean = false;
    private counter: number = 0;
    cutImage: boolean = false;

    // magnetism
    selectedMagnetismPoint: Vec2;
    isChosen: boolean = false;
    magnetismOn: boolean = false;
    magnetismPointValue: Vec2;

    imagePositionAction: Vec2;

    constructor(drawingService: DrawingService, private undoRedoService: UndoRedoService, private gridService: GridService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.selectedPosition = this.getPositionFromMouse(event);
            if (this.isSelecting) {
                let width = this.imageData.width;
                let height = this.imageData.height;
                if (this.isDrawingCircle && !this.isResised) {
                    width = this.circleDiameter;
                    height = this.circleDiameter;
                }
                this.isResizing = this.resizeService.isOnControlePoint(this.selectedPosition, this.imagePosition, width, height);
            }

            if (!this.isSelected(this.selectedPosition) && this.mouseMove && this.isSelecting && !this.isResizing) {
                if (this.imageChanged && !this.isResised) {
                    this.putImage();
                    this.imageChanged = false;
                } else if (this.isResised) this.drawingService.previewCtx.putImageData(this.imageData, this.imagePosition.x, this.imagePosition.y);
                else this.drawingService.previewCtx.putImageData(this.imageData, this.mouseDownCoord.x, this.mouseDownCoord.y);

                this.drawImageBaseCtx();
                this.initialiseData();
                this.first = true;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.selectedBtn = false;
                this.counter = 0;
            }
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.selectAll = false;
            this.mouseMove = false;
        }
    }
    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown && !this.isResizing) {
            this.mouseMove = true;
            this.arrow = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mousePosition = this.getPositionFromMouse(event);
            this.selectionInsideCanvas();
            if (!this.selected) {
                if (!this.selectionOption) {
                    if (this.mouseDownCoord.x > this.mousePosition.x || this.mouseDownCoord.y > this.mousePosition.y) return;
                    else this.ellipseSelection(this.drawingService.previewCtx);
                }
                this.rectangleSelection(this.drawingService.previewCtx, true);
            } else if (!this.escapePressed) {
                if (this.magnetismOn) {
                    this.magnetismControlPoint();
                }
                this.boundingBox(true);
                this.putImage();
            }
        } else if (this.mouseDown && this.isResizing) {
            this.mouseMove = true;
            const positionOnControlePoint = this.getPositionFromMouse(event);
            this.drawImagePrewiewCtx(positionOnControlePoint);
        }
    }
    drawImagePrewiewCtx(positionOnControlePoint: Vec2): void {
        const image = this.imageData;
        const imagePos = this.imagePosition;
        let width = image.width;
        let height = image.height;
        if (this.isDrawingCircle) {
            width = this.circleDiameter;
            height = width;
        }
        this.imageResisedPos = this.resizeService.resizeImage(this.imagePosition, positionOnControlePoint, width, height, this.resizeBothCorner);
        if (this.first) {
            this.drawingService.previewCtx.putImageData(this.imageData, this.imagePosition.x, this.imagePosition.y);
            this.copiedCanvas = this.drawingService.previewCanvas.toDataURL();
            this.first = false;
        }
        this.imageCanvas = new Image();
        this.imageCanvas.src = this.copiedCanvas;
        this.imageCanvas.onload = () => {
            this.onloadImageCanvas(imagePos, width, height);
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
        this.boundingBox(true);
    }
    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        if (this.isResizing) {
            this.imageData = this.drawingService.previewCtx.getImageData(
                this.imageResisedPos[1].x,
                this.imageResisedPos[1].y,
                Math.abs(this.imageResisedPos[0].x),
                Math.abs(this.imageResisedPos[0].y),
            );
            this.isResizing = false;
            this.isResised = true;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.drawingService.previewCtx.putImageData(this.imageData, this.imageResisedPos[1].x, this.imageResisedPos[1].y);
            this.imagePositionAction = this.imagePosition;

            this.imagePosition.x = this.imageResisedPos[1].x;
            this.imagePosition.y = this.imageResisedPos[1].y;
            this.isDrawingCircle = false;
            this.first = true;
        } else {
            if (this.mouseMove && this.selected) {
                this.putImage();
            } else {
                if (this.mouseMove && !this.copied && this.selectionOption) this.copyRect(this.drawingService.baseCtx);
                else if (this.mouseMove && !this.copied && !this.selectionOption) {
                    if (this.mouseDownCoord.x > this.mousePosition.x || this.mouseDownCoord.y > this.mousePosition.y) return;
                    if (this.circle) this.copyCircle();
                    else this.copyEllipse();
                }
                this.isSelecting = true;
            }
        }

        this.boundingBox(false);
        this.selectControlPoint();
        this.selectionAction = new SelectionAction(
            this.drawingService,
            this,
            this.imageData,
            this.mousePosition,
            this.diameter,
            this.imagePosition,
            this.mouseDownCoord,
            this.selected,
            this.selectionOption,
            this.copied,
            this.center,
            this.radius,
            this.cutImage,
            this.isPasted,
            this.imageDataCopied,
            this.isResizing,
            this.imageResisedPos,
        );
        this.undoRedoService.addAction(this.selectionAction);
    }

    // manipulations -------------------------------------------------------
    pasteCanvas(): void {
        this.shortcutDisabled = true;
        if (this.isCopied) {
            this.drawImageBaseCtx();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.putImageData(this.imageDataCopied, START_LEFT_CORNER, START_LEFT_CORNER);

            this.selected = true;
            this.imagePosition = { x: START_LEFT_CORNER, y: START_LEFT_CORNER };
            // rectangle border preview for selection
            this.drawingService.previewCtx.strokeRect(
                this.imagePosition.x - START_LEFT_CORNER,
                this.imagePosition.y - START_LEFT_CORNER,
                this.imageDataCopied.width + BORDER_BOX_SELECTION,
                this.imageDataCopied.height + BORDER_BOX_SELECTION,
            );

            this.imageData = this.imageDataCopied;
            this.controlePoint(this.imagePosition);
            this.counter++;
            this.cutImage = false;
            this.isPasted = true;
        }
    }

    cutCanvas(): void {
        this.shortcutDisabled = true;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selected = false;
        this.drawingService.baseCtx.fillStyle = 'white';
        if (this.selectionOption) {
            if (this.counter > 1) {
                this.drawingService.baseCtx.fillRect(START_LEFT_CORNER, START_LEFT_CORNER, this.diameter.x, this.diameter.y);
            } else {
                this.drawingService.baseCtx.fillRect(this.imagePosition.x, this.imagePosition.y, this.diameter.x, this.diameter.y);
            }
        } else {
            if (this.counter > 1) {
                this.drawingService.baseCtx.ellipse(
                    START_LEFT_CORNER,
                    START_LEFT_CORNER,
                    Math.abs(this.radius.x),
                    Math.abs(this.radius.y),
                    0,
                    0,
                    2 * Math.PI,
                );
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
        this.selectedBtn = false;
        this.cutImage = true; // for undo redo
        this.isPasted = false;
        console.log('delete image', this.cutImage);
    }

    copyCanvas(): void {
        this.shortcutDisabled = true;
        this.imageDataCopied = this.imageData;
        this.isCopied = true;
        this.cutImage = false;
        this.isPasted = false;
    }
    // ----------------------------------------------------------------------
    onEscape(escapeEvent: KeyboardEvent): void {
        this.escapePressed = true;
        if ((this.mouseMove && this.isSelecting) || (this.selectAll && this.isSelecting)) {
            this.putImage();
            this.drawImageBaseCtx();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.initialiseData();
        }
        this.isDrawingCircle = false;
        this.selectAll = false;
    }

    selectAllDrawing(): void {
        this.selectAll = true;
        this.copyRect(this.drawingService.baseCtx);
        this.isSelecting = true;
        this.escapePressed = false;
    }
    onShiftDown(event: KeyboardEvent): void {
        this.resizeBothCorner = true;
        if (!this.isResizing) {
            if (this.selectionOption) this.square = true;
            else {
                this.isDrawingCircle = true;
                this.circle = true;
            }
            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                if (!this.selectionOption) {
                    if (this.mouseDownCoord.x > this.mousePosition.x || this.mouseDownCoord.y > this.mousePosition.y) return;
                    else this.ellipseSelection(this.drawingService.previewCtx);
                }
                this.rectangleSelection(this.drawingService.previewCtx, true);
            }
        }
    }
    onShiftUp(event: KeyboardEvent): void {
        this.resizeBothCorner = false;
        if (!this.isResizing) {
            if (this.selectionOption) this.square = false;
            else this.circle = false;
            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.rectangleSelection(this.drawingService.previewCtx, true);
            }
        }
    }

    onArrow(event: KeyboardEvent): void {
        this.date = Date.now();
        if (this.date - this.lastDate < LASTDATE) {
            setTimeout(() => {
                this.switchKeyArrow(event, true);
            }, HUNDRED);
            this.continuousMouvment = true;
        } else this.switchKeyArrow(event, false);
    }

    // tslint:disable-next-line: cyclomatic-complexity
    switchKeyArrow(event: KeyboardEvent, lineDash: boolean): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        switch (event.key) {
            case 'ArrowUp': {
                if (this.magnetismOn) {
                    this.magnetismArrow();
                    this.imagePosition.y -= this.gridService.sizeOfSquares;

                    if (this.arrowRight) {
                        this.imagePosition.x += this.gridService.sizeOfSquares;
                    } else if (this.arrowLeft) {
                        this.imagePosition.x -= this.gridService.sizeOfSquares;
                    } else {
                        this.imagePosition.x = this.imagePosition.x;
                    }
                } else {
                    this.imagePosition.y = this.imagePosition.y - SIZE_ADJUSTMENT_THREE;
                    if (this.arrowRight) {
                        this.imagePosition.x = this.imagePosition.x + SIZE_ADJUSTMENT_THREE;
                    } else if (this.arrowLeft) {
                        this.imagePosition.x = this.imagePosition.x - SIZE_ADJUSTMENT_THREE;
                    } else {
                        this.imagePosition.x = this.imagePosition.x;
                    }
                    this.lastDate = Date.now();
                }
                break;
            }
            case 'ArrowDown': {
                if (this.magnetismOn) {
                    this.magnetismArrow();
                    this.imagePosition.y += this.gridService.sizeOfSquares;
                    if (this.arrowRight) {
                        this.imagePosition.x += this.gridService.sizeOfSquares;
                    } else if (this.arrowLeft) {
                        this.imagePosition.x -= this.gridService.sizeOfSquares;
                    } else {
                        this.imagePosition.x = this.imagePosition.x;
                    }
                } else {
                    this.imagePosition.y = this.imagePosition.y + SIZE_ADJUSTMENT_THREE;
                    if (this.arrowRight) {
                        this.imagePosition.x = this.imagePosition.x + SIZE_ADJUSTMENT_THREE;
                    } else if (this.arrowLeft) {
                        this.imagePosition.x = this.imagePosition.x - SIZE_ADJUSTMENT_THREE;
                    } else {
                        this.imagePosition.x = this.imagePosition.x;
                    }
                }
                this.lastDate = Date.now();
                break;
            }
            case 'ArrowLeft': {
                if (this.magnetismOn) {
                    this.magnetismArrow();
                    this.imagePosition.x -= this.gridService.sizeOfSquares;
                    if (this.arrowUp) {
                        this.imagePosition.y -= this.gridService.sizeOfSquares;
                    } else if (this.arrowDown) {
                        this.imagePosition.y += this.gridService.sizeOfSquares;
                    } else {
                        this.imagePosition.y = this.imagePosition.y;
                    }
                } else {
                    this.imagePosition.x = this.imagePosition.x - SIZE_ADJUSTMENT_THREE;
                    if (this.arrowUp) {
                        this.imagePosition.y = this.imagePosition.y - SIZE_ADJUSTMENT_THREE;
                    } else if (this.arrowDown) {
                        this.imagePosition.y = this.imagePosition.y + SIZE_ADJUSTMENT_THREE;
                    } else {
                        this.imagePosition.y = this.imagePosition.y;
                    }
                }
                this.lastDate = Date.now();

                break;
            }
            case 'ArrowRight': {
                if (this.magnetismOn) {
                    this.magnetismArrow();
                    this.imagePosition.x += this.gridService.sizeOfSquares;
                    if (this.arrowUp) {
                        this.imagePosition.y -= this.gridService.sizeOfSquares;
                    } else if (this.arrowDown) {
                        this.imagePosition.y += this.gridService.sizeOfSquares;
                    } else {
                        this.imagePosition.y = this.imagePosition.y;
                    }
                } else {
                    this.imagePosition.x = this.imagePosition.x + SIZE_ADJUSTMENT_THREE;
                    if (this.arrowUp) {
                        this.imagePosition.y = this.imagePosition.y - SIZE_ADJUSTMENT_THREE;
                    } else if (this.arrowDown) {
                        this.imagePosition.y = this.imagePosition.y + SIZE_ADJUSTMENT_THREE;
                    } else {
                        this.imagePosition.y = this.imagePosition.y;
                    }
                }
                this.lastDate = Date.now();
                break;
            }
        }
        this.arrow = true;
        this.putImage();
        this.boundingBox(lineDash);
    }

    drawImageBaseCtx(): void {
        const image = this.imageData;
        const imagePosX = this.imagePosition.x;
        const imagePosY = this.imagePosition.y;
        const copiedCanvas = this.drawingService.previewCanvas.toDataURL();
        this.imageCanvas = new Image();
        this.imageCanvas.src = copiedCanvas;
        let imageWidth: number;
        let imageHeight: number;
        if (this.isDrawingCircle) {
            imageWidth = this.circleDiameter;
            imageHeight = this.circleDiameter;
        } else {
            imageWidth = image.width;
            imageHeight = image.height;
        }
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
    getEllipseImageData(mousePosX: number, mousePosY: number): void {
        let row: number;
        let column: number;
        const baseImageData: ImageData = this.drawingService.baseCtx.getImageData(mousePosX, mousePosY, this.diameter.x, this.diameter.y);
        for (row = 0; row < this.diameter.x; row++) {
            for (column = 0; column < this.diameter.y; column++) {
                if (!this.isInsideEllipseData(row, column, this.diameter.x / 2, this.diameter.y / 2, this.diameter.x / 2, this.diameter.y / 2)) {
                    const index: number = (column * this.diameter.x + row) * INDEX_FOUR;
                    // pour extraire pixel
                    this.imageData.data[index] = baseImageData.data[index]; // rgb
                    this.imageData.data[index + 1] = baseImageData.data[index + 1]; // rgb
                    this.imageData.data[index + 2] = baseImageData.data[index + 2]; // rgb
                    this.imageData.data[index + SIZE_ADJUSTMENT_THREE] = 0; // alpha
                }
            }
        }
    }

    getCircleImageData(mousePosX: number, mousePosY: number): void {
        let radius;
        let row: number;
        let column: number;
        const baseImageData: ImageData = this.drawingService.baseCtx.getImageData(mousePosX, mousePosY, this.diameter.x, this.diameter.y);
        if (this.radius.x > this.radius.y) radius = this.radius.y;
        else radius = this.radius.x;
        for (row = 0; row < this.diameter.x; row++) {
            for (column = 0; column < this.diameter.y; column++) {
                if (!this.isInsideCircleData(row, column, radius, radius, radius)) {
                    const index: number = (column * this.diameter.x + row) * INDEX_FOUR;
                    this.imageData.data[index] = baseImageData.data[index];
                    this.imageData.data[index + 1] = baseImageData.data[index + 1];
                    this.imageData.data[index + 2] = baseImageData.data[index + 2];
                    this.imageData.data[index + SIZE_ADJUSTMENT_THREE] = 0;
                }
            }
        }
    }

    isInsideEllipseData(line: number, column: number, circleCenterX: number, circleCenterY: number, radiusX: number, radiusY: number): boolean {
        return Math.pow(line - circleCenterX, 2) / Math.pow(radiusX, 2) + Math.pow(column - circleCenterY, 2) / Math.pow(radiusY, 2) <= 1;
    }
    isInsideCircleData(line: number, column: number, circleCenterX: number, circleCenterY: number, radius: number): boolean {
        return Math.sqrt(Math.pow(line - circleCenterX, 2) + Math.pow(column - circleCenterY, 2)) <= radius;
    }

    initialiseData(): void {
        this.imagePosition = {} as Vec2;
        this.imageData = {} as ImageData;
        this.mousePosition = {} as Vec2;
        this.copied = false;
        this.isSelecting = false;
        this.mouseMove = false;
        this.escapePressed = false;
        this.selected = false;
        this.arrow = false;
        this.arrowUp = false;
        this.arrowDown = false;
        this.arrowLeft = false;
        this.arrowRight = false;
        this.isDrawingCircle = false;
        this.isResised = false;
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
    rectangleSelection(ctx: CanvasRenderingContext2D, strokeStyle: boolean): void {
        this.diameter.x = this.mousePosition.x - this.mouseDownCoord.x;
        this.diameter.y = this.mousePosition.y - this.mouseDownCoord.y;

        if (strokeStyle) {
            ctx.strokeStyle = 'black';
        }
        ctx.setLineDash([1, LINE_DASH_FIVE]);
        ctx.lineWidth = 1;
        if (this.circle) ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.circleDiameter, this.circleDiameter);
        else if (this.square) ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.diameter.x, this.diameter.x);
        else ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.diameter.x, this.diameter.y);
    }

    boundingBox(lineDash: boolean): void {
        if (lineDash) this.drawingService.previewCtx.setLineDash([1, LINE_DASH_FIVE]);
        else this.drawingService.previewCtx.setLineDash([]);
        this.drawingService.previewCtx.lineWidth = SIZE_ADJUSTMENT_THREE;
        this.drawingService.previewCtx.strokeStyle = '#FF0000';
        let imagePosX;
        let imagePosY;
        let imageDiameterX;
        let imageDiameterY;
        if (this.isResizing) {
            imagePosX = this.imageResisedPos[1].x - SIZE_ADJUSTMENT_FOUR;
            imagePosY = this.imageResisedPos[1].y - SIZE_ADJUSTMENT_FOUR;
            imageDiameterX = this.imageResisedPos[0].x + SIZE_ADJUSTMENT_EIGHT;
            imageDiameterY = this.imageResisedPos[0].y + SIZE_ADJUSTMENT_EIGHT;
        } else {
            imagePosX = this.imagePosition.x - SIZE_ADJUSTMENT_FOUR;
            imagePosY = this.imagePosition.y - SIZE_ADJUSTMENT_FOUR;
            imageDiameterX = this.imageData.width + SIZE_ADJUSTMENT_EIGHT;
            imageDiameterY = this.imageData.height + SIZE_ADJUSTMENT_EIGHT;
            if (this.circle || this.isDrawingCircle) {
                imageDiameterX = this.circleDiameter + SIZE_ADJUSTMENT_EIGHT;
                imageDiameterY = this.circleDiameter + SIZE_ADJUSTMENT_EIGHT;
            }
        }
        this.drawingService.previewCtx.strokeRect(imagePosX, imagePosY, imageDiameterX, imageDiameterY);
        if (!lineDash) this.controlePoint(this.imagePosition);
    }
    controlePoint(imagePosition: Vec2): void {
        let width;
        let height;
        if (this.circle || (this.isDrawingCircle && !this.isResised)) {
            width = this.circleDiameter;
            height = this.circleDiameter;
        } else {
            width = this.imageData.width;
            height = this.imageData.height;
        }
        if (!this.continuousMouvment) {
            this.drawingService.previewCtx.fillStyle = '#0000FF';
            this.drawingService.previewCtx.fillRect(
                imagePosition.x - SIZE_ADJUSTMENT_EIGHT,
                imagePosition.y - SIZE_ADJUSTMENT_EIGHT,
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
                imagePosition.x + width,
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
                imagePosition.y + height,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
            this.drawingService.previewCtx.fillRect(
                imagePosition.x + width + SIZE_ADJUSTMENT_TWO,
                imagePosition.y + height / 2 - SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
            this.drawingService.previewCtx.fillRect(imagePosition.x + width, imagePosition.y + height, SIZE_ADJUSTMENT_EIGHT, SIZE_ADJUSTMENT_EIGHT);
            this.drawingService.previewCtx.fillRect(
                imagePosition.x + width / 2 - SIZE_ADJUSTMENT_EIGHT,
                imagePosition.y + height + SIZE_ADJUSTMENT_TWO,
                SIZE_ADJUSTMENT_EIGHT,
                SIZE_ADJUSTMENT_EIGHT,
            );
            if (!this.isResizing) {
                this.drawingService.previewCtx.fillRect(
                    imagePosition.x + width / 2 - SIZE_ADJUSTMENT_EIGHT,
                    imagePosition.y + height / 2 - SIZE_ADJUSTMENT_EIGHT,
                    SIZE_ADJUSTMENT_EIGHT,
                    SIZE_ADJUSTMENT_EIGHT,
                );
            }
        }
    }
    ellipseSelection(ctx: CanvasRenderingContext2D): void {
        this.diameter.x = this.mousePosition.x - this.mouseDownCoord.x;
        this.diameter.y = this.mousePosition.y - this.mouseDownCoord.y;
        this.radius.x = this.diameter.x / 2;
        this.radius.y = this.diameter.y / 2;
        this.center.x = this.mouseDownCoord.x + this.radius.x;
        this.center.y = this.mouseDownCoord.y + this.radius.y;

        if (this.diameter.x > this.diameter.y) this.circleRadius = this.radius.y;
        else this.circleRadius = this.radius.x;
        this.circleCenter.x = this.mouseDownCoord.x + this.circleRadius;
        this.circleCenter.y = this.mouseDownCoord.y + this.circleRadius;
        this.circleDiameter = this.circleRadius * 2;

        const valueX = SIZE_ADJUSTMENT_THREE;
        const valueY = SIZE_ADJUSTMENT_FIFTEEN;

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.setLineDash([valueX, valueY]);

        if (this.circle) ctx.arc(this.circleCenter.x, this.circleCenter.y, Math.abs(this.circleRadius), 0, 2 * Math.PI);
        else ctx.ellipse(this.center.x, this.center.y, Math.abs(this.radius.x), Math.abs(this.radius.y), 0, 0, 2 * Math.PI);

        ctx.stroke();
    }
    putImage(): void {
        if (!this.arrow && !this.isDrawingCircle) {
            this.imagePosition.x = this.mousePosition.x - this.imageData.width / 2;
            this.imagePosition.y = this.mousePosition.y - this.imageData.height / 2;
        }
        if (this.isDrawingCircle) {
            if (!this.arrow) {
                this.imagePosition.x = this.mousePosition.x - this.circleRadius;
                this.imagePosition.y = this.mousePosition.y - this.circleRadius;
            }
            this.drawingService.previewCtx.putImageData(
                this.imageData,
                this.imagePosition.x,
                this.imagePosition.y,
                0,
                0,
                this.circleDiameter,
                this.circleDiameter,
            );
        } else this.drawingService.previewCtx.putImageData(this.imageData, this.imagePosition.x, this.imagePosition.y);
        this.imageChanged = true;
    }
    copyEllipse(): void {
        this.imageData = this.drawingService.baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, this.diameter.x, this.diameter.y);
        this.getEllipseImageData(this.mousePosition.x, this.mousePosition.y);
        this.imagePosition = this.mouseDownCoord;
        this.drawingService.baseCtx.beginPath();
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.ellipse(this.center.x, this.center.y, Math.abs(this.radius.x), Math.abs(this.radius.y), 0, 0, 2 * Math.PI);
        this.drawingService.baseCtx.fill();
        this.drawingService.previewCtx.putImageData(this.imageData, this.imagePosition.x, this.imagePosition.y);
        this.copied = true;
        this.selectedBtn = true;
    }
    copyCircle(): void {
        this.imageData = this.drawingService.baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, this.diameter.x, this.diameter.y);
        this.getCircleImageData(this.mousePosition.x, this.mousePosition.y);
        this.imagePosition.x = this.circleCenter.x - this.circleRadius;
        this.imagePosition.y = this.circleCenter.y - this.circleRadius;
        this.drawingService.baseCtx.beginPath();
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.arc(this.circleCenter.x, this.circleCenter.y, Math.abs(this.circleRadius), 0, 2 * Math.PI);
        this.drawingService.baseCtx.fill();
        this.drawingService.previewCtx.putImageData(this.imageData, this.imagePosition.x, this.imagePosition.y);
        this.copied = true;
        this.selectedBtn = true;
    }
    // tslint:disable-next-line: cyclomatic-complexity
    copyRect(ctx: CanvasRenderingContext2D): void {
        if (!this.selectAll) {
            if (this.square) this.imageData = ctx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, this.diameter.x, this.diameter.x);
            else if (!this.square) this.imageData = ctx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, this.diameter.x, this.diameter.y);

            this.drawingService.baseCtx.fillStyle = 'white';
            switch (true) {
                case this.mouseDownCoord.x <= this.mousePosition.x && this.mouseDownCoord.y <= this.mousePosition.y: {
                    this.imagePosition.x = this.mouseDownCoord.x;
                    this.imagePosition.y = this.mouseDownCoord.y;
                    break;
                }
                case this.mouseDownCoord.x >= this.mousePosition.x && this.mouseDownCoord.y <= this.mousePosition.y: {
                    this.imagePosition.x = this.mousePosition.x;
                    if (this.square) this.imagePosition.y = this.mouseDownCoord.y + this.diameter.x;
                    else this.imagePosition.y = this.mouseDownCoord.y;
                    break;
                }
                case this.mouseDownCoord.x <= this.mousePosition.x && this.mouseDownCoord.y >= this.mousePosition.y: {
                    this.imagePosition.x = this.mouseDownCoord.x;
                    if (this.square) this.imagePosition.y = this.mouseDownCoord.y;
                    else this.imagePosition.y = this.mousePosition.y;
                    break;
                }
                case this.mouseDownCoord.x >= this.mousePosition.x && this.mouseDownCoord.y >= this.mousePosition.y: {
                    this.imagePosition.x = this.mousePosition.x;
                    if (this.square) this.imagePosition.y = this.mouseDownCoord.y + this.diameter.x;
                    else this.imagePosition.y = this.mousePosition.y;
                    break;
                }
            }
            this.drawingService.baseCtx.fillRect(this.imagePosition.x, this.imagePosition.y, this.imageData.width, this.imageData.height);
            this.drawingService.previewCtx.putImageData(this.imageData, this.imagePosition.x, this.imagePosition.y);
        }

        if (this.selectAll) {
            this.imageData = ctx.getImageData(0, 0, this.drawingService.baseCtx.canvas.width, this.drawingService.baseCtx.canvas.height);
            this.drawingService.baseCtx.fillStyle = 'white';
            this.drawingService.baseCtx.fillRect(0, 0, this.imageData.width, this.imageData.height);
            this.drawingService.previewCtx.putImageData(this.imageData, 0, 0);

            this.imagePosition.x = 0;
            this.imagePosition.y = 0;
        }
        this.copied = true;
        this.selectedBtn = true;
    }

    isSelected(position: Vec2): boolean {
        const positionImageBeginX = this.imagePosition.x;
        const positionImageBeginY = this.imagePosition.y;

        let positionImageEndX = this.imagePosition.x + this.imageData.width;
        let positionImageEndY = this.imagePosition.y + this.imageData.height;
        if (this.isDrawingCircle) {
            positionImageEndX = this.imagePosition.x + this.circleDiameter;
            positionImageEndY = this.imagePosition.y + this.circleDiameter;
        }

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

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'm') {
            this.magnetismOn = !this.magnetismOn;
        }
    }

    selectControlPoint(): void {
        this.controlePoint(this.imagePosition);
        let width;
        let height;
        if (this.circle || this.isDrawingCircle) {
            width = this.squareDistance;
            height = this.squareDistance;
        } else {
            width = this.imageData.width;
            height = this.imageData.height;
        }
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
        this.mousePosition = this.magnetism.magnetismControlPoint(
            this.mousePosition,
            this.imageData,
            this.squareDistance,
            this.circle,
            this.isDrawingCircle,
        );
    }

    magnetismArrow(): void {
        this.imagePosition = this.magnetism.magnetismArrow(this.imagePosition, this.imageData);
    }
    // tslint:disable-next-line: max-file-line-count
}

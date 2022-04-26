import { Injectable } from '@angular/core';
import { LineAction } from '@app/classes/line-action';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private endLine: boolean = true;
    private shift: boolean = false;
    private coord: Vec2;
    private twentyPxInitialPoint: number = 20;
    private mousePosition: Vec2 = {} as Vec2;
    private lineAction: LineAction;
    pathData: Vec2[] = [];
    lineWidth: number = 5;
    junctionRadius: number = 5;
    junctionOn: boolean = false;

    constructor(drawingService: DrawingService, private colorService: ColorService, private undoRedoService: UndoRedoService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;

        // reset current line
        if (this.endLine) {
            this.drawingService.copyCanvas();
            this.clearPath();
            this.endLine = false;
        }

        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event); // mets les anciens points pour le straightLine
            let mousePosition = (this.mousePosition = this.getPositionFromMouse(event));

            if (this.shift) {
                mousePosition = this.angleBetweenLine(mousePosition, this.pathData[this.pathData.length - 1]);
            }

            this.pathData.push(mousePosition);

            if (this.junctionOn) {
                this.junction(this.drawingService.baseCtx, mousePosition);
            }
        }
    }

    onMouseDoubleClick(event: MouseEvent): void {
        this.mouseDown = false;
        this.endLine = true;

        this.pathData.pop();

        // second line appears but it shouldn't
        if (this.twentyPxFromInitial()) {
            this.pathData.pop();
            this.pathData.push(this.pathData[0]);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);

            this.drawingService.pasteCanvas();
            this.line(this.drawingService.baseCtx, this.pathData);
        }

        this.lineAction = new LineAction(
            this,
            this.drawingService,
            this.colorService.primaryColor,
            this.lineWidth,
            this.pathData,
            this.junctionRadius,
            this.junctionOn,
        );
        this.undoRedoService.addAction(this.lineAction);
        this.clearPath();
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            let mousePosition = this.getPositionFromMouse(event);

            if (this.shift) {
                mousePosition = this.angleBetweenLine(mousePosition, this.pathData[this.pathData.length - 1]);
            }
            this.straigthLine(this.drawingService.baseCtx, mousePosition);
            console.log(this.mouseDownCoord);
            console.log(mousePosition);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            let mousePosition = (this.mousePosition = this.getPositionFromMouse(event));
            this.mouseDownCoord = this.pathData[this.pathData.length - 1];

            if (this.shift) {
                mousePosition = this.angleBetweenLine(mousePosition, this.pathData[this.pathData.length - 1]);
            }

            // Drawing preview when mouse mouves
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.straigthLine(this.drawingService.previewCtx, mousePosition);
        }
    }

    onBackspace(event: KeyboardEvent): void {
        if (this.pathData.length > 0) {
            this.pathData.pop();
        }

        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if (this.pathData.length >= 1) {
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
        }

        // Instant preview
        if (!this.endLine) {
            this.mouseDownCoord = this.pathData[this.pathData.length - 1];
            this.straigthLine(this.drawingService.previewCtx, this.mousePosition);
        }

        if (this.junctionOn) {
            for (const point of this.pathData) {
                this.junction(this.drawingService.baseCtx, point);
            }
        }

        this.drawingService.pasteCanvas();
        this.line(this.drawingService.baseCtx, this.pathData);
    }

    onEscape(event: KeyboardEvent): void {
        if (!this.endLine) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            this.clearPath();
            this.drawingService.pasteCanvas();
            this.mouseDown = false;
            this.endLine = true;
        }
    }

    onShiftDown(event: KeyboardEvent): void {
        this.shift = event.shiftKey;
        const coords = this.angleBetweenLine(this.mousePosition, this.pathData[this.pathData.length - 1]);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.straigthLine(this.drawingService.previewCtx, coords);
    }

    onShiftUp(event: KeyboardEvent): void {
        this.shift = event.shiftKey;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.straigthLine(this.drawingService.previewCtx, this.mousePosition);
    }

    // draw
    straigthLine(ctx: CanvasRenderingContext2D, path: Vec2): void {
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.colorService.primaryColor;
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash([]);
        ctx.moveTo(this.mouseDownCoord.x, this.mouseDownCoord.y); // point precedent
        ctx.lineTo(path.x, path.y); // current point
        ctx.stroke();
    }

    // draw many lines
    line(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        if (path.length > 0) {
            for (let i = 0; i < path.length - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(path[i].x, path[i].y);
                ctx.lineTo(path[i + 1].x, path[i + 1].y);
                ctx.stroke();
            }
        }
    }

    junction(ctx: CanvasRenderingContext2D, path: Vec2): void {
        const circle = new Path2D();
        circle.arc(path.x, path.y, this.junctionRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.colorService.primaryColor;
        ctx.fill(circle);
    }

    clearPath(): void {
        this.pathData = [];
    }

    twentyPxFromInitial(): boolean {
        return (
            Math.sqrt(
                Math.pow(this.pathData[this.pathData.length - 1].x - this.pathData[0].x, 2) +
                    Math.pow(this.pathData[this.pathData.length - 1].y - this.pathData[0].y, 2),
            ) <= this.twentyPxInitialPoint
        );
    }

    // Source: https://medium.com/free-code-camp/how-to-lock-an-angle-when-drawing-on-canvas-in-javascript-51938b5abc7c
    closestVerticalOrHorizontal(cursorPosition: Vec2, previousPoint: Vec2): Vec2 {
        const distanceX = Math.abs(cursorPosition.x - previousPoint.x);
        const distanceY = Math.abs(cursorPosition.y - previousPoint.y);

        if (distanceX > distanceY) {
            return (this.coord = {
                x: cursorPosition.x,
                y: previousPoint.y,
            });
        } else {
            return (this.coord = {
                x: previousPoint.x,
                y: cursorPosition.y,
            });
        }
    }

    // find the closest 45, 135, 225, 315 degree angle that are between using closestVerticalOrHorizontal()
    angleBetweenLine(cursorPosition: Vec2, previousPoint: Vec2): Vec2 {
        const halfQuadrantAngle = 45;
        const halfCircle = 180;

        const distanceA = Math.sqrt(Math.pow(cursorPosition.x - previousPoint.x, 2) + Math.pow(cursorPosition.y - previousPoint.y, 2));
        const distanceB = Math.abs(cursorPosition.y - previousPoint.y);
        const distanceC = Math.abs(cursorPosition.x - previousPoint.x);

        // tan-1 for x
        const angleX = Math.atan(distanceB / distanceC);
        const angleDegreesX = (angleX / Math.PI) * halfCircle;

        // tan-1 for y
        const angleY = Math.atan(distanceC / distanceB);
        const angleDegreesY = (angleY / Math.PI) * halfCircle;

        if (angleDegreesX > halfQuadrantAngle / 2 && angleDegreesY > halfQuadrantAngle / 2) {
            const newPoint = Math.sqrt(Math.pow(distanceA, 2) / 2);
            const x = cursorPosition.x - previousPoint.x;
            const y = cursorPosition.y - previousPoint.y;

            if (x > 0 && y > 0) {
                // quadrant 4
                this.coord = {
                    x: previousPoint.x + newPoint,
                    y: previousPoint.y + newPoint,
                };
            } else if (x < 0 && y > 0) {
                // quadrant 3
                this.coord = {
                    x: previousPoint.x - newPoint,
                    y: previousPoint.y + newPoint,
                };
            } else if (x < 0 && y < 0) {
                // quadrant 2
                this.coord = {
                    x: previousPoint.x - newPoint,
                    y: previousPoint.y - newPoint,
                };
            } else if (x > 0 && y < 0) {
                // quadrant 1
                this.coord = {
                    x: previousPoint.x + newPoint,
                    y: previousPoint.y - newPoint,
                };
            }
            return this.coord;
        } else {
            return this.closestVerticalOrHorizontal(cursorPosition, previousPoint);
        }
    }
}

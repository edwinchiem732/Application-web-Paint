import { Injectable } from '@angular/core';
import { EllipseAction } from '@app/classes/ellipse-action';
import { MouseButton } from '@app/classes/mouse-button';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from './undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    mouseDown: boolean = false;
    mouseDownCoord: Vec2;
    mousePosition: Vec2;

    // tslint:disable-next-line: typedef
    private diameter = {} as Vec2;
    // tslint:disable-next-line: typedef
    radius = {} as Vec2;
    // tslint:disable-next-line: typedef
    center = {} as Vec2;
    circleRadius: number = 0;
    ellipseTrace: string = '';

    circle: boolean = false;
    width: number = 2;
    private ellipseAction: EllipseAction;

    constructor(drawingService: DrawingService, private colorService: ColorService, private undoRedoService: UndoRedoService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            console.log(this.ellipseTrace);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.mouseDown) {
            this.shapeSelect();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.shapeFill(this.drawingService.baseCtx);

            this.ellipseAction = new EllipseAction(
                this.drawingService,
                this,
                this.colorService.secondaryColor,
                this.colorService.primaryColor,
                this.width,
                this.ellipseTrace,
                this.center,
                this.radius,
                this.circleRadius,
                this.circle,
            );

            this.undoRedoService.addAction(this.ellipseAction);

            this.diameter = {} as Vec2;
            this.radius = {} as Vec2;
            this.center = {} as Vec2;
            this.circleRadius = 0;
            this.mouseDown = false;
            this.mouseMove = false;
        }
    }

    onShiftDown(event: KeyboardEvent): void {
        this.circle = true;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.shapeSelect();
        }
    }

    onShiftUp(event: KeyboardEvent): void {
        this.circle = false;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.shapeSelect();
        }
    }

    shapeFill(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.lineWidth = this.width;

        if (this.circle) {
            ctx.arc(this.center.x, this.center.y, Math.abs(this.circleRadius), 0, 2 * Math.PI);
        } else {
            ctx.ellipse(this.center.x, this.center.y, Math.abs(this.radius.x), Math.abs(this.radius.y), 0, 0, 2 * Math.PI);
        }
        this.traceStyle(ctx);
    }
    shapePerimeter(ctx: CanvasRenderingContext2D): void {
        const valueX = 3;
        const valueY = 15;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.setLineDash([valueX, valueY]);
        ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.diameter.x, this.diameter.y);
    }

    traceStyle(ctx: CanvasRenderingContext2D): void {
        switch (this.ellipseTrace) {
            case 'contour': {
                ctx.strokeStyle = this.colorService.secondaryColor;
                ctx.stroke();
                break;
            }
            case 'plein': {
                ctx.fillStyle = this.colorService.primaryColor;
                ctx.fill();
                break;
            }
            case 'pleinContour': {
                ctx.strokeStyle = this.colorService.secondaryColor;
                ctx.fillStyle = this.colorService.primaryColor;
                ctx.stroke();
                ctx.fill();
                break;
            }
        }
    }

    shapeSelect(): void {
        this.diameter.x = this.mousePosition.x - this.mouseDownCoord.x;
        this.diameter.y = this.mousePosition.y - this.mouseDownCoord.y;
        this.radius.x = this.diameter.x / 2;
        this.radius.y = this.diameter.y / 2;
        this.center.x = this.mouseDownCoord.x + this.radius.x;
        this.center.y = this.mouseDownCoord.y + this.radius.y;

        if (Math.abs(this.diameter.x) > Math.abs(this.diameter.y)) {
            this.circleRadius = this.radius.y;
        } else {
            this.circleRadius = this.radius.x;
        }

        this.shapeFill(this.drawingService.previewCtx);
        this.shapePerimeter(this.drawingService.previewCtx);
    }
}

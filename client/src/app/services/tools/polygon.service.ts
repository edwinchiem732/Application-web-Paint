import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { PolygonAction } from '@app/classes/polygon-action';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from './undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends Tool {
    width: number = 1;
    fillColor: string;
    strokeColor: string;
    mousePosition: Vec2;
    // tslint:disable-next-line: typedef
    distance = {} as Vec2;
    dots: number = 2;
    private dotsSpace: number = 10;
    sidesNumber: number = 3;
    radius: number;
    polygonMode: string = 'contour';
    private polygonAction: PolygonAction;

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
            this.mouseDown = false;
            this.mouseMove = false;
            this.polygonFill(this.drawingService.baseCtx, this.mouseDownCoord);

            this.polygonAction = new PolygonAction(
                this.drawingService,
                this,
                this.polygonMode,
                this.colorService.secondaryColor,
                this.colorService.primaryColor,
                this.width,
                this.mouseDownCoord,
                this.distance,
                this.radius,
                this.sidesNumber,
            );
            this.undoRedoService.addAction(this.polygonAction);

            this.radius = 0;
            this.distance.x = 0;
            this.distance.y = 0;
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.mouseDown) {
            this.polygoneSelect(mousePosition, this.mouseDownCoord);
        }
    }

    traceStyle(ctx: CanvasRenderingContext2D): void {
        switch (this.polygonMode) {
            case 'contour': {
                ctx.strokeStyle = this.colorService.secondaryColor;
                ctx.stroke();
                break;
            }
            case 'plein': {
                ctx.fillStyle = this.colorService.primaryColor;
                ctx.strokeStyle = this.colorService.primaryColor;
                ctx.stroke();
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

    polygonFill(ctx: CanvasRenderingContext2D, mouseDownCoord: Vec2): void {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.lineWidth = this.width;

        ctx.lineCap = 'round';
        this.polygoneGenerate(ctx, this.sidesNumber, mouseDownCoord);
        this.traceStyle(ctx);
    }

    polygoneBorder(ctx: CanvasRenderingContext2D, mouseDownCoord: Vec2): void {
        ctx.lineWidth = this.width;

        ctx.setLineDash([]);
        ctx.lineCap = 'round';
        this.polygoneGenerate(ctx, this.sidesNumber, mouseDownCoord);
        this.traceStyle(ctx);
        this.circlePreview(ctx);
    }

    polygoneSelect(mousePosition: Vec2, mouseDownCoord: Vec2): void {
        this.distance.x = mousePosition.x - this.mouseDownCoord.x;
        this.distance.y = mousePosition.y - this.mouseDownCoord.y;

        this.radius = Math.sqrt(Math.pow(this.distance.x, 2) + Math.pow(this.distance.y, 2));

        this.polygonFill(this.drawingService.previewCtx, mouseDownCoord);
        this.polygoneBorder(this.drawingService.previewCtx, mouseDownCoord);
    }

    polygoneGenerate(ctx: CanvasRenderingContext2D, numberOfSides: number, mouseDownCoord: Vec2): void {
        if (this.radius > 1) {
            ctx.lineCap = 'round';
            const angle = (Math.PI * 2) / numberOfSides;
            this.drawingService.previewCtx.beginPath();
            ctx.moveTo(mouseDownCoord.x + this.radius * Math.cos(0), mouseDownCoord.y + this.radius * Math.sin(0));
            for (let i = 1; i <= numberOfSides; i++) {
                ctx.lineTo(mouseDownCoord.x + this.radius * Math.cos(i * angle), mouseDownCoord.y + this.radius * Math.sin(i * angle));
            }
        }
    }

    circlePreview(ctx: CanvasRenderingContext2D): void {
        if (this.drawingService.previewCtx === ctx) {
            this.traceStyle(ctx);
            ctx.lineWidth = 1;
            ctx.arc(this.mouseDownCoord.x, this.mouseDownCoord.y, this.radius + this.width / 2, 0, 2 * Math.PI, false);
            ctx.setLineDash([this.dotsSpace, this.dotsSpace]);
            ctx.stroke();
        }
    }
}

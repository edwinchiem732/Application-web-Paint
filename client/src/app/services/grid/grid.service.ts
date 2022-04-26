import { Injectable, OnInit } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class GridService implements OnInit {
    constructor(private drawingService: DrawingService) {}

    gridOn: boolean = false;
    opacityValue: number;
    sizeOfSquares: number = 50;
    lineNumber: Vec2 = { x: 0, y: 0 };

    ngOnInit(): void {
        this.drawGrid();
    }

    calculateGrid(): Vec2 {
        this.lineNumber.x = Math.round(this.drawingService.canvas.width / this.sizeOfSquares) + 1;
        this.lineNumber.y = Math.round(this.drawingService.canvas.height / this.sizeOfSquares) + 1;

        return this.lineNumber;
    }

    connectPoints(ctx: CanvasRenderingContext2D, point1: Vec2, point2: Vec2): void {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.stroke();
        ctx.globalAlpha = this.opacityValue;
    }

    createTableX(): Vec2[] {
        const xTable: Vec2[] = [];
        for (let i = 0; i < this.calculateGrid().x * 2; i += 2) {
            xTable[i] = { x: this.sizeOfSquares * (i / 2), y: 0 };
            xTable[i + 1] = { x: this.sizeOfSquares * (i / 2), y: this.drawingService.canvas.height };
        }
        return xTable;
    }

    createTableY(): Vec2[] {
        const yTable: Vec2[] = [];
        for (let i = 0; i < this.calculateGrid().y * 2; i += 2) {
            yTable[i] = { x: 0, y: this.sizeOfSquares * (i / 2) };
            yTable[i + 1] = { x: this.drawingService.canvas.width, y: this.sizeOfSquares * (i / 2) };
        }
        return yTable;
    }

    generateGridOnX(): void {
        const xTable = this.createTableX();
        for (let i = 0; i < this.calculateGrid().x * 2; i += 2) {
            this.connectPoints(this.drawingService.gridCtx, xTable[i], xTable[i + 1]);
        }
    }

    generateGridOnY(): void {
        const yTable = this.createTableY();
        for (let i = 0; i < this.calculateGrid().y * 2; i += 2) {
            this.connectPoints(this.drawingService.gridCtx, yTable[i], yTable[i + 1]);
        }
    }

    drawGrid(): void {
        this.drawingService.clearCanvas(this.drawingService.gridCtx);
        if (this.gridOn) {
            this.generateGridOnX();
            this.generateGridOnY();
        }
    }

    intersectionPath(): Vec2[] {
        let index = 0;
        const path: Vec2[] = [];
        for (let i = 0; i < this.calculateGrid().x; i++) {
            for (let j = 0; j < this.calculateGrid().y; j++) {
                path[index] = { x: this.sizeOfSquares * i, y: this.sizeOfSquares * j };
                index++;
            }
        }
        return path;
    }

    closestIntersection(coord: Vec2): Vec2 {
        let index = 0;
        let minimum = this.sizeOfSquares;
        const path = this.intersectionPath();
        for (let i = 0; i < path.length; i++) {
            if (Math.sqrt(Math.pow(path[i].x - coord.x, 2) + Math.pow(path[i].y - coord.y, 2)) < minimum) {
                minimum = Math.sqrt(Math.pow(path[i].x - coord.x, 2) + Math.pow(path[i].y - coord.y, 2));
                index = i;
            }
        }
        return path[index];
    }
}

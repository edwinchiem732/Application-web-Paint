import { Injectable } from '@angular/core';
import { AerosolAction } from '@app/classes/aerosol-action';
import { MouseButton } from '@app/classes/enum';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    constructor(drawingService: DrawingService, private colorService: ColorService, private undoRedoAbs: UndoRedoService) {
        super(drawingService);
    }

    pathData: Vec2[] = [];
    aerosolWidth: number = 5;
    dropletDiameter: number = 1;
    dropletQuantity: number = 5;
    private timer: number;
    private timer2: number;
    private secondsToMsRatio: number = 1000;
    sprayOn: boolean = false;
    private emission: number;
    private aerosolAction: AerosolAction;
    // tslint:disable-next-line: typedef
    private pathdroplets = {} as Vec2;
    private isClearTimer: boolean;

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.sprayOn = true;

        this.emission = (1 / this.dropletQuantity) * this.secondsToMsRatio;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.timer2 = window.setInterval(() => {
                this.pathData.push(this.mouseDownCoord);
            }, this.emission);
            if (this.isClearTimer) {
                window.clearInterval(this.timer);
                window.clearInterval(this.timer2);
                this.isClearTimer = false;
            }
            this.spray(this.drawingService.previewCtx, this.sprayOn);
            this.timer = window.setInterval(() => {
                this.spray(this.drawingService.previewCtx, this.sprayOn);
            }, this.emission);
        }
    }

    // when mouseUp and decides to start drawing
    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDown = false;
            this.sprayOn = false;
            this.isClearTimer = true;

            this.drawingService.baseCtx.drawImage(this.drawingService.previewCanvas, 0, 0);

            this.aerosolAction = new AerosolAction(
                this.drawingService,
                this,
                this.colorService,
                this.dropletDiameter,
                this.aerosolWidth,
                this.pathData,
            );
            this.undoRedoAbs.addAction(this.aerosolAction);

            this.pathData = [];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseOut(event: MouseEvent): void {
        this.spray(this.drawingService.previewCtx, this.sprayOn);
    }

    // source: https://theburningmonk.com/2011/03/having-fun-with-html5-simple-painting-app-using-canvas/
    spray(ctx: CanvasRenderingContext2D, isSprayOn: boolean): void {
        if (isSprayOn) {
            const density = 40;

            for (let i = 0; i < density; i++) {
                const randomPoints = this.randomDroplets(this.aerosolWidth);

                this.pathdroplets.x = this.mouseDownCoord.x + randomPoints.x;
                this.pathdroplets.y = this.mouseDownCoord.y + randomPoints.y;

                const circle = new Path2D();
                circle.arc(this.pathdroplets.x, this.pathdroplets.y, this.dropletDiameter / 2, 0, 2 * Math.PI);
                ctx.fillStyle = this.colorService.primaryColor;
                ctx.fill(circle);
            }
        } else {
            return;
        }
    }

    reSpray(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const density = 40;
        for (const point of path) {
            for (let i = 0; i < density; i++) {
                const randomPoints = this.randomDroplets(this.aerosolWidth);

                const x = point.x + randomPoints.x;
                const y = point.y + randomPoints.y;

                const circle = new Path2D();
                circle.arc(x, y, this.dropletDiameter / 2, 0, 2 * Math.PI);
                ctx.fillStyle = this.colorService.primaryColor;
                ctx.fill(circle);
            }
        }
    }

    randomDroplets(radius: number): Vec2 {
        const randomAngle = Math.random() * (2 * Math.PI);
        const randomRadius = Math.random() * radius;

        return {
            x: Math.cos(randomAngle) * randomRadius,
            y: Math.sin(randomAngle) * randomRadius,
        };
    }
}

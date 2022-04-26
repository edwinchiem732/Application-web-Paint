import { Injectable } from '@angular/core';
import { MouseButton } from '@app/classes/enum';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { CANVAS_STARTING_POSITION } from '@app/constant/constants';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    position: Vec2;
    colorSelection: string = 'rgba(194,181,181)';
    cursorOut: boolean = false;

    constructor(public drawingService: DrawingService, public colorService: ColorService) {
        super(drawingService);
    }

    onMouseDown(evt: MouseEvent): void {
        if (evt.button === MouseButton.Left) {
            this.colorSelection = this.colorService.getColor(evt.offsetX, evt.offsetY, this.drawingService.baseCtx);
            this.colorService.primaryColor = this.colorSelection;
            this.colorService.addPreviousColorToList(this.colorSelection);
        } else if (evt.button === MouseButton.Right) {
            this.colorSelection = this.colorService.getColor(evt.offsetX, evt.offsetY, this.drawingService.baseCtx);
            this.colorService.secondaryColor = this.colorSelection;
            this.colorService.addPreviousColorToList(this.colorSelection);
        }
    }

    onMouseMove(evt: MouseEvent): void {
        if (evt.pageX < CANVAS_STARTING_POSITION) {
            this.colorSelection = 'rgba(190, 209, 223)';
        } else if (evt.offsetX > this.drawingService.baseCtx.canvas.width) {
            this.colorSelection = 'rgba(190, 209, 223)';
        } else if (evt.offsetY > this.drawingService.baseCtx.canvas.height) {
            this.colorSelection = 'rgba(190, 209, 223)';
        } else if (evt.offsetY > this.drawingService.canvasSize.x) {
            this.colorSelection = 'rgba(190, 209, 223)';
        } else {
            const pixel = this.mousePosition(evt);
            this.colorSelection = this.colorService.getColor(pixel.x - CANVAS_STARTING_POSITION, pixel.y, this.drawingService.baseCtx);
            this.cursorOut = false;
        }
    }

    mousePosition(event: MouseEvent): Vec2 {
        return { x: event.pageX, y: event.pageY };
    }
}

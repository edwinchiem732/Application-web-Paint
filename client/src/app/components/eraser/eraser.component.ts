import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser.service';

@Component({
    selector: 'app-eraser',
    templateUrl: './eraser.component.html',
    styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent {
    widthEraser: number = 5;

    constructor(public eraserService: EraserService, public drawingService: DrawingService) {}

    changeEraserSize(event: MatSliderChange): void {
        this.widthEraser = event.value as number;
        this.eraserService.eraserWidth = this.widthEraser;
        this.drawingService.eraserCtx.canvas.height = this.widthEraser;
        this.drawingService.eraserCtx.canvas.width = this.widthEraser;
    }
}

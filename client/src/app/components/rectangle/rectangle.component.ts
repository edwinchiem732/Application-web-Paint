import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { RectangleService } from '@app/services/tools/rectangle.service';

@Component({
    selector: 'app-rectangle',
    templateUrl: './rectangle.component.html',
    styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent {
    widthBorderRectangle: number = 5;
    rectangleTraceselected: string = 'contour';

    constructor(public rectangleService: RectangleService) {}

    changeBorderSize(event: MatSliderChange): void {
        this.widthBorderRectangle = event.value as number;
        this.rectangleService.width = this.widthBorderRectangle;
    }

    changeRectangleTrace(event: MatSelectChange): void {
        this.rectangleService.rectangleMode = this.rectangleTraceselected;
    }
}

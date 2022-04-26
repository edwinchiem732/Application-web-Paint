import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { EllipseService } from '@app/services/tools/ellipse.service';

@Component({
    selector: 'app-ellipse',
    templateUrl: './ellipse.component.html',
    styleUrls: ['./ellipse.component.scss'],
})
export class EllipseComponent {
    widthBorderEllipse: number = 5;
    ellipseTraceselected: string = 'contour';

    constructor(public ellipseService: EllipseService) {}

    changeBorderEllipseSize(event: MatSliderChange): void {
        this.widthBorderEllipse = event.value as number;
        this.ellipseService.width = this.widthBorderEllipse;
    }

    changeEllipseTrace(event: MatSelectChange): void {
        this.ellipseService.ellipseTrace = this.ellipseTraceselected;
    }
}

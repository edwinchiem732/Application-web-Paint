import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { PolygonService } from '@app/services/tools/polygon.service';

@Component({
    selector: 'app-polygon',
    templateUrl: './polygon.component.html',
    styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent {
    widthPolygon: number = 5;
    sidesPolygon: number = 3;
    polygonTraceSelected: string = 'contour';

    constructor(public polygonService: PolygonService) {}

    changePolygonWidth(event: MatSliderChange): void {
        this.widthPolygon = event.value as number;
        this.polygonService.width = this.widthPolygon;
    }

    changePolygonSides(event: MatSliderChange): void {
        this.sidesPolygon = event.value as number;
        this.polygonService.sidesNumber = this.sidesPolygon;
    }
    changePolygonTrace(event: MatSelectChange): void {
        this.polygonService.polygonMode = this.polygonTraceSelected;
    }
}

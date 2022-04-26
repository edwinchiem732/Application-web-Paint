import { Component } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSliderChange } from '@angular/material/slider';
import { LineService } from '@app/services/tools/line.service';

@Component({
    selector: 'app-line',
    templateUrl: './line.component.html',
    styleUrls: ['./line.component.scss'],
})
export class LineComponent {
    private junctionOn: boolean;
    widthLine: number = 5;
    junctionRadius: number = 5;

    constructor(public lineService: LineService) {}

    changeLineSize(event: MatSliderChange): void {
        this.widthLine = event.value as number;
        this.lineService.lineWidth = this.widthLine;
    }

    changeJunctionRadius(event: MatSliderChange): void {
        this.junctionRadius = event.value as number;
        this.lineService.junctionRadius = this.junctionRadius;
    }

    junctionChecked(event: MatCheckbox): void {
        this.junctionOn = event.checked;
        this.lineService.junctionOn = this.junctionOn;
    }
}

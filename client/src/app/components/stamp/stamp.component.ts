import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { STAMP } from '@app/classes/stamp';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampService } from '@app/services/tools/stamp.service';

@Component({
    selector: 'app-stamp',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent {
    width: number = 50;
    height: number = 50;
    angle: number = 0;
    stampDefault: string = 'stamp1';

    constructor(public stampService: StampService, public drawingService: DrawingService) {}

    changeStampSize(event: MatSliderChange): void {
        this.width = event.value as number;
        this.height = event.value as number;
        this.drawingService.secondCtx.canvas.height = this.height;
        this.drawingService.secondCtx.canvas.width = this.width;
    }

    changeStampAngle(event: MatSliderChange): void {
        this.angle = event.value as number;
        this.stampService.angle = this.angle;
    }

    changeStampImage(event: MatSelectChange): void {
        switch (event.value) {
            case 'stamp1':
                this.stampService.currentStampName = STAMP.stamp1;
                break;
            case 'stamp2':
                this.stampService.currentStampName = STAMP.stamp2;
                break;
            case 'stamp3':
                this.stampService.currentStampName = STAMP.stamp3;
                break;
            case 'stamp4':
                this.stampService.currentStampName = STAMP.stamp4;
                break;
            case 'stamp5':
                this.stampService.currentStampName = STAMP.stamp5;
                break;
        }
    }
}

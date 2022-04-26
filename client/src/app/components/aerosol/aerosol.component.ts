import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { AerosolService } from '@app/services/tools/aerosol.service';

@Component({
    selector: 'app-aerosol',
    templateUrl: './aerosol.component.html',
    styleUrls: ['./aerosol.component.scss'],
})
export class AerosolComponent {
    widthAerosol: number = 5;
    dropletDiameter: number = 1;
    dropletQuantity: number = 5;
    constructor(public aerosolService: AerosolService) {}

    changeAerosolSize(event: MatSliderChange): void {
        this.widthAerosol = event.value as number;
        this.aerosolService.aerosolWidth = this.widthAerosol;
    }

    changeDropletSize(event: MatSliderChange): void {
        this.dropletDiameter = event.value as number;
        this.aerosolService.dropletDiameter = this.dropletDiameter;
    }

    changeDropletQuantity(event: MatSliderChange): void {
        this.dropletQuantity = event.value as number;
        this.aerosolService.dropletQuantity = this.dropletQuantity;
    }
}

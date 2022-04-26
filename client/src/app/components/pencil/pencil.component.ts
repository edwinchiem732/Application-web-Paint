import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { PencilService } from '@app/services/tools/pencil.service';

@Component({
    selector: 'app-pencil',
    templateUrl: './pencil.component.html',
    styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent {
    widthPencil: number = 5;

    constructor(public pencilService: PencilService) {}

    onWidthPencilChange(event: MatSliderChange): void {
        this.widthPencil = event.value as number;
        this.pencilService.pencilWidth = this.widthPencil;
    }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { ColorService } from '@app/services/color.service';
import { PipetteService } from '@app/services/tools/pipette.service';

@Component({
    selector: 'app-pipette',
    templateUrl: './pipette.component.html',
    styleUrls: ['./pipette.component.scss'],
})
export class PipetteComponent {
    @ViewChild('canvasPreview', { static: false }) canvasPreview: ElementRef<HTMLCanvasElement>;

    constructor(public pipetteService: PipetteService, public colorService: ColorService) {}
}

import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    private isNotEmpty: boolean;

    constructor(private drawingService: DrawingService) {
        this.isNotEmpty = localStorage.hasOwnProperty('url');
        if (this.isNotEmpty) {
            this.drawingService.getLocalStorageData();
        }
    }
}

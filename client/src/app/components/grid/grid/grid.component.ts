import { Component, HostListener } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { GridService } from '@app/services/grid/grid.service';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
    private upperBound: number = 100;
    private lowerBound: number = 5;
    opacity: number = 1;
    size: number = 50;
    changeSize: number = 5;

    // gridOn: boolean = false;
    constructor(public gridService: GridService) {}

    @HostListener('window:keydown', ['$event'])
    changeSizeShortcut(keyboardEvent: KeyboardEvent): void {
        switch (keyboardEvent.key) {
            case '+':
                // keyboardEvent.preventDefault();
                if (this.size < this.upperBound) {
                    this.size += this.changeSize;
                    this.gridService.sizeOfSquares = this.size;
                    this.gridService.drawGrid();
                }
                break;
            case '-':
                // keyboardEvent.preventDefault();
                if (this.size > this.lowerBound) {
                    this.size -= this.changeSize;
                    this.gridService.sizeOfSquares = this.size;
                    this.gridService.drawGrid();
                }
                break;
            case '=':
                // keyboardEvent.preventDefault();
                if (this.size < this.upperBound) {
                    this.size += this.changeSize;
                    this.gridService.sizeOfSquares = this.size;
                    this.gridService.drawGrid();
                }
                break;
        }
    }

    // gridChecked(event: MatCheckbox): void {
    //     this.gridOn = event.checked;
    //     this.gridService.gridOn = this.gridOn;
    //     this.gridService.drawGrid();
    // }

    gridOpacity(event: MatSliderChange): void {
        this.opacity = event.value as number;
        this.gridService.opacityValue = this.opacity;
        this.gridService.drawGrid();
    }

    gridSize(event: MatSliderChange): void {
        this.size = event.value as number;
        this.gridService.sizeOfSquares = this.size;
        this.gridService.drawGrid();
    }
}

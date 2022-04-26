import { Injectable } from '@angular/core';
import { LastTenColors } from '@app/classes/rgba';
import { ARRAY_LENGTH, ENDING_POSITION, MAX_OPACITY } from '@app/constant/constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: string = 'rgba(1,1,1,1)';
    secondaryColor: string = 'rgba(0,0,0,1)';
    colorOpacity: number = MAX_OPACITY;
    previousColors: LastTenColors[];
    colorChange: BehaviorSubject<string> = new BehaviorSubject<string>(this.primaryColor);
    colorChange$: Observable<string> = this.colorChange.asObservable();
    colorAtPosition: string;

    constructor() {
        this.previousColors = new Array(ARRAY_LENGTH);
        this.previousColors.fill({ color: 'rgba(0,0,0,1)' });
    }

    getPreviousColor(): LastTenColors[] {
        return this.previousColors;
    }

    addPreviousColorToList(color: string): void {
        this.previousColors.shift();
        this.previousColors.push({ color });
    }

    changeColor(value: string): void {
        this.colorChange.next(value);
    }

    // FROM https://malcoded.com/posts/angular-color-picker/
    getColor(x: number, y: number, ctx: CanvasRenderingContext2D): string {
        const data = ctx.getImageData(x, y, ENDING_POSITION, ENDING_POSITION).data;
        this.colorAtPosition = 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',1)';
        return this.colorAtPosition;
    }
}

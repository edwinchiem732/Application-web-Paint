import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MAX_LETTER } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerService } from '@app/services/server/server.service';

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent {
    errorServer: boolean = false;
    nameFile: string = '';
    alert: boolean = false;
    messageError: string = '';

    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: string[] = [];
    @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

    constructor(public drawingService: DrawingService, public serverService: ServerService, public matDialog: MatDialog) {}

    add(event: MatChipInputEvent): void {
        let bool = true;
        const input = event.input;
        const value = event.value;
        this.alert = false;
        this.tags.push(value.trim());

        for (const it of this.tags) {
            if (it === value) {
                bool = false;
            }
        }

        if ((value || '').trim() && bool) {
            this.tags.push(value.trim());
        }

        if (value.length > MAX_LETTER) {
            this.alert = true;
            this.messageError = 'S.V.P entrez un maximum de 5 lettres';
            this.remove(value);
        }

        if (!/^\S{3,}$/.test(value)) {
            this.alert = true;
            this.messageError = 'S.V.P ne pas inclure des espaces';
            this.remove(value);
        }

        if (/\d/.test(value)) {
            this.alert = true;
            this.messageError = 'S.V.P ne pas inclure des chiffres';
            this.remove(value);
        }

        if (input) {
            input.value = '';
        }
    }

    remove(tag: string): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    addDrawing(): void {
        const url = this.drawingService.copyCanvas();

        const drawing = { name: this.nameFile, tags: this.tags, url };

        // tslint:disable-next-line: deprecation
        this.serverService.addDrawing(drawing).subscribe(
            () => {
                alert("L'image a été sauvegardée!");
                this.errorServer = false;
            },
            (err) => {
                this.errorServer = true;
            },
        );
    }
}

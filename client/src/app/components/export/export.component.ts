import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit {
    @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
    private charToRemove: number = 22;
    name: string = '';
    private baseUrl: string = '';
    imgurUrl: string = '';
    private modeExport: string = '';
    private context: CanvasRenderingContext2D;
    filters: string[] = [
        'none',
        'blur(4px)',
        'contrast(1.4) sepia(1) drop-shadow(-9px 9px 3px #e81)',
        'sepia(60%)',
        'grayscale(100%)',
        'hue-rotate(90deg) drop-shadow(9px 2px 6px #e81)',
    ];
    filter: string;
    modes: string[] = ['PNG', 'JPEG'];

    constructor(private drawingService: DrawingService, private dialog: MatDialogRef<ExportComponent>) {}
    draw(filter: string = 'none'): void {
        this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const img = new Image();
        this.context.filter = filter;
        img.width = this.context.canvas.width;
        img.height = this.context.canvas.height;
        img.src = this.drawingService.canvas.toDataURL('image/png');
        img.onload = () => {
            this.context.drawImage(img, 0, 0, img.width, img.height);
        };
    }
    ngOnInit(): void {
        this.draw();
    }

    filterToApply(event: MatRadioChange): void {
        this.filter = event.value;
        this.draw(this.filter);
    }

    chooseExportMode(event: MatRadioChange): void {
        this.modeExport = event.value === this.modes[0] ? 'png' : 'jpeg';
    }

    exportDraw(name: string, filter: string): void {
        const c = document.createElement('canvas');
        const canvasContextee = c.getContext('2d') as CanvasRenderingContext2D;
        c.height = this.drawingService.canvas.height;
        c.width = this.drawingService.canvas.width;
        canvasContextee.filter = filter;
        canvasContextee.drawImage(this.drawingService.canvas, 0, 0);
        const img = c.toDataURL('image/' + this.modeExport);
        if (confirm('Confirmer votre dessin')) {
            const a = document.createElement('a');
            a.download = name;
            a.href = img;
            a.click();
            a.remove();
            this.cancel();
        }
    }

    cancel(): void {
        this.dialog.close();
    }

    exportImage(): void {
        switch (this.modeExport) {
            case 'png':
                this.exportDraw(this.name, this.filter);
                break;
            case 'jpeg':
                this.exportDraw(this.name, this.filter);
                break;
            default:
                alert('choisir un format');
        }
    }

    async apiImgur(filter: string): Promise<void> {
        const c = document.createElement('canvas');
        const canvasContextee = c.getContext('2d') as CanvasRenderingContext2D;
        c.height = this.drawingService.canvas.height;
        c.width = this.drawingService.canvas.width;
        canvasContextee.filter = filter;
        canvasContextee.drawImage(this.drawingService.canvas, 0, 0);
        this.baseUrl = c.toDataURL('image/' + this.modeExport);
        this.baseUrl = this.baseUrl.substring(this.charToRemove);
        try {
            const formData = new FormData();
            formData.append('image', this.baseUrl);
            const request = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    Authorization: 'Client-ID 2b63626c8f60f0c',
                },
                body: formData,
            });
            const response = await request.json();
            this.imgurUrl = response.data.link;
        } catch (e) {
            throw new Error(e);
        }
    }

    uploadImgur(): void {
        switch (this.modeExport) {
            case 'png':
                this.apiImgur(this.filter);
                break;
            case 'jpeg':
                this.apiImgur(this.filter);
                break;
            default:
                this.apiImgur(this.filter);
                break;
        }
    }
}

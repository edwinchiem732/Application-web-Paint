import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { BREAK_LINE_INCREASE } from '@app/constant/constants';
import { TextService } from '@app/services/text.service';

@Component({
    selector: 'app-text',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss'],
})
export class TextComponent implements AfterViewInit {
    @ViewChild('gras', { static: false }) gras: ElementRef<HTMLButtonElement>;
    @ViewChild('italic', { static: false }) italic: ElementRef<HTMLButtonElement>;

    fontSize: number = 12;
    defaultStyleFamily: string = 'Arial';

    constructor(public textService: TextService) {}

    ngAfterViewInit(): void {
        this.textService.buttonBold = this.gras.nativeElement;
        this.textService.buttonItalic = this.italic.nativeElement;
    }

    changeFontStyle(event: MatSelectChange): void {
        this.textService.fontFamily = String(event.value);
        this.textService.input.style.fontFamily = String(event.value);
    }

    changeFontSize(event: MatSliderChange): void {
        this.textService.fontSize = event.value as number;
        this.textService.input.style.fontSize = event.value + 'px';
        this.fontSize = event.value as number;
    }

    @HostListener('window:keydown.enter', ['$event'])
    breakLine(event: KeyboardEvent): void {
        event.preventDefault();
        this.textService.input.style.height = String(parseInt(this.textService.input.style.height, 10) + BREAK_LINE_INCREASE) + 'px';
        this.textService.input.value += '\n';
    }

    @HostListener('window:keydown.arrowLeft', ['$event'])
    moveLeft(event: KeyboardEvent): void {
        if (this.textService.counterLeft <= this.textService.input.value.length) {
            this.textService.cursorPosition = this.textService.input.value.length - this.textService.counterLeft;
            this.textService.counterLeft += 1;
            this.textService.input.setSelectionRange(this.textService.cursorPosition, this.textService.cursorPosition);
        }
    }

    @HostListener('window:keydown.arrowRight', ['$event'])
    moveRight(event: KeyboardEvent): void {
        if (this.textService.cursorPosition <= this.textService.input.value.length) {
            this.textService.counterLeft -= 1;
            this.textService.cursorPosition = this.textService.cursorPosition + this.textService.counterRight;
            this.textService.input.setSelectionRange(this.textService.cursorPosition, this.textService.cursorPosition);
        }
    }
}

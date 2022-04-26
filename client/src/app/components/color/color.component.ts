import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MouseButton } from '@app/classes/mouse-button';
import { LastTenColors } from '@app/classes/rgba';
import { Vec2 } from '@app/classes/vec2';
import {
    ENDING_POSITION,
    HEIGHT_PALETTE,
    HEIGHT_SLIDER,
    HEXA_LENGTH,
    NULL,
    POSITION_BLACK_IN_SLIDER,
    POSITION_BLUE_IN_SLIDER,
    POSITION_BLUE_PALE_IN_SLIDER,
    POSITION_GREEN_IN_SLIDER,
    POSITION_ORANGE_IN_SLIDER,
    POSITION_PURPLE_IN_SLIDER,
    POSITION_PURPLE_PALE_IN_SLIDER,
    POSITION_RED_IN_SLIDER,
    POSITION_WHITE_IN_SLIDER,
    POSITION_YELLOW_IN_SLIDER,
    RADIX_TEN,
    RGB_LENGTH,
    SIXTEEN,
    WIDHT_PALETTE,
    WIDTH_SLIDER,
} from '@app/constant/constants';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements AfterViewInit {
    private orange: string = 'rgba(255, 0, 0, 1)';
    private yellow: string = 'rgba(255, 255, 0, 1)';
    private green: string = 'rgba(0, 255, 0, 1)';
    private bluePale: string = 'rgba(0, 255, 255, 1)';
    private blue: string = 'rgba(0, 0, 255, 1)';
    private purplePale: string = 'rgba(255, 0, 255, 1)';
    private red: string = 'rgba(255, 0, 0, 1)';
    private purple: string = 'rgba(100,15,156,1)';
    private clicked: boolean = true;
    inputColor: string = '#000000';
    gradientColorPalette: string = this.colorService.primaryColor;
    inputRGB: string[] = ['1', '1', '1'];
    private sliderContext: CanvasRenderingContext2D;
    private paletteContext: CanvasRenderingContext2D;
    colorToChange: string = this.colorService.primaryColor;
    previousColors: LastTenColors[];
    hexColor: string;

    @ViewChild('canvasSlider') canvasSlider: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasPalette') canvasPalette: ElementRef<HTMLCanvasElement>;

    @Input() tint: string;

    @Output() color: EventEmitter<string> = new EventEmitter();

    constructor(public colorService: ColorService, public drawingService: DrawingService) {
        this.previousColors = this.colorService.getPreviousColor();
    }
    // creating slider and palette after compilation with specified dimensions
    ngAfterViewInit(): void {
        this.sliderContext = this.canvasSlider.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.displaySlider(this.sliderContext, { x: WIDTH_SLIDER, y: HEIGHT_SLIDER });
        this.paletteContext = this.canvasPalette.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.createPaletteCanvas(this.paletteContext, { x: WIDHT_PALETTE, y: HEIGHT_PALETTE });
    }

    // From https://malcoded.com/posts/angular-color-picker/ but modified
    // Adding colors in slider
    private initializeColorsInSlider(colorValue: CanvasGradient): void {
        const width = this.canvasSlider.nativeElement.width;
        const height = this.canvasSlider.nativeElement.height;

        // Adding color from starting position specified as first parameter. Color value in RGBA
        this.sliderContext.clearRect(NULL, NULL, width, height);
        colorValue.addColorStop(POSITION_WHITE_IN_SLIDER, 'rgba(255,255,255,1)');
        colorValue.addColorStop(POSITION_YELLOW_IN_SLIDER, this.yellow);
        colorValue.addColorStop(POSITION_ORANGE_IN_SLIDER, this.orange);
        colorValue.addColorStop(POSITION_RED_IN_SLIDER, this.red);
        colorValue.addColorStop(POSITION_GREEN_IN_SLIDER, this.green);
        colorValue.addColorStop(POSITION_BLUE_PALE_IN_SLIDER, this.bluePale);
        colorValue.addColorStop(POSITION_BLUE_IN_SLIDER, this.blue);
        colorValue.addColorStop(POSITION_PURPLE_PALE_IN_SLIDER, this.purplePale);
        colorValue.addColorStop(POSITION_PURPLE_IN_SLIDER, this.purple);
        colorValue.addColorStop(POSITION_BLACK_IN_SLIDER, 'rgba(0,0,0,1)');

        this.sliderContext.beginPath();
        this.sliderContext.rect(NULL, NULL, width, height);
        this.sliderContext.fillStyle = colorValue;
        this.sliderContext.fill();
        this.sliderContext.closePath();
    }

    private displaySlider(slider: CanvasRenderingContext2D, dimension: Vec2): void {
        slider.clearRect(NULL, NULL, dimension.x, dimension.y);
        const shader = slider.createLinearGradient(NULL, NULL, dimension.x, NULL);
        this.initializeColorsInSlider(shader);
    }

    // inspired from https://malcoded.com/posts/angular-color-picker/ but modified
    private createPalette(): void {
        const width = this.canvasPalette.nativeElement.width;
        const height = this.canvasPalette.nativeElement.height;

        this.paletteContext.fillStyle = this.tint || 'rgba(255,255,255,1)';
        this.paletteContext.fillRect(NULL, NULL, width, height);
    }

    private createPaletteCanvas(palette: CanvasRenderingContext2D, dimension: Vec2): void {
        palette.clearRect(NULL, NULL, dimension.x, dimension.y);
        this.createPalette();
        this.initializeColorsInPalette();
    }

    // From https://malcoded.com/posts/angular-color-picker/
    private initializeColorsInPalette(): void {
        const width = this.canvasPalette.nativeElement.width;
        const height = this.canvasPalette.nativeElement.height;

        const whiteGrad = this.paletteContext.createLinearGradient(NULL, NULL, width, NULL);
        whiteGrad.addColorStop(NULL, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(ENDING_POSITION, 'rgba(255,255,255,0)');

        this.paletteContext.fillStyle = whiteGrad;
        this.paletteContext.fillRect(NULL, NULL, width, height);

        const blackGrad = this.paletteContext.createLinearGradient(NULL, NULL, NULL, height);
        blackGrad.addColorStop(NULL, 'rgba(0,0,0,0)');
        blackGrad.addColorStop(ENDING_POSITION, 'rgba(0,0,0,1)');

        const gradient = this.paletteContext.createLinearGradient(NULL, NULL, width, NULL);

        gradient.addColorStop(NULL, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(ENDING_POSITION / 2, this.colorService.primaryColor);
        gradient.addColorStop(ENDING_POSITION, 'rgba(0, 0, 0, 1)');

        this.paletteContext.fillStyle = blackGrad;
        this.paletteContext.fillRect(NULL, NULL, width, height);

        this.paletteContext.fillStyle = gradient;
        this.paletteContext.fillRect(NULL, NULL, width, height);
    }

    onMouseDownPalette(event: MouseEvent): void {
        if (this.clicked) {
            this.paletteContext.clearRect(NULL, NULL, WIDHT_PALETTE, HEIGHT_PALETTE);
            this.createPaletteCanvas(this.paletteContext, { x: WIDHT_PALETTE, y: HEIGHT_PALETTE });
            this.displayColorPalette({ x: event.offsetX, y: event.offsetY });
            this.gradientColorPalette = this.colorService.colorAtPosition;
            this.colorService.primaryColor = this.gradientColorPalette;
            this.colorService.addPreviousColorToList(this.colorService.primaryColor);
            // Getting the RGBA value with specified length
            this.inputRGB = this.colorService.primaryColor.slice(RGB_LENGTH).split(',');
        }
    }

    private displayColorPalette(event: Vec2): string {
        const colorPaletteValue = this.colorService.getColor(event.x, event.y, this.paletteContext);
        this.color.emit(colorPaletteValue);
        return colorPaletteValue;
    }

    selectPrimaryAndSecondary(event: MouseEvent): boolean {
        if (event.button === MouseButton.Left) {
            this.colorToChange = this.colorService.primaryColor = this.displayColorSlider({ x: event.offsetX, y: event.offsetY });
            this.colorService.addPreviousColorToList(this.colorService.primaryColor);
            this.inputRGB = this.colorService.primaryColor.slice(RGB_LENGTH).split(','); // slice the rgba
        } else if (event.button === MouseButton.Right) {
            this.colorService.secondaryColor = this.displayColorSlider({ x: event.offsetX, y: event.offsetY });
            this.colorService.addPreviousColorToList(this.colorService.secondaryColor);
            return false;
        }
        this.initializeColorsInPalette();
        return true;
    }

    chooseFromPreviousColors(event: MouseEvent, colorSelected: LastTenColors): boolean {
        if (event.button === MouseButton.Left) {
            this.colorService.primaryColor = colorSelected.color;
        } else if (event.button === MouseButton.Right) {
            this.colorService.secondaryColor = colorSelected.color;
            return false;
        }
        return true;
    }

    displayColorSlider(event: Vec2): string {
        const colorValue = this.colorService.getColor(event.x, event.y, this.sliderContext);
        this.color.emit(colorValue);
        return colorValue;
    }

    exchangeColor(): void {
        const temporaryColor = this.colorService.primaryColor;
        this.colorService.primaryColor = this.colorService.secondaryColor;
        this.colorService.secondaryColor = temporaryColor;
    }

    colorOpacity(): void {
        this.drawingService.previewCtx.globalAlpha = this.colorService.colorOpacity;
        this.drawingService.baseCtx.globalAlpha = this.colorService.colorOpacity;
    }

    conversionToHexa(r: string, g: string, b: string): string {
        // Putting color in the desired radix
        const red = parseInt(r, RADIX_TEN);
        const green = parseInt(g, RADIX_TEN);
        const blue = parseInt(b, RADIX_TEN);
        // from:  https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        const changeNumber = (zeroTo256: number) => {
            const numberHex = zeroTo256.toString(SIXTEEN);
            return numberHex.length === 1 ? '0' + numberHex : numberHex;
        };
        this.hexColor = '#' + changeNumber(red) + changeNumber(green) + changeNumber(blue);
        this.colorService.primaryColor = this.hexColor;
        this.colorService.addPreviousColorToList(this.colorService.primaryColor);
        return this.hexColor;
    }

    colorInputInHexa(): void {
        const lettersNotPermitted = 'g h i j k lz m n o p q r s t u v w x y z';
        const capitalLettersNotPermitted = 'G H I J K L M N O P Q R S T U V W X y Z';
        const lettersSplit = lettersNotPermitted.split(' ');
        const capitalSplit = capitalLettersNotPermitted.split(' ');
        for (let i = NULL; i < HEXA_LENGTH; ++i) {
            // We don't add the color if it contains values that are not permitted
            if (!this.inputColor.includes(lettersSplit[i]) || !this.inputColor.includes(capitalSplit[i])) {
                this.colorService.primaryColor = this.inputColor;
                this.colorService.addPreviousColorToList(this.colorService.primaryColor);
            }
        }
    }
}

import { Injectable, OnDestroy } from '@angular/core';
import { cursorOptions } from '@app/classes/cursor-options';
import { Vec2 } from '@app/classes/vec2';
import {
    DEFAULT_HEIGHT,
    DEFAULT_HEIGHT_GRABBER_BOTTOM,
    DEFAULT_HEIGHT_GRABBER_RIGHT,
    DEFAULT_HEIGHT_GRABBER_SIDE,
    DEFAULT_WIDTH,
    DEFAULT_WIDTH_GRABBER_BOTTOM,
    DEFAULT_WIDTH_GRABBER_RIGHT,
    DEFAULT_WIDTH_GRABBER_SIDE,
    RGBA_SPACE,
} from '@app/constant/constants';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawingService implements OnDestroy {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    selectionCanvas: HTMLCanvasElement;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    copiedCanvas: string;
    imageCanvas: HTMLImageElement;
    cursorImage: string = cursorOptions.crayon;
    background: CanvasRenderingContext2D;
    previewColorAtPosition: CanvasRenderingContext2D;
    secondCtx: CanvasRenderingContext2D;
    eraserCtx: CanvasRenderingContext2D;
    gridCtx: CanvasRenderingContext2D;

    canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    dotSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    grabberBottom: Vec2 = { x: DEFAULT_WIDTH_GRABBER_BOTTOM, y: DEFAULT_HEIGHT_GRABBER_BOTTOM };
    grabberRight: Vec2 = { x: DEFAULT_WIDTH_GRABBER_RIGHT, y: DEFAULT_HEIGHT_GRABBER_RIGHT };
    grabberSide: Vec2 = { x: DEFAULT_WIDTH_GRABBER_SIDE, y: DEFAULT_HEIGHT_GRABBER_SIDE };
    selectionCtx: CanvasRenderingContext2D;

    private destroySubject$: Subject<boolean> = new Subject<boolean>();
    destroy$: Observable<boolean> = this.destroySubject$.asObservable();

    ngOnDestroy(): void {
        this.destroySubject$.next(true);
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    backgroundCanvas(ctx: CanvasRenderingContext2D, color: string = '#FFFFFF'): void {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.baseCtx.canvas.width, this.baseCtx.canvas.height);
    }

    checkEmptyCanvas(): boolean {
        // it looks at all the pixels from position 0,0 for all positions in 3rd and 4th coordinate
        const imageData: ImageData = this.baseCtx.getImageData(0, 0, this.baseCtx.canvas.width, this.baseCtx.canvas.height);
        let i = 0;
        const MAX_RGB = 0;
        let empty = false;
        const incrementThree = 3;
        while (i < imageData.data.length && !empty) {
            if (
                imageData.data[i] !== MAX_RGB ||
                imageData.data[i++] !== MAX_RGB ||
                imageData.data[i + 2] !== MAX_RGB ||
                imageData.data[i + incrementThree] !== MAX_RGB
            ) {
                empty = true;
            }
            i += RGBA_SPACE;
        }
        return empty;
    }

    copyCanvas(): string {
        this.copiedCanvas = this.canvas.toDataURL();
        this.imageCanvas = new Image();
        this.imageCanvas.onload = () => {
            this.baseCtx.drawImage(this.imageCanvas, 0, 0);
        };
        return this.copiedCanvas;
    }

    pasteCanvas(): void {
        this.imageCanvas.src = this.copiedCanvas;
    }

    imageUrl(): string {
        return this.canvas.toDataURL();
    }

    // local storgae
    drawURICanvas(uri: string): void {
        this.imageCanvas = new Image();
        this.imageCanvas.src = uri;
        this.imageCanvas.onload = () => {
            this.baseCtx.drawImage(this.imageCanvas, 0, 0);
        };
    }

    setLocalStorage(url: string): void {
        localStorage.setItem('url', url);
        localStorage.setItem('width', this.canvasSize.x + 'px');
        localStorage.setItem('height', this.canvasSize.y + 'px');

        localStorage.setItem('widthDot', this.dotSize.x + 'px');
        localStorage.setItem('heightDot', this.dotSize.y + 'px');

        localStorage.setItem('grabberSideX', this.grabberSide.x + 'px');
        localStorage.setItem('grabberSideY', this.grabberSide.y + 'px');
        localStorage.setItem('grabberRightX', this.grabberRight.x + 'px');
        localStorage.setItem('grabberRightY', this.grabberRight.y + 'px');
        localStorage.setItem('grabberBottomX', this.grabberBottom.x + 'px');
        localStorage.setItem('grabberBottomY', this.grabberBottom.y + 'px');
    }

    getLocalStorageData(): void {
        const uri = localStorage.getItem('url') as string;
        this.drawURICanvas(uri);
        this.canvasSize.x = parseInt(localStorage.getItem('width') as string, 10);
        this.canvasSize.y = parseInt(localStorage.getItem('height') as string, 10);

        this.dotSize.x = parseInt(localStorage.getItem('widthDot') as string, 10);
        this.dotSize.y = parseInt(localStorage.getItem('heightDot') as string, 10);
        this.grabberBottom.x = parseInt(localStorage.getItem('grabberBottomX') as string, 10);
        this.grabberBottom.y = parseInt(localStorage.getItem('grabberBottomY') as string, 10);
        this.grabberSide.x = parseInt(localStorage.getItem('grabberSideX') as string, 10);
        this.grabberSide.y = parseInt(localStorage.getItem('grabberSideY') as string, 10);
        this.grabberRight.x = parseInt(localStorage.getItem('grabberRightX') as string, 10);
        this.grabberRight.y = parseInt(localStorage.getItem('grabberRightY') as string, 10);
    }

    newDrawing(): void {
        localStorage.clear();
        this.canvasSize.x = DEFAULT_WIDTH;
        this.canvasSize.y = DEFAULT_HEIGHT;

        this.dotSize.x = DEFAULT_WIDTH;
        this.dotSize.y = DEFAULT_HEIGHT;
        this.grabberBottom.x = DEFAULT_WIDTH_GRABBER_BOTTOM;
        this.grabberBottom.y = DEFAULT_HEIGHT_GRABBER_BOTTOM;
        this.grabberSide.x = DEFAULT_WIDTH_GRABBER_SIDE;
        this.grabberSide.y = DEFAULT_HEIGHT_GRABBER_SIDE;
        this.grabberRight.x = DEFAULT_WIDTH_GRABBER_RIGHT;
        this.grabberRight.y = DEFAULT_HEIGHT_GRABBER_RIGHT;
        this.setLocalStorage('');
    }
}

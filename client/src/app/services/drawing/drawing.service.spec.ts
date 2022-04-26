import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import {
    DEFAULT_HEIGHT,
    DEFAULT_HEIGHT_GRABBER_BOTTOM,
    DEFAULT_HEIGHT_GRABBER_RIGHT,
    DEFAULT_HEIGHT_GRABBER_SIDE,
    DEFAULT_WIDTH,
    DEFAULT_WIDTH_GRABBER_BOTTOM,
    DEFAULT_WIDTH_GRABBER_RIGHT,
    DEFAULT_WIDTH_GRABBER_SIDE,
} from '@app/constant/constants';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let service: DrawingService;
    let canvas: HTMLCanvasElement;
    let canvasTestHelper: CanvasTestHelper;
    let url: string;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        url = canvas.toDataURL();
        service.canvasSize = { x: 1000, y: 650 };
        service.grabberSide = { x: 1000, y: 650 };
        service.grabberRight = { x: 1000, y: 325 };
        service.grabberBottom = { x: 500, y: 650 };
        service.dotSize = { x: 1000, y: 650 };
        localStorage.setItem('url', url);
        localStorage.setItem('width', service.canvasSize.x + 'px');
        localStorage.setItem('height', service.canvasSize.y + 'px');
        localStorage.setItem('widthDot', service.dotSize.x + 'px');
        localStorage.setItem('heightDot', service.dotSize.y + 'px');
        localStorage.setItem('grabberSideX', service.grabberSide.x + 'px');
        localStorage.setItem('grabberSideY', service.grabberSide.y + 'px');
        localStorage.setItem('grabberRightX', service.grabberRight.x + 'px');
        localStorage.setItem('grabberRightY', service.grabberRight.y + 'px');
        localStorage.setItem('grabberBottomX', service.grabberBottom.x + 'px');
        localStorage.setItem('grabberBottomY', service.grabberBottom.y + 'px');

        service.imageCanvas = {
            src: 'test',
        } as HTMLImageElement;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should paste the canvas to the imageCanvas.src', () => {
        service.pasteCanvas();
        expect(service.imageCanvas.src).toEqual(service.copiedCanvas);
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('should return false if canvas is not empty', () => {
        const valueRGBA = 5;
        const width = 50;
        const height = 50;
        const image: ImageData = service.baseCtx.getImageData(0, 0, width, height);
        image.data[1] = valueRGBA;
        service.checkEmptyCanvas();
        expect(service.checkEmptyCanvas()).toBe(false);
    });

    it('should set the canvas in the local storage', () => {
        service.setLocalStorage(url);
        expect(localStorage.getItem('url')).toEqual(url);
        expect(localStorage.getItem('width')).toEqual(service.canvasSize.x + 'px');
        expect(localStorage.getItem('height')).toEqual(service.canvasSize.y + 'px');
        expect(localStorage.getItem('widthDot')).toEqual(service.dotSize.x + 'px');
        expect(localStorage.getItem('heightDot')).toEqual(service.dotSize.y + 'px');
        expect(localStorage.getItem('grabberSideX')).toEqual(service.grabberSide.x + 'px');
        expect(localStorage.getItem('grabberSideY')).toEqual(service.grabberSide.y + 'px');
        expect(localStorage.getItem('grabberRightX')).toEqual(service.grabberRight.x + 'px');
        expect(localStorage.getItem('grabberRightY')).toEqual(service.grabberRight.y + 'px');
        expect(localStorage.getItem('grabberBottomX')).toEqual(service.grabberBottom.x + 'px');
        expect(localStorage.getItem('grabberBottomY')).toEqual(service.grabberBottom.y + 'px');
    });

    it('should get the saved inforation on the canvas from the local storage', () => {
        const uri = localStorage.getItem('url') as string;
        service.drawURICanvas(uri);
        const spy = spyOn(service, 'drawURICanvas').and.callThrough();

        service.getLocalStorageData();

        expect(spy).toHaveBeenCalled();
        expect(localStorage.getItem('url')).toEqual(url);
        expect(service.canvasSize.x).toEqual(parseInt(localStorage.getItem('width') as string, 10));
        expect(service.canvasSize.y).toEqual(parseInt(localStorage.getItem('height') as string, 10));
        expect(service.dotSize.x).toEqual(parseInt(localStorage.getItem('widthDot') as string, 10));
        expect(service.dotSize.y).toEqual(parseInt(localStorage.getItem('heightDot') as string, 10));
        expect(service.grabberBottom.x).toEqual(parseInt(localStorage.getItem('grabberBottomX') as string, 10));
        expect(service.grabberBottom.y).toEqual(parseInt(localStorage.getItem('grabberBottomY') as string, 10));
        expect(service.grabberSide.x).toEqual(parseInt(localStorage.getItem('grabberSideX') as string, 10));
        expect(service.grabberSide.y).toEqual(parseInt(localStorage.getItem('grabberSideY') as string, 10));
        expect(service.grabberRight.x).toEqual(parseInt(localStorage.getItem('grabberRightX') as string, 10));
        expect(service.grabberRight.y).toEqual(parseInt(localStorage.getItem('grabberRightY') as string, 10));
    });

    it('should reset canvas information to default dimensions in the local storage', () => {
        service.setLocalStorage('');
        const spy = spyOn(service, 'setLocalStorage').and.callThrough();

        service.newDrawing();

        expect(spy).toHaveBeenCalled();
        expect(service.canvasSize.x).toEqual(DEFAULT_WIDTH);
        expect(service.canvasSize.y).toEqual(DEFAULT_HEIGHT);
        expect(service.dotSize.x).toEqual(DEFAULT_WIDTH);
        expect(service.dotSize.y).toEqual(DEFAULT_HEIGHT);
        expect(service.grabberBottom.x).toEqual(DEFAULT_WIDTH_GRABBER_BOTTOM);
        expect(service.grabberBottom.y).toEqual(DEFAULT_HEIGHT_GRABBER_BOTTOM);
        expect(service.grabberSide.x).toEqual(DEFAULT_WIDTH_GRABBER_SIDE);
        expect(service.grabberSide.y).toEqual(DEFAULT_HEIGHT_GRABBER_SIDE);
        expect(service.grabberRight.x).toEqual(DEFAULT_WIDTH_GRABBER_RIGHT);
        expect(service.grabberRight.y).toEqual(DEFAULT_HEIGHT_GRABBER_RIGHT);
    });

    it('should draw image from url on canvas', () => {
        service.drawURICanvas(url);
        expect(service.imageCanvas.src).toEqual(url);
    });

    it('should return url canvas', () => {
        service.copiedCanvas = url;
        service.copyCanvas();
        expect(service.copiedCanvas).toEqual(url);
    });
});

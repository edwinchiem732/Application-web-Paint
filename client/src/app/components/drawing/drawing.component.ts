import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ResizeAction } from '@app/classes/resize-action';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { ResizeCanvasService } from '@app/services/resize-canvas.service';
import { SwitchToolsService } from '@app/services/switch-tools.service';
import { TextService } from '@app/services/text.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { PipetteService } from '@app/services/tools/pipette.service';
import { SelectionLassoService } from '@app/services/tools/selection-lasso.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { StampService } from '@app/services/tools/stamp.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('dot', { static: false }) dot: ElementRef<HTMLElement>;
    @ViewChild('sideGrabber', { static: false }) sideGrabber: ElementRef<HTMLElement>;
    @ViewChild('bottomGrabber', { static: false }) bottomGrabber: ElementRef<HTMLElement>;
    @ViewChild('rightGrabber', { static: false }) rightGrabber: ElementRef<HTMLElement>;
    @ViewChild('secondCanvas', { static: false }) secondCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('eraserCanvas', { static: false }) eraserCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('selectionCanvas', { static: false }) selectionCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('gridCanvas', { static: false }) gridCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasInput', { static: false }) canvasInput: ElementRef<HTMLInputElement>;

    private baseCtx: CanvasRenderingContext2D;
    private cursorPipette: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private secondCtx: CanvasRenderingContext2D;
    private eraserCtx: CanvasRenderingContext2D;
    private gridCtx: CanvasRenderingContext2D;
    private tools: Tool[];
    private currentTool: Tool;
    private oldX: number = 0;
    private oldY: number = 0;
    private grabber: boolean = false;
    private boolGrabberBottom: boolean = false;
    private boolGrabberRight: boolean = false;
    private resizable: boolean = false;
    private resizeAction: ResizeAction;
    private initialCanvas: ResizeAction;
    private oldCanvas: string = '';

    constructor(
        public drawingService: DrawingService,
        public pencilService: PencilService,
        public switchToolsService: SwitchToolsService,
        public eraserService: EraserService,
        private undoRedoService: UndoRedoService,
        public pipetteService: PipetteService,
        public stampService: StampService,
        public selectionService: SelectionService,
        public gridService: GridService,
        public resizeCanvasService: ResizeCanvasService,
        public textService: TextService,
        public selectionLassoService: SelectionLassoService,
    ) {
        this.tools = [pencilService];
        this.currentTool = this.tools[0];
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.previewCanvas = this.previewCanvas.nativeElement;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.backgroundCanvas(this.baseCtx);
        this.drawingService.previewColorAtPosition = this.cursorPipette;
        this.secondCtx = this.secondCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.eraserCtx = this.eraserCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.secondCtx = this.secondCtx;
        this.drawingService.eraserCtx = this.eraserCtx;
        this.drawingService.selectionCtx = this.selectionCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.gridCtx = this.gridCtx;
        this.textService.input = this.canvasInput.nativeElement;
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.gridService.drawGrid();
        this.switchToolsService.currentTool.onMouseMove(event);
        this.currentTool.onMouseMove(event);

        if (this.grabber) {
            this.resizeCanvasService.resizerDot(event.clientY - this.oldY, event.clientX - this.oldX);
            this.oldY = event.clientY;
            this.oldX = event.clientX;

            this.dot.nativeElement.style.border = 'dotted';
            this.dot.nativeElement.style.border = '99';
            this.dot.nativeElement.style.border = '!important';
        }
        if (this.boolGrabberBottom) {
            this.resizeCanvasService.resizerDotBottom(event.clientY - this.oldY);
            this.oldY = event.clientY;

            this.dot.nativeElement.style.border = 'dotted';
            this.dot.nativeElement.style.border = '99';
            this.dot.nativeElement.style.border = '!important';
        }
        if (this.boolGrabberRight) {
            this.resizeCanvasService.resizerDotRight(event.clientX - this.oldX);
            this.oldX = event.clientX;

            this.dot.nativeElement.style.border = 'dotted';
            this.dot.nativeElement.style.border = '99';
            this.dot.nativeElement.style.border = '!important';
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (
            !this.sideGrabber.nativeElement.contains(event.target as Node) &&
            !this.bottomGrabber.nativeElement.contains(event.target as Node) &&
            !this.rightGrabber.nativeElement.contains(event.target as Node)
        ) {
            this.switchToolsService.currentTool.onMouseDown(event);
        }

        if (this.sideGrabber.nativeElement.contains(event.target as Node)) {
            this.grabber = true;
            this.oldY = event.clientY;
            this.oldX = event.clientX;
            this.resizable = true;
        }
        if (this.bottomGrabber.nativeElement.contains(event.target as Node)) {
            this.boolGrabberBottom = true;
            this.oldY = event.clientY;
            this.resizable = true;
        }
        if (this.rightGrabber.nativeElement.contains(event.target as Node)) {
            this.boolGrabberRight = true;
            this.oldX = event.clientX;
            this.resizable = true;
        }
        this.initialCanvas = new ResizeAction(
            this.drawingService,
            this.drawingService.canvasSize.x,
            this.drawingService.canvasSize.y,
            this.oldCanvas,
        );
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.gridService.drawGrid();
        this.switchToolsService.currentTool.onMouseUp(event);
        this.currentTool.onMouseUp(event);

        this.grabber = false;
        this.boolGrabberBottom = false;
        this.boolGrabberRight = false;

        this.resizeCanvasService.resizer();

        this.dot.nativeElement.style.border = 'solid';
        this.dot.nativeElement.style.border = '2px';
        this.dot.nativeElement.style.zIndex = '0';

        // Make a copy of the drawing
        if (this.resizable) {
            this.oldCanvas = this.baseCanvas.nativeElement.toDataURL();
            const image = new Image();
            image.src = this.oldCanvas;
            image.onload = () => {
                this.baseCtx.drawImage(image, 0, 0);
            };
            this.resizeAction = new ResizeAction(
                this.drawingService,
                this.drawingService.canvasSize.x,
                this.drawingService.canvasSize.y,
                this.oldCanvas,
            );
            if (this.initialCanvas !== this.resizeAction) {
                this.undoRedoService.addInitialCanvas(this.initialCanvas);
            }
            this.undoRedoService.addAction(this.resizeAction);
            this.resizable = false;
        }
        // local storage saving
        this.drawingService.setLocalStorage(this.drawingService.copyCanvas());
    }

    get width(): number {
        return this.drawingService.canvasSize.x;
    }

    get height(): number {
        return this.drawingService.canvasSize.y;
    }

    get cursorChoice(): string {
        return this.drawingService.cursorImage;
    }

    @HostListener('mouseout', ['$event'])
    onMouseOut(event: MouseEvent): void {
        this.switchToolsService.currentTool.onMouseOut(event);
        this.currentTool.onMouseOut(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.switchToolsService.currentTool.onMouseEnter(event);
        this.currentTool.onMouseEnter(event);
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        if (
            this.gridCanvas.nativeElement.contains(event.target as Node) ||
            this.baseCanvas.nativeElement.contains(event.target as Node) ||
            this.previewCanvas.nativeElement.contains(event.target as Node)
        ) {
            this.switchToolsService.currentTool.onMouseClick(event);
        }
    }

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        this.switchToolsService.currentTool.onMouseDoubleClick(event);
    }

    @HostListener('window:keyup', ['$event'])
    selectKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.selectionLassoService.shortcutDisabledLasso = true;
            this.selectionService.shortcutDisabled = true;
            this.switchToolsService.currentTool.onShiftUp(event);
        }
    }

    @HostListener('window:keydown', ['$event'])
    shortcutSelect(keyboardEvent: KeyboardEvent): void {
        switch (keyboardEvent.key) {
            case 'Shift':
                this.switchToolsService.currentTool.onShiftDown(keyboardEvent);
                break;
            case 'Escape':
                this.switchToolsService.currentTool.onEscape(keyboardEvent);
                break;
            case 'Backspace':
                this.switchToolsService.currentTool.onBackspace(keyboardEvent);
                break;
        }
    }
}

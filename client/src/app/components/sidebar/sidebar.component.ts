import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cursorOptions } from '@app/classes/cursor-options';
import { ToolOptions } from '@app/classes/tool';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { ExportComponent } from '@app/components/export/export.component';
import { NewDrawingDialogComponent } from '@app/components/new-drawing-dialog/new-drawing-dialog.component';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { PaintBucketService } from '@app/services/paint-bucket/paint-bucket.service';
import { SwitchToolsService } from '@app/services/switch-tools.service';
import { TextService } from '@app/services/text.service';
import { AerosolService } from '@app/services/tools/aerosol.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { PipetteService } from '@app/services/tools/pipette.service';
import { PolygonService } from '@app/services/tools/polygon.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { SelectionLassoService } from '@app/services/tools/selection-lasso.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { StampService } from '@app/services/tools/stamp.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @ViewChild('pencil', { static: false }) pencil: ElementRef<HTMLElement>;
    @ViewChild('eraser', { static: false }) eraser: ElementRef<HTMLElement>;
    @ViewChild('line', { static: false }) line: ElementRef<HTMLElement>;
    @ViewChild('rectangle', { static: false }) rectangle: ElementRef<HTMLElement>;
    @ViewChild('ellipse', { static: false }) ellipse: ElementRef<HTMLElement>;
    @ViewChild('color', { static: false }) color: ElementRef<HTMLElement>;
    @ViewChild('polygon', { static: false }) polygon: ElementRef<HTMLElement>;
    @ViewChild('aerosol', { static: false }) aerosol: ElementRef<HTMLElement>;
    @ViewChild('selection', { static: false }) selection: ElementRef<HTMLElement>;
    @ViewChild('pipette', { static: false }) pipette: ElementRef<HTMLElement>;
    @ViewChild('stamp', { static: false }) stamp: ElementRef<HTMLElement>;
    @ViewChild('grid', { static: false }) grid: ElementRef<HTMLElement>;
    @ViewChild('paintBucket', { static: false }) paintBucket: ElementRef<HTMLElement>;
    @ViewChild('text', { static: false }) text: ElementRef<HTMLElement>;

    private ellipseTraceselected: string = 'contour';
    private selectionOption: string = 'rectangle';
    private isOpen: boolean = false;
    private saveDrawing: SaveDrawingComponent;
    private gridOn: boolean = false;

    constructor(
        public dialog: MatDialog,
        public eraserService: EraserService,
        public switchToolsService: SwitchToolsService,
        public drawingService: DrawingService,
        public rectangleService: RectangleService,
        public pencilService: PencilService,
        public lineService: LineService,
        public ellipseService: EllipseService,
        public undoRedoService: UndoRedoService,
        public polygonService: PolygonService,
        public aerosolService: AerosolService,
        public selectionService: SelectionService,
        public pipetteService: PipetteService,
        public stampService: StampService,
        public selectionLassoService: SelectionLassoService,
        public gridService: GridService,
        public paintBucketService: PaintBucketService,
        public textService: TextService,
    ) {}

    // tslint:disable-next-line: cyclomatic-complexity
    @HostListener('window:keydown', ['$event'])
    shortcutSelect(keyboardEvent: KeyboardEvent): void {
        if (this.isOpen || this.textService.disableShortcut) {
            // Do nothing
        } else {
            switch (keyboardEvent.key) {
                case 'e':
                    keyboardEvent.preventDefault();
                    this.openEraser();
                    break;
                case 'c':
                    keyboardEvent.preventDefault();
                    this.openPencil();
                    break;
                case '1':
                    keyboardEvent.preventDefault();
                    this.openRectangle();
                    break;
                case 'l':
                    keyboardEvent.preventDefault();
                    this.openLine();
                    break;
                case '2':
                    keyboardEvent.preventDefault();
                    this.openEllipse();
                    break;
                case 'r':
                    keyboardEvent.preventDefault();
                    this.selectionService.selectionOption = true;
                    this.selectionOption = 'rectangle';
                    this.openSelect();
                    break;
                case 's':
                    keyboardEvent.preventDefault();
                    this.selectionService.selectionOption = false;
                    this.selectionOption = 'ellipse';
                    this.openSelect();
                    break;
                case 'a':
                    keyboardEvent.preventDefault();
                    this.openAerosol();
                    break;
                case 'ArrowUp':
                    keyboardEvent.preventDefault();
                    this.selectionService.arrowUp = true;
                    break;
                case 'ArrowDown':
                    keyboardEvent.preventDefault();
                    this.selectionService.arrowDown = true;
                    break;
                case 'ArrowLeft':
                    keyboardEvent.preventDefault();
                    this.selectionService.arrowLeft = true;
                    break;
                case 'ArrowRight':
                    keyboardEvent.preventDefault();
                    this.selectionService.arrowRight = true;
                    break;
                case 'i':
                    keyboardEvent.preventDefault();
                    this.openPipette();
                    break;
                case '3':
                    keyboardEvent.preventDefault();
                    this.openPolygon();
                    break;
                case 'd':
                    keyboardEvent.preventDefault();
                    this.openStamp();
                    break;
                case 't':
                    keyboardEvent.preventDefault();
                    this.textSelect();
                    break;
                case 'g':
                    keyboardEvent.preventDefault();
                    if (this.gridOn === false) {
                        this.openGrid();
                    } else {
                        this.gridOn = !this.gridOn;
                        this.gridService.gridOn = this.gridOn;
                        this.gridService.drawGrid();
                    }
                    break;
                case 'b':
                    keyboardEvent.preventDefault();
                    this.openPaintBucket();
                    break;
                case 'v':
                    this.selectionOption = 'lasso';
                    this.switchToolsService.switchToolButtons(cursorOptions.test, ToolOptions.Lasso);
                    break;
            }
        }
    }

    @HostListener('window:keydown.control.o', ['$event'])
    newDrawingSelect(event: KeyboardEvent): void {
        if (this.isOpen) {
            // Do nothing
        } else {
            this.openNewDrawing();
            event.preventDefault();
        }
    }

    @HostListener('window:keydown.control.g', ['$event'])
    carrouselDrawing(event: KeyboardEvent): void {
        if (this.isOpen) {
            // Do nothing
        } else {
            this.openCarrousel();
        }
    }

    @HostListener('window:keydown.control.e', ['$event'])
    exportDrawing(event: KeyboardEvent): void {
        if (this.isOpen) {
            // Do nothing
        } else {
            this.openExport();
        }
    }

    @HostListener('window:keydown.control.z', ['$event'])
    undoSelect(event: KeyboardEvent): void {
        this.undoRedoService.undo();
        event.preventDefault();
    }

    @HostListener('window:keydown.control.shift.z', ['$event'])
    redoSelect(event: KeyboardEvent): void {
        this.selectionLassoService.shortcutDisabledLasso = true;
        this.selectionService.shortcutDisabled = true;
        this.undoRedoService.redo();
        event.preventDefault();
    }

    @HostListener('window:keydown.control.a', ['$event'])
    selectAll(event: KeyboardEvent): void {
        event.preventDefault();
        this.openSelect();
        this.selectionService.selectAllDrawing();
    }

    @HostListener('window:keydown.control.s', ['$event'])
    openSaveDrawing(event: KeyboardEvent): void {
        if (this.isOpen) {
            // Do nothing
        } else {
            this.openDialogSaveDrawing();
            event.preventDefault();
        }
    }

    @HostListener('window: keydown.shift', ['$event'])
    onShiftDown(event: KeyboardEvent): void {
        this.rectangleService.square = true;
        this.ellipseService.circle = true;
    }

    @HostListener('window: keyup.shift', ['$event'])
    onShiftUp(event: KeyboardEvent): void {
        this.rectangleService.square = false;
        this.ellipseService.circle = false;
        this.selectionService.onShiftUp(event);
    }

    @HostListener('window:keyup', ['$event'])
    onArrowUp(event: KeyboardEvent): void {
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            switch (event.key) {
                case 'ArrowUp':
                    this.selectionService.arrowUp = false;
                    break;
                case 'ArrowDown':
                    this.selectionService.arrowDown = false;
                    break;
                case 'ArrowLeft':
                    this.selectionService.arrowLeft = false;
                    break;
                case 'ArrowRight':
                    this.selectionService.arrowRight = false;
                    break;
            }
            this.selectionService.continuousMouvment = false;
        }
    }

    @HostListener('window: keydown', ['$event'])
    onArrow(event: KeyboardEvent): void {
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            this.selectionService.onArrow(event);
        }
        if (event.key === 'm') {
            this.selectionService.onKeyDown(event);
            this.selectionLassoService.onKeyDown(event);
        }
    }

    @HostListener('window: wheel', ['$event'])
    changeAngleWithWheel(event: WheelEvent): void {
        // this.stampService.addOrRetract(event);
        this.stampService.changeAngle();
    }

    @HostListener('window:keydown.control.c', ['$event'])
    copySelection(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.switchToolsService.isCurrentTool(ToolOptions.Selection)) {
            this.selectionService.copyCanvas();
        } else if (this.switchToolsService.isCurrentTool(ToolOptions.Lasso)) {
            this.selectionLassoService.copyCanvas();
        }
    }

    @HostListener('window:keydown.control.v', ['$event'])
    pasteSelection(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.switchToolsService.isCurrentTool(ToolOptions.Selection)) {
            this.selectionService.pasteCanvas();
        } else if (this.switchToolsService.isCurrentTool(ToolOptions.Lasso)) {
            this.selectionLassoService.pasteCanvas();
        }
        this.selectionService.selectedBtn = true;
        this.selectionLassoService.selectedBtn = true;
    }

    @HostListener('window:keydown.control.x', ['$event'])
    cutSelection(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.switchToolsService.isCurrentTool(ToolOptions.Selection)) {
            this.selectionService.cutCanvas();
        } else if (this.switchToolsService.isCurrentTool(ToolOptions.Lasso)) {
            this.selectionLassoService.cutCanvas();
        }
        this.selectionService.selectedBtn = false;
        this.selectionLassoService.selectedBtn = false;
    }

    @HostListener('window:keydown.delete', ['$event'])
    deleteSelection(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.switchToolsService.isCurrentTool(ToolOptions.Selection)) {
            this.selectionService.cutCanvas();
        } else if (this.switchToolsService.isCurrentTool(ToolOptions.Lasso)) {
            this.selectionLassoService.cutCanvas();
        }
    }

    selectButton(): void {
        if (this.selectionOption === 'rectangle' || this.selectionOption === 'ellipse') {
            this.switchToolsService.switchToolButtons(cursorOptions.test, ToolOptions.Selection);
        } else {
            this.switchToolsService.switchToolButtons(cursorOptions.test, ToolOptions.Lasso);
        }
    }

    // to open attributes bar
    sidebarAttributes(
        pencilChoice: string,
        eraserChoice: string,
        lineChoice: string,
        rectangleChoice: string,
        ellipseChoice: string,
        colorChoice: string,
        polygonChoice: string,
        aerosolChoice: string,
        selectionChoice: string,
        pipetteChoice: string,
        stampChoice: string,
        gridChoice: string,
        paintBucketChoice: string,
        textChoice: string,
    ): void {
        this.pencil.nativeElement.style.display = pencilChoice;
        this.eraser.nativeElement.style.display = eraserChoice;
        this.line.nativeElement.style.display = lineChoice;
        this.rectangle.nativeElement.style.display = rectangleChoice;
        this.ellipse.nativeElement.style.display = ellipseChoice;
        this.color.nativeElement.style.display = colorChoice;
        this.polygon.nativeElement.style.display = polygonChoice;
        this.aerosol.nativeElement.style.display = aerosolChoice;
        this.selection.nativeElement.style.display = selectionChoice;
        this.pipette.nativeElement.style.display = pipetteChoice;
        this.stamp.nativeElement.style.display = stampChoice;
        this.grid.nativeElement.style.display = gridChoice;
        this.paintBucket.nativeElement.style.display = paintBucketChoice;
        this.text.nativeElement.style.display = textChoice;
    }

    closeInputText(): void {
        this.textService.applyText();
        this.textService.input.style.display = 'none';
        this.textService.input.value = '';
        this.textService.disableShortcut = false;
    }

    disableShortcutsSelection(): void {
        this.selectionService.shortcutDisabled = false;
        this.selectionLassoService.shortcutDisabledLasso = false;
    }

    undoButton(): void {
        this.undoRedoService.undo();
    }

    redoButton(): void {
        this.undoRedoService.redo();
    }

    textSelect(): void {
        this.switchToolsService.textButton();
        this.sidebarAttributes('none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'flex');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openColor(): void {
        this.sidebarAttributes('none', 'none', 'none', 'none', 'none', 'flex', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openPencil(): void {
        this.switchToolsService.pencilButton();
        this.sidebarAttributes('flex', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openEraser(): void {
        this.switchToolsService.eraserButton();
        this.sidebarAttributes('none', 'flex', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openPipette(): void {
        this.switchToolsService.pipetteButton();
        this.sidebarAttributes('none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'flex', 'none', 'none', 'none', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openLine(): void {
        this.switchToolsService.lineButton();
        this.sidebarAttributes('none', 'none', 'flex', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openRectangle(): void {
        this.switchToolsService.rectangleButton();
        this.sidebarAttributes('none', 'none', 'none', 'flex', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openEllipse(): void {
        this.switchToolsService.ellipseButton();
        this.sidebarAttributes('none', 'none', 'none', 'none', 'flex', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none');
        this.closeInputText();
        this.ellipseService.ellipseTrace = this.ellipseTraceselected;
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openPolygon(): void {
        this.switchToolsService.polygonButton();
        this.sidebarAttributes('none', 'none', 'none', 'none', 'none', 'none', 'flex', 'none', 'none', 'none', 'none', 'none', 'none', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openStamp(): void {
        this.switchToolsService.stampButton();
        this.sidebarAttributes('none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'flex', 'none', 'none', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openAerosol(): void {
        this.switchToolsService.aerosolButton();
        this.sidebarAttributes('none', 'none', 'none', 'none', 'none', 'none', 'none', 'flex', 'none', 'none', 'none', 'none', 'none', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openSelect(): void {
        this.selectButton();
        this.sidebarAttributes('none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'flex', 'none', 'none', 'none', 'none', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openGrid(): void {
        this.sidebarAttributes('none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'flex', 'none', 'none');
        this.gridOn = !this.gridOn;
        this.gridService.gridOn = this.gridOn;
        this.gridService.drawGrid();
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    openPaintBucket(): void {
        this.switchToolsService.paintBucketButton();
        this.sidebarAttributes('none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'flex', 'none');
        this.closeInputText();
        this.disableShortcutsSelection();
    }

    changeSelectionForm(): void {
        this.selectionService.selectAllDrawing();
    }

    openNewDrawing(): void {
        if (this.drawingService.checkEmptyCanvas()) {
            // if not empty
            this.isOpen = true;
            const dialogRef = this.dialog.open(NewDrawingDialogComponent, { disableClose: true });
            // tslint:disable-next-line: deprecation
            dialogRef.afterClosed().subscribe((confirmErasing: boolean) => {
                if (confirmErasing) {
                    this.drawingService.clearCanvas(this.drawingService.baseCtx);
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.undoRedoService.clearActions();
                    this.drawingService.newDrawing();
                }
                this.isOpen = false;
            });
        }
    }

    openExport(): void {
        const dialogRef = this.dialog.open(ExportComponent, { disableClose: true });
        this.isOpen = true;
        // tslint:disable-next-line: deprecation
        dialogRef.afterClosed().subscribe((confirmErasing: boolean) => {
            this.isOpen = false;
        });
    }

    openCarrousel(): void {
        const dialogRef = this.dialog.open(CarrouselComponent, { disableClose: true, height: '90%', width: '90%' });
        this.isOpen = true;
        // tslint:disable-next-line: deprecation
        dialogRef.afterClosed().subscribe((confirmErasing: boolean) => {
            this.isOpen = false;
        });
    }

    openDialogSaveDrawing(): void {
        const dialogRef = this.dialog.open(SaveDrawingComponent, { disableClose: true, height: '400px', width: '600px' });
        this.isOpen = true;
        // tslint:disable-next-line: deprecation
        dialogRef.afterClosed().subscribe((confirmErasing: boolean) => {
            if (confirmErasing) {
                this.saveDrawing.errorServer = false;
            }
            this.isOpen = false;
        });
    }
    // tslint:disable-next-line: max-file-line-count
}

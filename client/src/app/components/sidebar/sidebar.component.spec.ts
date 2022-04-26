import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ColorService } from '@app/services/color.service';
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
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let spyOnDrawing: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let oneEvent: KeyboardEvent;
    let twoEvent: KeyboardEvent;
    let threeEvent: KeyboardEvent;
    let sEvent: KeyboardEvent;
    let rEvent: KeyboardEvent;
    let aEvent: KeyboardEvent;
    let eEvent: KeyboardEvent;
    let lEvent: KeyboardEvent;
    let dEvent: KeyboardEvent;
    let cEvent: KeyboardEvent;
    let tEvent: KeyboardEvent;
    let bEvent: KeyboardEvent;
    let vEvent: KeyboardEvent;
    let mEvent: KeyboardEvent;
    let xEvent: KeyboardEvent;
    let deleteEvent: KeyboardEvent;
    let arrowDownEvent: KeyboardEvent;
    let arrowLeftEvent: KeyboardEvent;
    let arrowRightEvent: KeyboardEvent;
    let arrowUpEvent: KeyboardEvent;
    let arrowUpUpEvent: KeyboardEvent;
    let arrowDownUpEvent: KeyboardEvent;
    let arrowLeftUpEvent: KeyboardEvent;
    let arrowRightUpEvent: KeyboardEvent;
    let shiftEvent: KeyboardEvent;
    let spyOnUndoRedo: UndoRedoService;
    let spyOnSelectionService: SelectionService;
    let switchToolsService: SwitchToolsService;
    let paintBucketService: PaintBucketService;
    let eraserService: EraserService;
    let pencilService: PencilService;
    let rectangleService: RectangleService;
    let ellipseService: EllipseService;
    let selectionService: SelectionService;
    let selectionLasso: SelectionLassoService;
    let lineService: LineService;
    let polygonService: PolygonService;
    let aerosolService: AerosolService;
    let pipetteService: PipetteService;
    let stampService: StampService;
    let colorService: ColorService;
    let undoRedoService: UndoRedoService;
    let gridService: GridService;
    let textServiceSpyObj: jasmine.SpyObj<TextService>;
    let inputStub: HTMLInputElement;

    let dialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async(() => {
        inputStub = {
            style: { display: 'randomDisplay' },
            value: '',
        } as HTMLInputElement;

        textServiceSpyObj = jasmine.createSpyObj('TextService', ['applyText'], {
            input: inputStub,
        });
        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [{ provide: TextService, useValue: textServiceSpyObj }],
        }).compileComponents();
    }));
    /* tslint:disable:no-string-literal */
    beforeEach(() => {
        spyOnDrawing = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'cursorImage', 'clearCanvas', 'checkEmptyCanvas']);
        spyOnUndoRedo = jasmine.createSpyObj('UndoRedoService', ['undo', 'redo']);
        spyOnSelectionService = jasmine.createSpyObj('SelectionService', ['selectAllDrawing', 'onArrow', 'shortcutDisabled']);
        canvasTestHelper = new CanvasTestHelper();

        dialog = jasmine.createSpyObj('MatDialog', ['open', 'afterClosed']);
        colorService = new ColorService();
        undoRedoService = new UndoRedoService(spyOnDrawing);
        gridService = new GridService(spyOnDrawing);
        paintBucketService = new PaintBucketService(spyOnDrawing, colorService, undoRedoService);
        pencilService = new PencilService(spyOnDrawing, colorService, undoRedoService);
        eraserService = new EraserService(spyOnDrawing, undoRedoService);
        lineService = new LineService(spyOnDrawing, colorService, undoRedoService);
        aerosolService = new AerosolService(spyOnDrawing, colorService, undoRedoService);
        rectangleService = new RectangleService(spyOnDrawing, colorService, undoRedoService);
        ellipseService = new EllipseService(spyOnDrawing, colorService, undoRedoService);
        selectionService = new SelectionService(spyOnDrawing, undoRedoService, gridService);
        selectionLasso = new SelectionLassoService(spyOnDrawing, lineService, undoRedoService, selectionService, gridService);
        stampService = new StampService(spyOnDrawing, undoRedoService);
        polygonService = new PolygonService(spyOnDrawing, colorService, undoRedoService);
        pipetteService = new PipetteService(spyOnDrawing, colorService);
        switchToolsService = new SwitchToolsService(
            eraserService,
            pencilService,
            lineService,
            rectangleService,
            ellipseService,
            polygonService,
            aerosolService,
            selectionService,
            pipetteService,
            stampService,
            selectionLasso,
            spyOnDrawing,
            paintBucketService,
            textServiceSpyObj,
        );
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: DrawingService, useValue: spyOnDrawing },
                { provide: MatDialog, useValue: dialog },
                { provide: UndoRedoService, useValue: spyOnUndoRedo },
                { provide: SelectionService, useValue: spyOnSelectionService },
                { provide: SwitchToolsService, useValue: switchToolsService },
                { provide: EllipseService, useValue: ellipseService },
                { provide: RectangleService, useValue: rectangleService },
                { provide: EraserService, useValue: eraserService },
                { provide: StampService, useValue: stampService },
                { provide: SelectionLassoService, useValue: selectionLasso },
                { provide: SelectionService, useValue: selectionService },
                { provide: PaintBucketService, useValue: paintBucketService },
                { provide: TextService, useValue: textServiceSpyObj },
                { provide: AerosolService, useValue: aerosolService },
                { provide: StampService, useValue: stampService },
                { provide: PipetteService, useValue: pipetteService },
                { provide: LineService, useValue: lineService },
                { provide: PolygonService, useValue: polygonService },
                { provide: PencilService, useValue: pencilService },
            ],
            imports: [MatDialogModule],
        }).compileComponents();
        fixture = TestBed.createComponent(SidebarComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;

        spyOnDrawing = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
        spyOnDrawing.baseCtx = baseCtxClone;
        spyOnDrawing.previewCtx = previewCtxClone;
        spyOnDrawing.canvas = canvas;

        shiftEvent = new KeyboardEvent('keypress', {
            key: 'Shift',
        });

        deleteEvent = new KeyboardEvent('keypress', {
            key: 'Delete',
        });

        oneEvent = new KeyboardEvent('keypress', {
            key: '1',
        });

        twoEvent = new KeyboardEvent('keypress', {
            key: '2',
        });

        threeEvent = new KeyboardEvent('keypress', {
            key: '3',
        });

        eEvent = new KeyboardEvent('keypress', {
            key: 'e',
        });

        mEvent = new KeyboardEvent('keypress', {
            key: 'm',
        });

        xEvent = new KeyboardEvent('keypress', {
            key: 'x',
        });

        tEvent = new KeyboardEvent('keypress', {
            key: 't',
        });

        bEvent = new KeyboardEvent('keypress', {
            key: 'b',
        });

        vEvent = new KeyboardEvent('keypress', {
            key: 'v',
        });

        rEvent = new KeyboardEvent('keypress', {
            key: 'r',
        });

        cEvent = new KeyboardEvent('keypress', {
            key: 'c',
        });

        aEvent = new KeyboardEvent('keypress', {
            key: 'a',
        });

        sEvent = new KeyboardEvent('keypress', {
            key: 's',
        });

        lEvent = new KeyboardEvent('keypress', {
            key: 'l',
        });

        dEvent = new KeyboardEvent('keypress', {
            key: 'd',
        });

        arrowUpEvent = new KeyboardEvent('keypress', {
            key: 'ArrowUp',
        });

        arrowDownEvent = new KeyboardEvent('keypress', {
            key: 'ArrowDown',
        });

        arrowLeftEvent = new KeyboardEvent('keypress', {
            key: 'ArrowLeft',
        });

        arrowRightEvent = new KeyboardEvent('keypress', {
            key: 'ArrowRight',
        });

        arrowUpUpEvent = new KeyboardEvent('keyup', {
            key: 'ArrowUp',
        });

        arrowDownUpEvent = new KeyboardEvent('keyup', {
            key: 'ArrowDown',
        });

        arrowLeftUpEvent = new KeyboardEvent('keyup', {
            key: 'ArrowLeft',
        });

        arrowRightUpEvent = new KeyboardEvent('keyup', {
            key: 'ArrowRight',
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call closeInputText', () => {
        component.closeInputText();
        expect(textServiceSpyObj.applyText).toHaveBeenCalled();
        expect(textServiceSpyObj.input.style.display).toEqual('none');
        expect(textServiceSpyObj.input.value).toEqual('');
    });

    it('should call on case e (window keydown e) openEraser', () => {
        const spy = spyOn(component, 'openEraser').and.callThrough();
        const spy2 = spyOn(component, 'closeInputText').and.callThrough();
        component.shortcutSelect(eEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should call openPencil() on window keydown c', () => {
        const spy = spyOn(component, 'openPencil').and.callThrough();
        const spy2 = spyOn(component, 'closeInputText').and.callThrough();
        component.shortcutSelect(cEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should call on openRectangle() on window keydown 1', () => {
        const spy = spyOn(component, 'openRectangle').and.callThrough();
        const spy2 = spyOn(component, 'closeInputText').and.callThrough();
        component.shortcutSelect(oneEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should call openLine() window keydown l', () => {
        const spy = spyOn(component, 'openLine').and.callThrough();
        const spy2 = spyOn(component, 'closeInputText').and.callThrough();
        component.shortcutSelect(lEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should call openEraser() on window keydown e', () => {
        component.shortcutSelect(shiftEvent);
        expect(component.rectangleService.square).toEqual(false);
        expect(component.ellipseService.circle).toEqual(false);
    });

    it('should call openAerosol() on window keydown a', () => {
        const spy = spyOn(component, 'openAerosol').and.callThrough();
        const spy2 = spyOn(component, 'closeInputText').and.callThrough();
        component.shortcutSelect(aEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should call openSelect() on window keydown r', () => {
        const spy = spyOn(component, 'openSelect').and.callThrough();
        const spy2 = spyOn(component, 'closeInputText').and.callThrough();
        component.shortcutSelect(rEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should call openStamp() on window keydown d', () => {
        const spy = spyOn(component, 'openStamp').and.callThrough();
        const spy2 = spyOn(component, 'closeInputText').and.callThrough();
        component.shortcutSelect(dEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should set arrow up to true on window keydown arrow up', () => {
        component.shortcutSelect(arrowUpEvent);
        expect(component.selectionService.arrowUp).toEqual(true);
    });

    it('should set arrow down to true on window keydown arrow down', () => {
        component.shortcutSelect(arrowDownEvent);
        expect(component.selectionService.arrowDown).toEqual(true);
    });

    it('should set arrow left to true on window keydown arrow left', () => {
        component.shortcutSelect(arrowLeftEvent);
        expect(component.selectionService.arrowLeft).toEqual(true);
    });

    it('should set arrow right to true on window keydown arrow right', () => {
        component.shortcutSelect(arrowRightEvent);
        expect(component.selectionService.arrowRight).toEqual(true);
    });

    it('should set arrow up to false on window keyup arrow up', () => {
        component.onArrowUp(arrowUpUpEvent);
        expect(component.selectionService.arrowUp).toEqual(false);
        expect(component.selectionService.continuousMouvment).toEqual(false);
    });

    it('should set arrow down to false on window keyup arrow down', () => {
        component.onArrowUp(arrowDownUpEvent);
        expect(component.selectionService.arrowDown).toEqual(false);
        expect(component.selectionService.continuousMouvment).toEqual(false);
    });

    it('should set arrow left to false on window keyup arrow left', () => {
        component.onArrowUp(arrowLeftUpEvent);
        expect(component.selectionService.arrowLeft).toEqual(false);
        expect(component.selectionService.continuousMouvment).toEqual(false);
    });

    it('should set arrow right to false on window keyup arrow right', () => {
        component.onArrowUp(arrowRightUpEvent);
        expect(component.selectionService.arrowRight).toEqual(false);
        expect(component.selectionService.continuousMouvment).toEqual(false);
    });

    it('should call openSelect() elipse on window keydown s', () => {
        const spy = spyOn(component, 'openSelect').and.callThrough();
        component.shortcutSelect(sEvent);
        expect(component.selectionService.selectionOption).toEqual(false);
        expect(component['selectionOption']).toEqual('ellipse');
        expect(spy).toHaveBeenCalled();
    });

    it('should call openEllipse() on window keydown 2', () => {
        const spy = spyOn(component, 'openEllipse').and.callThrough();
        component.shortcutSelect(twoEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call openPolygon() on window keydown 3', () => {
        const spy = spyOn(component, 'openPolygon').and.stub();
        component.shortcutSelect(threeEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should open new drawing on window keydown control o', () => {
        const event = new KeyboardEvent('window:keydown.control.o', {});
        const spy = spyOn(component, 'openNewDrawing').and.callThrough();
        component.newDrawingSelect(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should open Save Drawing Dialog on window keydown control s', () => {
        const event = new KeyboardEvent('window:keydown.control.s', {});
        const spy = spyOn(component, 'openDialogSaveDrawing');
        component.openSaveDrawing(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should not open Save Drawing Dialog on window keydown control s', () => {
        const event = new KeyboardEvent('window:keydown.control.s', {});
        const spy = spyOn(component, 'openDialogSaveDrawing');
        component['isOpen'] = true;
        component.openSaveDrawing(event);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should select all on window keydown control a', () => {
        const event = new KeyboardEvent('window:keydown.control.a', {});
        const spy = spyOn(component, 'openSelect').and.callThrough();
        component.selectAll(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should undo drawing on window keydown control z', () => {
        const event = new KeyboardEvent('window:keydown.control.z', {});
        component.undoSelect(event);
        expect(spyOnUndoRedo.undo).toHaveBeenCalled();
    });

    it('should redo drawing on window keydown control shift z', () => {
        const event = new KeyboardEvent('window:keydown.control.shift.z', {});
        component.redoSelect(event);
        expect(spyOnUndoRedo.redo).toHaveBeenCalled();
    });

    it('should go from square to rectangle and circle to ellipse on keyup shift ', () => {
        const event = new KeyboardEvent('window:keyup.shift', {});
        component.onShiftUp(event);
        expect(component.rectangleService.square).toEqual(false);
        expect(component.ellipseService.circle).toEqual(false);
    });

    it('should undo drawing', () => {
        component.undoButton();
        expect(spyOnUndoRedo.undo).toHaveBeenCalled();
    });

    it('should redo drawing', () => {
        component.redoButton();
        expect(spyOnUndoRedo.redo).toHaveBeenCalled();
    });

    it('should open the sidebar attributes for color and its fonctionnality ', () => {
        const spy = spyOn(component, 'sidebarAttributes').and.callThrough();
        component.openColor();
        expect(spy).toHaveBeenCalled();
        expect(component.pencil.nativeElement.style.display).toEqual('none');
        expect(component.eraser.nativeElement.style.display).toEqual('none');
        expect(component.line.nativeElement.style.display).toEqual('none');
        expect(component.rectangle.nativeElement.style.display).toEqual('none');
        expect(component.ellipse.nativeElement.style.display).toEqual('none');
        expect(component.color.nativeElement.style.display).toEqual('flex');
        expect(component.polygon.nativeElement.style.display).toEqual('none');
        expect(component.selection.nativeElement.style.display).toEqual('none');
        expect(component.aerosol.nativeElement.style.display).toEqual('none');
        expect(component.pipette.nativeElement.style.display).toEqual('none');
        expect(component.stamp.nativeElement.style.display).toEqual('none');
        expect(component.grid.nativeElement.style.display).toEqual('none');
    });

    it('should open the sidebar attributes and its fonctionnality for pencil', () => {
        const spy = spyOn(component, 'sidebarAttributes').and.callThrough();
        const spyBtn = spyOn(switchToolsService, 'pencilButton').and.callThrough();

        component.openPencil();
        expect(spyBtn).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(component.pencil.nativeElement.style.display).toEqual('flex');
        expect(component.eraser.nativeElement.style.display).toEqual('none');
        expect(component.line.nativeElement.style.display).toEqual('none');
        expect(component.rectangle.nativeElement.style.display).toEqual('none');
        expect(component.ellipse.nativeElement.style.display).toEqual('none');
        expect(component.color.nativeElement.style.display).toEqual('none');
        expect(component.polygon.nativeElement.style.display).toEqual('none');
        expect(component.selection.nativeElement.style.display).toEqual('none');
        expect(component.aerosol.nativeElement.style.display).toEqual('none');
        expect(component.pipette.nativeElement.style.display).toEqual('none');
        expect(component.stamp.nativeElement.style.display).toEqual('none');
        expect(component.grid.nativeElement.style.display).toEqual('none');
    });

    it('should open the sidebar attributes and its fonctionnality for Eraser', () => {
        const spyBtn = spyOn(switchToolsService, 'eraserButton').and.callThrough();
        const spy = spyOn(component, 'openEraser').and.callThrough();
        component.openEraser();
        expect(spyBtn).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(component.pencil.nativeElement.style.display).toEqual('none');
        expect(component.eraser.nativeElement.style.display).toEqual('flex');
        expect(component.line.nativeElement.style.display).toEqual('none');
        expect(component.rectangle.nativeElement.style.display).toEqual('none');
        expect(component.ellipse.nativeElement.style.display).toEqual('none');
        expect(component.color.nativeElement.style.display).toEqual('none');
        expect(component.polygon.nativeElement.style.display).toEqual('none');
        expect(component.selection.nativeElement.style.display).toEqual('none');
        expect(component.aerosol.nativeElement.style.display).toEqual('none');
        expect(component.pipette.nativeElement.style.display).toEqual('none');
        expect(component.stamp.nativeElement.style.display).toEqual('none');
        expect(component.grid.nativeElement.style.display).toEqual('none');
    });

    it('should open the sidebar attributes  and its fonctionnality for Line', () => {
        const spyBtn = spyOn(switchToolsService, 'lineButton').and.callThrough();
        const spy = spyOn(component, 'openLine').and.callThrough();
        component.openLine();
        expect(spyBtn).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(component.pencil.nativeElement.style.display).toEqual('none');
        expect(component.eraser.nativeElement.style.display).toEqual('none');
        expect(component.line.nativeElement.style.display).toEqual('flex');
        expect(component.rectangle.nativeElement.style.display).toEqual('none');
        expect(component.ellipse.nativeElement.style.display).toEqual('none');
        expect(component.color.nativeElement.style.display).toEqual('none');
        expect(component.polygon.nativeElement.style.display).toEqual('none');
        expect(component.selection.nativeElement.style.display).toEqual('none');
        expect(component.aerosol.nativeElement.style.display).toEqual('none');
        expect(component.pipette.nativeElement.style.display).toEqual('none');
        expect(component.stamp.nativeElement.style.display).toEqual('none');
        expect(component.grid.nativeElement.style.display).toEqual('none');
    });

    it('should open the sidebar attributes and its fonctionnality for Rectangle', () => {
        const spyBtn = spyOn(switchToolsService, 'rectangleButton').and.callThrough();
        const spy = spyOn(component, 'openRectangle').and.callThrough();
        component.openRectangle();
        expect(spyBtn).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(component.pencil.nativeElement.style.display).toEqual('none');
        expect(component.eraser.nativeElement.style.display).toEqual('none');
        expect(component.line.nativeElement.style.display).toEqual('none');
        expect(component.rectangle.nativeElement.style.display).toEqual('flex');
        expect(component.ellipse.nativeElement.style.display).toEqual('none');
        expect(component.color.nativeElement.style.display).toEqual('none');
        expect(component.polygon.nativeElement.style.display).toEqual('none');
        expect(component.selection.nativeElement.style.display).toEqual('none');
        expect(component.aerosol.nativeElement.style.display).toEqual('none');
        expect(component.pipette.nativeElement.style.display).toEqual('none');
        expect(component.stamp.nativeElement.style.display).toEqual('none');
        expect(component.grid.nativeElement.style.display).toEqual('none');
    });

    it('should open the sidebar attributes and its fonctionnality for Ellipse', () => {
        const spyBtn = spyOn(switchToolsService, 'ellipseButton').and.callThrough();
        const spy = spyOn(component, 'sidebarAttributes').and.callThrough();
        component.openEllipse();
        expect(spyBtn).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(component.pencil.nativeElement.style.display).toEqual('none');
        expect(component.eraser.nativeElement.style.display).toEqual('none');
        expect(component.line.nativeElement.style.display).toEqual('none');
        expect(component.rectangle.nativeElement.style.display).toEqual('none');
        expect(component.ellipse.nativeElement.style.display).toEqual('flex');
        expect(component.color.nativeElement.style.display).toEqual('none');
        expect(component.polygon.nativeElement.style.display).toEqual('none');
        expect(component.selection.nativeElement.style.display).toEqual('none');
        expect(component.aerosol.nativeElement.style.display).toEqual('none');
        expect(component.pipette.nativeElement.style.display).toEqual('none');
        expect(component.stamp.nativeElement.style.display).toEqual('none');
        expect(component.grid.nativeElement.style.display).toEqual('none');
    });

    it('should open the sidebar attributes and its fonctionnality for Polygon', () => {
        const spyBtn = spyOn(switchToolsService, 'polygonButton').and.callThrough();
        const spy = spyOn(component, 'sidebarAttributes').and.callThrough();
        component.openPolygon();
        expect(spyBtn).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(component.pencil.nativeElement.style.display).toEqual('none');
        expect(component.eraser.nativeElement.style.display).toEqual('none');
        expect(component.line.nativeElement.style.display).toEqual('none');
        expect(component.rectangle.nativeElement.style.display).toEqual('none');
        expect(component.ellipse.nativeElement.style.display).toEqual('none');
        expect(component.color.nativeElement.style.display).toEqual('none');
        expect(component.polygon.nativeElement.style.display).toEqual('flex');
        expect(component.selection.nativeElement.style.display).toEqual('none');
        expect(component.aerosol.nativeElement.style.display).toEqual('none');
        expect(component.pipette.nativeElement.style.display).toEqual('none');
        expect(component.stamp.nativeElement.style.display).toEqual('none');
        expect(component.grid.nativeElement.style.display).toEqual('none');
    });

    it('should open the sidebar attributes and its fonctionnality for Aerosol', () => {
        const spyBtn = spyOn(switchToolsService, 'aerosolButton').and.callThrough();
        const spy = spyOn(component, 'sidebarAttributes').and.callThrough();
        component.openAerosol();
        expect(spyBtn).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(component.pencil.nativeElement.style.display).toEqual('none');
        expect(component.eraser.nativeElement.style.display).toEqual('none');
        expect(component.line.nativeElement.style.display).toEqual('none');
        expect(component.rectangle.nativeElement.style.display).toEqual('none');
        expect(component.ellipse.nativeElement.style.display).toEqual('none');
        expect(component.color.nativeElement.style.display).toEqual('none');
        expect(component.polygon.nativeElement.style.display).toEqual('none');
        expect(component.selection.nativeElement.style.display).toEqual('none');
        expect(component.aerosol.nativeElement.style.display).toEqual('flex');
        expect(component.pipette.nativeElement.style.display).toEqual('none');
        expect(component.stamp.nativeElement.style.display).toEqual('none');
        expect(component.grid.nativeElement.style.display).toEqual('none');
    });

    it('should open the sidebar attributes and its fonctionnality for Selection', () => {
        const spyBtn = spyOn(component, 'selectButton').and.callThrough();
        const spy = spyOn(component, 'sidebarAttributes').and.callThrough();
        component.openSelect();
        expect(spyBtn).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(component.pencil.nativeElement.style.display).toEqual('none');
        expect(component.eraser.nativeElement.style.display).toEqual('none');
        expect(component.line.nativeElement.style.display).toEqual('none');
        expect(component.rectangle.nativeElement.style.display).toEqual('none');
        expect(component.ellipse.nativeElement.style.display).toEqual('none');
        expect(component.color.nativeElement.style.display).toEqual('none');
        expect(component.polygon.nativeElement.style.display).toEqual('none');
        expect(component.selection.nativeElement.style.display).toEqual('flex');
        expect(component.aerosol.nativeElement.style.display).toEqual('none');
        expect(component.pipette.nativeElement.style.display).toEqual('none');
        expect(component.stamp.nativeElement.style.display).toEqual('none');
        expect(component.grid.nativeElement.style.display).toEqual('none');
    });

    it('should open the sidebar attributes and its fonctionnality for stamp', () => {
        const spyBtn = spyOn(switchToolsService, 'stampButton').and.callThrough();
        const spy = spyOn(component, 'sidebarAttributes').and.callThrough();
        component.openStamp();
        expect(spyBtn).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(component.pencil.nativeElement.style.display).toEqual('none');
        expect(component.eraser.nativeElement.style.display).toEqual('none');
        expect(component.line.nativeElement.style.display).toEqual('none');
        expect(component.rectangle.nativeElement.style.display).toEqual('none');
        expect(component.ellipse.nativeElement.style.display).toEqual('none');
        expect(component.color.nativeElement.style.display).toEqual('none');
        expect(component.polygon.nativeElement.style.display).toEqual('none');
        expect(component.selection.nativeElement.style.display).toEqual('none');
        expect(component.aerosol.nativeElement.style.display).toEqual('none');
        expect(component.pipette.nativeElement.style.display).toEqual('none');
        expect(component.stamp.nativeElement.style.display).toEqual('flex');
        expect(component.grid.nativeElement.style.display).toEqual('none');
    });

    it('when open new drawing is called, check isOpen is false', () => {
        spyOnDrawing.checkEmptyCanvas.and.returnValue(false);
        component.openNewDrawing();
        expect(component['isOpen']).toBeFalse();
    });

    it('should call switch tool button if selection option is not rectangle', () => {
        const spy = spyOn(switchToolsService, 'switchToolButtons');
        component['selectionOption'] = 'lasso';
        component.selectButton();
        expect(spy).toHaveBeenCalled();
    });

    it('should set shortcutDisabled to false', () => {
        component.disableShortcutsSelection();
        expect(selectionService.shortcutDisabled).toEqual(false);
    });

    it('should set shortcutDisabledLasso to false', () => {
        component.disableShortcutsSelection();
        expect(selectionLasso.shortcutDisabledLasso).toEqual(false);
    });

    it('should call textButton function', () => {
        const spy = spyOn(switchToolsService, 'textButton');
        component.textSelect();
        expect(spy).toHaveBeenCalled();
    });

    it('should call sidebar attributes with text select', () => {
        const spy = spyOn(component, 'sidebarAttributes');
        component.textSelect();
        expect(spy).toHaveBeenCalled();
    });

    it('should call close input text with text select', () => {
        const spy = spyOn(component, 'closeInputText');
        component.textSelect();
        expect(spy).toHaveBeenCalled();
    });

    it('should call disableShortcutsSelection with text select', () => {
        const spy = spyOn(component, 'disableShortcutsSelection');
        component.textSelect();
        expect(spy).toHaveBeenCalled();
    });

    it('should call disableShortcutsSelection with open color', () => {
        const spy = spyOn(component, 'disableShortcutsSelection');
        component.openColor();
        expect(spy).toHaveBeenCalled();
    });

    it('should call disableShortcutsSelection with open pencil', () => {
        const spy = spyOn(component, 'disableShortcutsSelection');
        component.openPencil();
        expect(spy).toHaveBeenCalled();
    });

    it('should call disableShortcutsSelection with open eraser', () => {
        const spy = spyOn(component, 'disableShortcutsSelection');
        component.openEraser();
        expect(spy).toHaveBeenCalled();
    });

    it('should call pipetteButton, sidebarAttributes, closeInputText and disableShortcutsSelection with open Pipette', () => {
        const spy1 = spyOn(switchToolsService, 'pipetteButton');
        const spy2 = spyOn(component, 'sidebarAttributes');
        const spy3 = spyOn(component, 'closeInputText');
        const spy4 = spyOn(component, 'disableShortcutsSelection');
        component.openPipette();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
        expect(spy4).toHaveBeenCalled();
    });

    it('should call disableShortcutsSelection with open line', () => {
        const spy = spyOn(component, 'disableShortcutsSelection');
        component.openLine();
        expect(spy).toHaveBeenCalled();
    });

    it('should call disableShortcutsSelection with open rectangle', () => {
        const spy = spyOn(component, 'disableShortcutsSelection');
        component.openRectangle();
        expect(spy).toHaveBeenCalled();
    });

    it('should set ellipseTrace value tp ellipseTraceseclected', () => {
        component.openEllipse();
        expect(ellipseService.ellipseTrace).toEqual('contour');
    });

    it('should call closeInputText with open ellipse', () => {
        const spy = spyOn(component, 'closeInputText');
        component.openEllipse();
        expect(spy).toHaveBeenCalled();
    });

    it('should call disableShortcutsSelection with open ellipse', () => {
        const spy = spyOn(component, 'disableShortcutsSelection');
        component.openEllipse();
        expect(spy).toHaveBeenCalled();
    });

    it('should call disableShortcutsSelection with open polygon', () => {
        const spy = spyOn(component, 'disableShortcutsSelection');
        component.openPolygon();
        expect(spy).toHaveBeenCalled();
    });

    it('should call disableShortcutsSelection with open stamp', () => {
        const spy = spyOn(component, 'disableShortcutsSelection');
        component.openStamp();
        expect(spy).toHaveBeenCalled();
    });

    it('should call disableShortcutsSelection with open select', () => {
        const spy = spyOn(component, 'disableShortcutsSelection');
        component.openSelect();
        expect(spy).toHaveBeenCalled();
    });

    it('should call paintBucketButton, sidebarAttributes, closeInputText and disableShortcutsSelection with open Pipette', () => {
        const spy1 = spyOn(switchToolsService, 'paintBucketButton');
        const spy2 = spyOn(component, 'sidebarAttributes');
        const spy3 = spyOn(component, 'closeInputText');
        const spy4 = spyOn(component, 'disableShortcutsSelection');
        component.openPaintBucket();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
        expect(spy4).toHaveBeenCalled();
    });

    it('should call on case t (window keydown t) textSelect', () => {
        const spy = spyOn(component, 'textSelect').and.callThrough();
        component.shortcutSelect(tEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call on case b (window keydown b) openPaintBucket', () => {
        const spy = spyOn(component, 'openPaintBucket').and.callThrough();
        component.shortcutSelect(bEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call on case v (window keydown v) openPaintBucket', () => {
        const spy = spyOn(switchToolsService, 'switchToolButtons').and.callThrough();
        component.shortcutSelect(vEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should set square from rectangle service to true on shift down', () => {
        component.onShiftDown(shiftEvent);
        expect(rectangleService.square).toEqual(true);
    });

    it('should call onArrow of selectionService on arrow', () => {
        const spy = spyOn(selectionService, 'onArrow');
        component.onArrow(arrowUpEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call onKeyDown of selectionService on key m', () => {
        const spy = spyOn(selectionService, 'onKeyDown');
        component.onArrow(mEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call onKeyDown of selectionLassoService on key m', () => {
        const spy = spyOn(selectionLasso, 'onKeyDown');
        component.onArrow(mEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call changeAngle of stampService on wheel event', () => {
        const wheelEvent = {
            y: 30,
        } as WheelEvent;
        const spy = spyOn(stampService, 'changeAngle');
        component.changeAngleWithWheel(wheelEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call pasteCanvas of selectionService if current tool is selection', () => {
        const spy = spyOn(selectionService, 'pasteCanvas');
        component.pasteSelection(vEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call cutCanvas of selectionService if current tool is selection', () => {
        const spy = spyOn(selectionService, 'cutCanvas');
        component.cutSelection(xEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call deleteSelection of if delete is pressed', () => {
        const spy = spyOn(selectionService, 'cutCanvas');
        component.deleteSelection(deleteEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call selectAllDrawing if changeSelectionForm is called', () => {
        const spy = spyOn(selectionService, 'selectAllDrawing');
        component.changeSelectionForm();
        expect(spy).toHaveBeenCalled();
    });

    it('should call drawGrid if g is pressed in shortcutSelect', () => {
        const spy = spyOn(gridService, 'drawGrid');
        component['gridOn'] = false;
        expect(spy).not.toHaveBeenCalled();
    });
    // tslint:disable-next-line: max-file-line-count
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ToolOptions } from '@app/classes/tool';
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
import { SelectionComponent } from './selection.component';

/* tslint:disable:no-string-literal */
describe('SelectionComponent', () => {
    let component: SelectionComponent;
    let fixture: ComponentFixture<SelectionComponent>;
    let drawingService: DrawingService;
    let undoRedoService: UndoRedoService;
    let gridService: GridService;
    let spySelectionService: jasmine.SpyObj<SelectionService>;
    let spySelectionLassoService: jasmine.SpyObj<SelectionLassoService>;
    let switchToolsServiceSpy: jasmine.SpyObj<SwitchToolsService>;
    let switchToolsServiceStub: SwitchToolsService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    let eraserService: EraserService;
    let pencilService: PencilService;
    let rectangleService: RectangleService;
    let ellipseService: EllipseService;
    let colorService: ColorService;
    let lineService: LineService;
    let polygonService: PolygonService;
    let aerosolService: AerosolService;
    let pipetteService: PipetteService;
    let stampService: StampService;
    let paintBucketService: PaintBucketService;
    let textService: TextService;

    beforeEach(async(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        colorService = new ColorService();
        paintBucketService = new PaintBucketService(drawingService, colorService, undoRedoService);
        pencilService = new PencilService(drawingService, colorService, undoRedoService);
        eraserService = new EraserService(drawingService, undoRedoService);
        lineService = new LineService(drawingService, colorService, undoRedoService);
        aerosolService = new AerosolService(drawingService, colorService, undoRedoService);
        rectangleService = new RectangleService(drawingService, colorService, undoRedoService);
        ellipseService = new EllipseService(drawingService, colorService, undoRedoService);
        stampService = new StampService(drawingService, undoRedoService);
        polygonService = new PolygonService(drawingService, colorService, undoRedoService);
        pipetteService = new PipetteService(drawingService, colorService);
        textService = new TextService(drawingService, colorService, undoRedoService);

        spySelectionService = jasmine.createSpyObj('SelectionService', [
            'copyCanvas',
            'cutCanvas',
            'pasteCanvas',
            'selectAllDrawing',
            'selectControlPoint',
            'selectedBtn',
            'magnetism',
            'initialise',
        ]);
        spySelectionLassoService = jasmine.createSpyObj('SelectionLassoService', [
            'copyCanvas',
            'cutCanvas',
            'pasteCanvas',
            'selectControlPoint',
            'magnetism',
            'selectedBtn',
            'initialise',
        ]);
        switchToolsServiceSpy = jasmine.createSpyObj('SwitchToolsService', [
            'switchToolButtons',
            'isCurrentTool',
            'tableTool',
            'currentTool',
            'switchTool',
        ]);
        drawingService = new DrawingService();
        undoRedoService = new UndoRedoService(drawingService);
        gridService = new GridService(drawingService);

        switchToolsServiceStub = new SwitchToolsService(
            eraserService,
            pencilService,
            lineService,
            rectangleService,
            ellipseService,
            polygonService,
            aerosolService,
            spySelectionService,
            pipetteService,
            stampService,
            spySelectionLassoService,
            drawingService,
            paintBucketService,
            textService,
        );

        TestBed.configureTestingModule({
            declarations: [SelectionComponent],
            providers: [
                { provide: DrawingService, useValue: drawingService },
                { provide: UndoRedoService, useValue: undoRedoService },
                { provide: SelectionService, useValue: spySelectionService },
                { provide: SelectionLassoService, useValue: spySelectionLassoService },
                { provide: SwitchToolsService, useValue: switchToolsServiceSpy },
                { provide: GridService, useValue: gridService },
                { provide: SwitchToolsService, useValue: switchToolsServiceStub },
            ],
        }).compileComponents();

        drawingService = TestBed.inject(DrawingService);
        drawingService.baseCtx = baseCtxClone;
        drawingService.previewCtx = previewCtxClone;
        drawingService.canvas = canvas;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should chose the rectangle for the type of selection', () => {
        const optionSelection = 'rectangle';
        const event = { value: optionSelection } as MatSelectChange;
        component.changeSelectionOption(event);
        expect(component.selectionOption).toEqual(optionSelection);
        expect(component.selectionService.selectionOption).toBeTrue();
    });

    it('should chose the ellipse for the type of selection', () => {
        const optionSelection = 'ellipse';
        const event = { value: optionSelection } as MatSelectChange;
        component.changeSelectionOption(event);
        expect(component.selectionOption).toEqual(optionSelection);
        expect(component.selectionService.selectionOption).toBeFalse();
    });

    it('should chose the lasso for the type of selection', () => {
        const optionSelection = 'lasso';
        const event = { value: optionSelection } as MatSelectChange;
        component.changeSelectionOption(event);
        expect(component.selectionOption).toEqual(optionSelection);
    });

    it('should call selectAllDrawing and switch service to SelectionService when lasso is on', () => {
        switchToolsServiceSpy.currentTool = switchToolsServiceSpy.tableTool[ToolOptions.Lasso];
        component.changeSelectionForm();
        expect(spySelectionService.selectAllDrawing).toHaveBeenCalled();
        expect(switchToolsServiceSpy.currentTool).toEqual(switchToolsServiceSpy.tableTool[ToolOptions.Selection]);
        expect(component.selectionOption).toEqual('rectangle');
    });

    it('should call selectAllDrawing and stay on SelectionService', () => {
        switchToolsServiceSpy.currentTool = switchToolsServiceSpy.tableTool[ToolOptions.Selection];
        component.changeSelectionForm();
        expect(spySelectionService.selectAllDrawing).toHaveBeenCalled();
        expect(switchToolsServiceSpy.currentTool).toEqual(switchToolsServiceSpy.tableTool[ToolOptions.Selection]);
        expect(component.selectionOption).toEqual('rectangle');
    });

    //--------------------------------------------
    it('should call copySelection for SelectionService', () => {
        switchToolsServiceStub.currentTool = switchToolsServiceStub.tableTool[ToolOptions.Selection];
        component.copySelection();
        expect(switchToolsServiceStub.currentTool).toEqual(switchToolsServiceStub.tableTool[ToolOptions.Selection]);
        expect(spySelectionService.copyCanvas).toHaveBeenCalled();
    });

    it('should call copySelection for SelectionLassoService', () => {
        switchToolsServiceStub.currentTool = switchToolsServiceStub.tableTool[ToolOptions.Lasso];

        component.copySelection();
        expect(spySelectionLassoService.copyCanvas).toHaveBeenCalled();
    });

    it('should call pasteSelection for SelectionService', () => {
        switchToolsServiceStub.currentTool = switchToolsServiceStub.tableTool[ToolOptions.Selection];

        component.pasteSelection();
        expect(spySelectionService.pasteCanvas).toHaveBeenCalled();
        expect(spySelectionService.selectedBtn).toEqual(true);
        expect(spySelectionLassoService.selectedBtn).toEqual(true);
    });

    it('should call pasteSelection for SelectionLassoService', () => {
        switchToolsServiceStub.currentTool = switchToolsServiceStub.tableTool[ToolOptions.Lasso];
        component.pasteSelection();
        expect(spySelectionLassoService.pasteCanvas).toHaveBeenCalled();
    });

    it('should call cutSelection for SelectionService', () => {
        switchToolsServiceStub.currentTool = switchToolsServiceStub.tableTool[ToolOptions.Selection];
        component.cutSelection();
        expect(spySelectionService.cutCanvas).toHaveBeenCalled();
    });

    it('should call cutSelection for SelectionLassoService', () => {
        switchToolsServiceStub.currentTool = switchToolsServiceStub.tableTool[ToolOptions.Lasso];
        component.cutSelection();
        expect(spySelectionLassoService.cutCanvas).toHaveBeenCalled();
    });

    it('should call deleteSelection for SelectionLassoService', () => {
        switchToolsServiceStub.currentTool = switchToolsServiceStub.tableTool[ToolOptions.Selection];
        component.deleteSelection();
        expect(spySelectionService.cutCanvas).toHaveBeenCalled();
    });

    it('should call deleteSelection for SelectionLassoService', () => {
        switchToolsServiceStub.currentTool = switchToolsServiceStub.tableTool[ToolOptions.Lasso];
        component.deleteSelection();
        expect(spySelectionLassoService.cutCanvas).toHaveBeenCalled();
    });
});

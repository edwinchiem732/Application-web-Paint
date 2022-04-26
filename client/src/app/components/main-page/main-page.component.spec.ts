import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/grid/grid.service';
import { IndexService } from '@app/services/index/index.service';
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
import { of } from 'rxjs';
import { MainPageComponent } from './main-page.component';

import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let indexServiceSpy: SpyObj<IndexService>;
    let sidebarComponent: SidebarComponent;
    let drawingService: DrawingService;
    // tslint:disable-next-line: prefer-const
    let matDialog: MatDialog;
    let eraserService: EraserService;
    let pencilService: PencilService;
    let rectangleService: RectangleService;
    let ellipseService: EllipseService;
    let colorService: ColorService;
    let selectionService: SelectionService;
    let selectionLasso: SelectionLassoService;
    let lineService: LineService;
    let undoRedoService: UndoRedoService;
    let gridService: GridService;
    let polygonService: PolygonService;
    let aerosolService: AerosolService;
    let pipetteService: PipetteService;
    let stampService: StampService;
    let switchToolService: SwitchToolsService;
    let paintBucketService: PaintBucketService;
    let textService: TextService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(async(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet', 'basicPost']);
        indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
        indexServiceSpy.basicPost.and.returnValue(of());

        canvasTestHelper = new CanvasTestHelper();

        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        drawingService = new DrawingService();
        colorService = new ColorService();
        gridService = new GridService(drawingService);
        undoRedoService = new UndoRedoService(drawingService);
        paintBucketService = new PaintBucketService(drawingService, colorService, undoRedoService);
        pencilService = new PencilService(drawingService, colorService, undoRedoService);
        eraserService = new EraserService(drawingService, undoRedoService);
        lineService = new LineService(drawingService, colorService, undoRedoService);
        aerosolService = new AerosolService(drawingService, colorService, undoRedoService);
        rectangleService = new RectangleService(drawingService, colorService, undoRedoService);
        ellipseService = new EllipseService(drawingService, colorService, undoRedoService);
        selectionService = new SelectionService(drawingService, undoRedoService, gridService);
        selectionLasso = new SelectionLassoService(drawingService, lineService, undoRedoService, selectionService, gridService);
        stampService = new StampService(drawingService, undoRedoService);
        polygonService = new PolygonService(drawingService, colorService, undoRedoService);
        pipetteService = new PipetteService(drawingService, colorService);
        textService = new TextService(drawingService, colorService, undoRedoService);
        switchToolService = new SwitchToolsService(
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
            drawingService,
            paintBucketService,
            textService,
        );

        sidebarComponent = new SidebarComponent(
            matDialog,
            eraserService,
            switchToolService,
            drawingService,
            rectangleService,
            pencilService,
            lineService,
            ellipseService,
            undoRedoService,
            polygonService,
            aerosolService,
            selectionService,
            pipetteService,
            stampService,
            selectionLasso,
            gridService,
            paintBucketService,
            textService,
        );

        drawingService.baseCtx = baseCtxClone;
        drawingService.previewCtx = previewCtxClone;
        drawingService.canvas = canvas;

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: IndexService, useValue: indexServiceSpy },
                { provide: SidebarComponent, useValue: sidebarComponent },
                { provide: DrawingService, useValue: drawingService },
            ],
        }).compileComponents();

        // url = canvas.toDataURL();
        drawingService.canvasSize = { x: 1000, y: 650 };
        drawingService.grabberSide = { x: 1000, y: 650 };
        drawingService.grabberRight = { x: 1000, y: 325 };
        drawingService.grabberBottom = { x: 500, y: 650 };

        localStorage.setItem('url', '');
        localStorage.setItem('width', drawingService.canvasSize.x + 'px');
        localStorage.setItem('height', drawingService.canvasSize.y + 'px');
        localStorage.setItem('grabberSideX', drawingService.grabberSide.x + 'px');
        localStorage.setItem('grabberSideY', drawingService.grabberSide.y + 'px');
        localStorage.setItem('grabberRightX', drawingService.grabberRight.x + 'px');
        localStorage.setItem('grabberRightY', drawingService.grabberRight.y + 'px');
        localStorage.setItem('grabberBottomX', drawingService.grabberBottom.x + 'px');
        localStorage.setItem('grabberBottomY', drawingService.grabberBottom.y + 'px');
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'Poly Dessin 2'", () => {
        expect(component.title).toEqual('Poly Dessin 2');
    });

    it('should call basicGet when calling getMessagesFromServer', () => {
        component.getMessagesFromServer();
        expect(indexServiceSpy.basicGet).toHaveBeenCalled();
    });

    it('should call basicPost when calling sendTimeToServer', () => {
        component.sendTimeToServer();
        expect(indexServiceSpy.basicPost).toHaveBeenCalled();
    });

    it('should call method that gets the canvas information from the local storage', () => {
        drawingService.getLocalStorageData();
        const spy = spyOn(drawingService, 'getLocalStorageData').and.callThrough();
        component.continueDrawing();
        expect(spy).toHaveBeenCalled();
    });

    it('should call method that sets the canvas information from the local storage to default dimensions', () => {
        drawingService.newDrawing();
        const spy = spyOn(drawingService, 'newDrawing').and.callThrough();
        component.newDrawing();
        expect(spy).toHaveBeenCalled();
    });
});

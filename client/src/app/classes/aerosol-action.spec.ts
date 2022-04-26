import { TestBed } from '@angular/core/testing';
import { AEROSOL_WIDTH } from '@app/constant/constants';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from '@app/services/tools/aerosol.service';
import { UndoRedoService } from '@app/services/tools/undo-redo.service';
import { AerosolAction } from './aerosol-action';
import { CanvasTestHelper } from './canvas-test-helper';
import { Vec2 } from './vec2';

describe('AerosolAction', () => {
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxClone: CanvasRenderingContext2D;
    let previewCtxClone: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let drawingServiceStub: DrawingService;

    let undoRedoServiceStub: UndoRedoService;
    let aerosolActionStub: AerosolAction;
    let aerosolServiceStub: AerosolService;
    let colorServiceStub: ColorService;
    let pathData: Vec2[];
    let dropletDiameter: number;
    let aerosolWidth: number;
    let color: string;

    beforeEach(() => {
        canvasTestHelper = new CanvasTestHelper();
        baseCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxClone = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;

        colorServiceStub = new ColorService();
        drawingServiceStub = new DrawingService();
        undoRedoServiceStub = new UndoRedoService(drawingServiceStub);
        aerosolServiceStub = new AerosolService(drawingServiceStub, colorServiceStub, undoRedoServiceStub);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: AerosolService, useValue: aerosolServiceStub },
                { provide: AerosolAction, useValue: aerosolActionStub },
                { provide: UndoRedoService, useValue: undoRedoServiceStub },
            ],
        });

        drawingServiceStub.baseCtx = baseCtxClone;
        drawingServiceStub.previewCtx = previewCtxClone;
        drawingServiceStub.canvas = canvas;

        pathData = [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 5, y: 6 },
            { x: 11, y: 12 },
        ];

        dropletDiameter = 2;
        aerosolWidth = AEROSOL_WIDTH;
        color = '#010101';

        aerosolActionStub = new AerosolAction(drawingServiceStub, aerosolServiceStub, colorServiceStub, dropletDiameter, aerosolWidth, pathData);

        aerosolActionStub = TestBed.inject(AerosolAction);
        aerosolServiceStub = TestBed.inject(AerosolService);
    });

    it('should create an instance', () => {
        expect(new AerosolAction(drawingServiceStub, aerosolServiceStub, colorServiceStub, dropletDiameter, aerosolWidth, pathData)).toBeTruthy();
    });

    it('should apply actions for aerosol action', () => {
        drawingServiceStub.baseCtx.strokeStyle = color;
        aerosolServiceStub.dropletDiameter = dropletDiameter;
        aerosolServiceStub.aerosolWidth = aerosolWidth;
        aerosolServiceStub.pathData = pathData;

        aerosolActionStub = new AerosolAction(drawingServiceStub, aerosolServiceStub, colorServiceStub, dropletDiameter, aerosolWidth, pathData);

        const spy = spyOn(aerosolServiceStub, 'reSpray').and.callThrough();

        aerosolActionStub.applyActions();

        expect(spy).toHaveBeenCalled();
        expect(drawingServiceStub.baseCtx.strokeStyle).toEqual(color);
        expect(aerosolServiceStub.dropletDiameter).toEqual(dropletDiameter);
        expect(aerosolServiceStub.aerosolWidth).toEqual(aerosolWidth);
    });
});

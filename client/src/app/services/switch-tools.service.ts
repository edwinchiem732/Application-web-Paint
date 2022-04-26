import { Injectable } from '@angular/core';
import { cursorOptions } from '@app/classes/cursor-options';
import { Tool, ToolOptions } from '@app/classes/tool';
import { PaintBucketService } from '@app/services/paint-bucket/paint-bucket.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { DrawingService } from './drawing/drawing.service';
import { TextService } from './text.service';
import { AerosolService } from './tools/aerosol.service';
import { EllipseService } from './tools/ellipse.service';
import { LineService } from './tools/line.service';
import { PencilService } from './tools/pencil.service';
import { PipetteService } from './tools/pipette.service';
import { PolygonService } from './tools/polygon.service';
import { RectangleService } from './tools/rectangle.service';
import { SelectionLassoService } from './tools/selection-lasso.service';
import { SelectionService } from './tools/selection.service';
import { StampService } from './tools/stamp.service';

@Injectable({
    providedIn: 'root',
})
export class SwitchToolsService {
    currentName: ToolOptions;
    currentTool: Tool;
    tableTool: Tool[] = new Array();

    constructor(
        public eraserService: EraserService,
        public pencilService: PencilService,
        public lineService: LineService,
        public rectangleService: RectangleService,
        public ellipseService: EllipseService,
        public polygonService: PolygonService,
        public aerosolService: AerosolService,
        public selectionService: SelectionService,
        public pipetteService: PipetteService,
        public stampService: StampService,
        public selectionLasso: SelectionLassoService,
        public drawingService: DrawingService,
        public paintBucketService: PaintBucketService,
        public textService: TextService,
    ) {
        this.tableTool[ToolOptions.NONE] = this.pencilService;
        this.tableTool[ToolOptions.Crayon] = this.pencilService;
        this.tableTool[ToolOptions.Efface] = this.eraserService;
        this.tableTool[ToolOptions.Line] = this.lineService;
        this.tableTool[ToolOptions.Rectangle] = this.rectangleService;
        this.tableTool[ToolOptions.Ellipse] = this.ellipseService;
        this.tableTool[ToolOptions.Polygone] = this.polygonService;
        this.tableTool[ToolOptions.Aerosol] = this.aerosolService;
        this.tableTool[ToolOptions.Selection] = this.selectionService;
        this.tableTool[ToolOptions.Pipette] = this.pipetteService;
        this.tableTool[ToolOptions.PaintBucket] = this.paintBucketService;
        this.tableTool[ToolOptions.Stamp] = this.stampService;
        this.tableTool[ToolOptions.Lasso] = this.selectionLasso;
        this.tableTool[ToolOptions.Text] = this.textService;
        this.switchTool(ToolOptions.NONE);
    }

    switchTool(toolOptions: ToolOptions): void {
        this.currentTool = this.tableTool[toolOptions];
        this.currentName = toolOptions;
    }

    isCurrentTool(toolOptions: ToolOptions): boolean {
        return this.currentTool === this.tableTool[toolOptions];
    }

    switchToolButtons(cursorOption: string, toolOption: ToolOptions): void {
        this.drawingService.cursorImage = cursorOption;
        this.switchTool(toolOption);
    }

    pencilButton(): void {
        this.switchToolButtons(cursorOptions.crayon, ToolOptions.Crayon);
    }

    eraserButton(): void {
        this.switchToolButtons(cursorOptions.efface, ToolOptions.Efface);
    }

    rectangleButton(): void {
        this.switchToolButtons(cursorOptions.test, ToolOptions.Rectangle);
    }

    ellipseButton(): void {
        this.switchToolButtons(cursorOptions.test, ToolOptions.Ellipse);
    }

    lineButton(): void {
        this.switchToolButtons(cursorOptions.test, ToolOptions.Line);
    }

    polygonButton(): void {
        this.switchToolButtons(cursorOptions.test, ToolOptions.Polygone);
    }

    aerosolButton(): void {
        this.switchToolButtons(cursorOptions.test, ToolOptions.Aerosol);
    }

    pipetteButton(): void {
        this.switchToolButtons(cursorOptions.test, ToolOptions.Pipette);
    }

    stampButton(): void {
        this.switchToolButtons(cursorOptions.none, ToolOptions.Stamp);
    }

    paintBucketButton(): void {
        this.switchToolButtons(cursorOptions.test, ToolOptions.PaintBucket);
    }

    textButton(): void {
        this.switchToolButtons(cursorOptions.test, ToolOptions.Text);
    }
}

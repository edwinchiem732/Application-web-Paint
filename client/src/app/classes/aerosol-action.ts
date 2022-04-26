import { UndoRedoAbs } from '@app/classes/undo-redo';
import { ColorService } from '@app/services/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from '@app/services/tools/aerosol.service';
import { Vec2 } from './vec2';
export class AerosolAction extends UndoRedoAbs {
    constructor(
        private drawingService: DrawingService,
        private aerosolService: AerosolService,
        private colorService: ColorService,
        private dropletDiameter: number,
        private aerosolWidth: number,
        private pathData: Vec2[],
    ) {
        super();
    }

    applyActions(): void {
        this.drawingService.baseCtx.strokeStyle = this.colorService.primaryColor;
        this.aerosolService.dropletDiameter = this.dropletDiameter;
        this.aerosolService.aerosolWidth = this.aerosolWidth;
        this.aerosolService.pathData = this.pathData;
        this.aerosolService.reSpray(this.drawingService.baseCtx, this.aerosolService.pathData);
    }
}

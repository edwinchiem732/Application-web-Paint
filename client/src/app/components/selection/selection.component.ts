import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { cursorOptions } from '@app/classes/cursor-options';
import { ToolOptions } from '@app/classes/tool';
import { SwitchToolsService } from '@app/services/switch-tools.service';
import { SelectionLassoService } from '@app/services/tools/selection-lasso.service';
import { SelectionService } from '@app/services/tools/selection.service';

@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent {
    selectionOption: string = 'rectangle';
    magnetismOption: string = 'middle';

    constructor(
        public selectionService: SelectionService,
        public selectionLassoService: SelectionLassoService,
        public switchToolsService: SwitchToolsService,
    ) {}

    changeSelectionOption(event: MatSelectChange): void {
        this.selectionOption = event.value as string;
        if (this.selectionOption === 'rectangle') {
            this.switchToolsService.switchToolButtons(cursorOptions.test, ToolOptions.Selection);
            this.selectionService.selectionOption = true;
        } else if (this.selectionOption === 'ellipse') {
            this.switchToolsService.switchToolButtons(cursorOptions.test, ToolOptions.Selection);
            this.selectionService.selectionOption = false;
        } else {
            this.switchToolsService.switchToolButtons(cursorOptions.test, ToolOptions.Lasso);
        }
    }

    changeSelectionForm(): void {
        if (this.switchToolsService.isCurrentTool(ToolOptions.Lasso)) {
            this.switchToolsService.switchToolButtons(cursorOptions.test, ToolOptions.Selection);
            this.selectionOption = 'rectangle';
        }
        this.selectionService.selectAllDrawing();
    }

    copySelection(): void {
        if (this.switchToolsService.isCurrentTool(ToolOptions.Selection)) {
            this.selectionService.copyCanvas();
        } else if (this.switchToolsService.isCurrentTool(ToolOptions.Lasso)) {
            this.selectionLassoService.copyCanvas();
        }
    }

    pasteSelection(): void {
        if (this.switchToolsService.isCurrentTool(ToolOptions.Selection)) {
            this.selectionService.pasteCanvas();
        } else if (this.switchToolsService.isCurrentTool(ToolOptions.Lasso)) {
            this.selectionLassoService.pasteCanvas();
        }
        this.selectionService.selectedBtn = true;
        this.selectionLassoService.selectedBtn = true;
    }

    cutSelection(): void {
        if (this.switchToolsService.isCurrentTool(ToolOptions.Selection)) {
            this.selectionService.cutCanvas();
        } else if (this.switchToolsService.isCurrentTool(ToolOptions.Lasso)) {
            this.selectionLassoService.cutCanvas();
        }
        this.selectionService.selectedBtn = false;
        this.selectionLassoService.selectedBtn = false;
    }

    deleteSelection(): void {
        if (this.switchToolsService.isCurrentTool(ToolOptions.Selection)) {
            this.selectionService.cutCanvas();
        } else if (this.switchToolsService.isCurrentTool(ToolOptions.Lasso)) {
            this.selectionLassoService.cutCanvas();
        }
    }

    changeMagnetismPoint(event: MatSelectChange): void {
        this.magnetismOption = event.value as string;
        this.selectionService.magnetism.initialise();
        this.selectionLassoService.magnetism.initialise();
        switch (event.value) {
            case 'leftUp':
                this.selectionService.magnetism.leftUp = true;
                this.selectionLassoService.magnetism.leftUp = true;
                break;
            case 'middleUp':
                this.selectionService.magnetism.middleUp = true;
                this.selectionLassoService.magnetism.middleUp = true;
                break;
            case 'rightUp':
                this.selectionService.magnetism.rightUp = true;
                this.selectionLassoService.magnetism.rightUp = true;
                break;
            case 'leftMiddle':
                this.selectionService.magnetism.leftMiddle = true;
                this.selectionLassoService.magnetism.leftMiddle = true;
                break;
            case 'middle':
                this.selectionService.magnetism.middle = true;
                this.selectionLassoService.magnetism.middle = true;
                break;
            case 'rightMiddle':
                this.selectionService.magnetism.rightMiddle = true;
                this.selectionLassoService.magnetism.rightMiddle = true;
                break;
            case 'leftDown':
                this.selectionService.magnetism.leftDown = true;
                this.selectionLassoService.magnetism.leftDown = true;
                break;
            case 'middleDown':
                this.selectionService.magnetism.middleDown = true;
                this.selectionLassoService.magnetism.middleDown = true;
                break;
            case 'rightDown':
                this.selectionService.magnetism.rightDown = true;
                this.selectionLassoService.magnetism.rightDown = true;
                break;
            default:
                this.selectionService.magnetism.initialise();
                break;
        }
        if (this.switchToolsService.isCurrentTool(ToolOptions.Selection)) {
            this.selectionService.selectControlPoint();
        } else if (this.switchToolsService.isCurrentTool(ToolOptions.Lasso)) {
            this.selectionLassoService.selectControlPoint();
        }
    }
}

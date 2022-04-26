import { Injectable } from '@angular/core';
import { ResizeAction } from '@app/classes/resize-action';
import { UndoRedoAbs } from '@app/classes/undo-redo';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    // stack to add the actions
    listUndoActions: UndoRedoAbs[] = [];
    listActions: UndoRedoAbs[] = [];
    btn: number = 0;
    isActionsEmpty: boolean = true;
    isActionsUndidEmpty: boolean = true;

    constructor(public drawingService: DrawingService) {}

    lengthListActions(): boolean {
        return this.listActions.length === 0;
    }

    lengthUndidActions(): boolean {
        return this.listUndoActions.length === 0;
    }

    addAction(actions: UndoRedoAbs): void {
        this.listActions.push(actions);
        console.log(this.listActions);
        this.btn = this.listActions.length;
        this.isActionsEmpty = false;
    }

    addInitialCanvas(initial: ResizeAction): void {
        this.listActions.push(initial);
        this.btn = this.listActions.length - 1;
        this.isActionsEmpty = false;
    }
    clearActions(): void {
        this.listActions = [];
        this.listUndoActions = [];
        this.isActionsEmpty = true;
        this.isActionsUndidEmpty = true;
    }

    clearCanvases(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
    }

    undo(): void {
        if (!this.listActions.length) {
            return;
        }
        console.log('list actions', this.listActions);
        const removedOriginalAction = this.listActions.pop();
        console.log('removed', removedOriginalAction);
        this.btn = this.listActions.length;
        if (removedOriginalAction) {
            this.listUndoActions.push(removedOriginalAction);
            this.isActionsUndidEmpty = false;
            console.log('removed undo', removedOriginalAction);
            // erase old canvas and display list of actions without the removed one
            this.clearCanvases();
            for (const actions of this.listActions) {
                actions.applyActions();
            }
        }
        if (this.listActions.length === 0) {
            this.isActionsEmpty = true;
        }
    }

    redo(): void {
        if (!this.listUndoActions.length) {
            return;
        }
        const lastUndoneAction = this.listUndoActions.pop();
        console.log('redo', lastUndoneAction);
        if (lastUndoneAction) {
            this.listActions.push(lastUndoneAction);
            this.isActionsEmpty = false;
            // display added action to current canvas and will not erase old canvas
            lastUndoneAction.applyActions();
        }
        if (this.listUndoActions.length === 0) {
            this.isActionsUndidEmpty = true;
        }
    }
}

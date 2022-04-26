import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// This is justified since we have functions that will be managed by the child classes
// tslint:disable:no-empty

export enum ToolOptions {
    NONE = 0,
    Crayon = 1,
    Efface = 2,
    Line = 3,
    Rectangle = 4,
    Ellipse = 5,
    Color = 6,
    Polygone = 7,
    Aerosol = 8,
    Selection = 9,
    Pipette = 10,
    Stamp = 11,
    Lasso = 12,
    PaintBucket = 13,
    Text = 14,
}
export abstract class Tool {
    coords: Vec2[];
    // tslint:disable-next-line: typedef
    mouseDownCoord = {} as Vec2;
    mouseDown: boolean = false;
    mouseMove: boolean = false;
    keyboardDown: boolean = false;
    widthSidebar: number = 350;
    shiftPressed: boolean = false;

    constructor(public drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}
    onMouseUp(event: MouseEvent): void {}
    onMouseMove(event: MouseEvent): void {}
    onMouseOut(event: MouseEvent): void {}
    onMouseEnter(event: MouseEvent): void {}
    onShiftUp(event: KeyboardEvent): void {}
    onShiftDown(event: KeyboardEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.pageX - this.widthSidebar, y: event.pageY };
    }
    onMouseClick(event: MouseEvent): void {}

    onMouseDoubleClick(event: MouseEvent): void {}

    onBackspace(event: KeyboardEvent): void {}

    onEscape(event: KeyboardEvent): void {}
    onArrow(event: KeyboardEvent): void {}
}

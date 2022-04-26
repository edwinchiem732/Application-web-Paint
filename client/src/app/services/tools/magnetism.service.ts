import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid/grid.service';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    constructor(private gridService: GridService) {}
    middle: boolean = false;
    leftUp: boolean = false;
    middleUp: boolean = false;
    rightUp: boolean = false;
    leftMiddle: boolean = false;
    leftDown: boolean = false;
    middleDown: boolean = false;
    rightDown: boolean = false;
    rightMiddle: boolean = false;

    magnetismControlPoint(mousePosition: Vec2, imageData: ImageData, squareDistance: number, circle: boolean, isDrawingCircle: boolean): Vec2 {
        let closestPosition: Vec2 = { x: 0, y: 0 };
        let position: Vec2 = { x: 0, y: 0 };
        let width;
        let height;
        if (circle || isDrawingCircle) {
            width = squareDistance;
            height = squareDistance;
        } else {
            width = imageData.width;
            height = imageData.height;
        }
        switch (true) {
            case this.middle: {
                closestPosition = this.gridService.closestIntersection(mousePosition);
                return closestPosition;
            }
            case this.leftUp: {
                closestPosition = this.gridService.closestIntersection(mousePosition);
                position = { x: closestPosition.x + width / 2, y: closestPosition.y + height / 2 };
                return position;
            }
            case this.leftDown: {
                closestPosition = this.gridService.closestIntersection(mousePosition);
                position = { x: closestPosition.x + width / 2, y: closestPosition.y - height / 2 };
                return position;
            }
            case this.rightDown: {
                closestPosition = this.gridService.closestIntersection(mousePosition);
                position = { x: closestPosition.x - width / 2, y: closestPosition.y - height / 2 };
                return position;
            }
            case this.rightUp: {
                closestPosition = this.gridService.closestIntersection(mousePosition);
                position = { x: closestPosition.x - width / 2, y: closestPosition.y + height / 2 };
                return position;
            }
            case this.middleUp: {
                closestPosition = this.gridService.closestIntersection(mousePosition);
                position = { x: closestPosition.x, y: closestPosition.y + height / 2 };
                return position;
            }
            case this.middleDown: {
                closestPosition = this.gridService.closestIntersection(mousePosition);
                position = { x: closestPosition.x, y: closestPosition.y - height / 2 };
                return position;
            }
            case this.leftMiddle: {
                closestPosition = this.gridService.closestIntersection(mousePosition);
                position = { x: closestPosition.x + width / 2, y: closestPosition.y };
                return position;
            }
            case this.rightMiddle: {
                closestPosition = this.gridService.closestIntersection(mousePosition);
                position = { x: closestPosition.x - width / 2, y: closestPosition.y };
                return position;
            }
            default: {
                closestPosition = this.gridService.closestIntersection(mousePosition);
                return closestPosition;
            }
        }
    }

    magnetismArrow(imagePosition: Vec2, imageData: ImageData): Vec2 {
        let closestPosition;
        let position;
        switch (true) {
            case this.leftUp: {
                closestPosition = this.gridService.closestIntersection(imagePosition);
                position = { x: closestPosition.x, y: closestPosition.y };
                return position;
            }
            case this.leftDown: {
                const leftDown = { x: imagePosition.x, y: imagePosition.y + imageData.height };
                const leftDownMag = this.gridService.closestIntersection(leftDown);
                const distanceToMove = { x: leftDownMag.x - leftDown.x, y: leftDownMag.y - leftDown.y };
                position = { x: imagePosition.x + distanceToMove.x, y: imagePosition.y + distanceToMove.y };
                return position;
            }
            case this.rightDown: {
                const rightDown = { x: imagePosition.x + imageData.width, y: imagePosition.y + imageData.height };
                const rightDownMag = this.gridService.closestIntersection(rightDown);
                const distanceToMove = { x: rightDownMag.x - rightDown.x, y: rightDownMag.y - rightDown.y };
                position = { x: imagePosition.x + distanceToMove.x, y: imagePosition.y + distanceToMove.y };
                return position;
            }
            case this.rightUp: {
                const rightUp = { x: imagePosition.x + imageData.width, y: imagePosition.y };
                const rightUpMag = this.gridService.closestIntersection(rightUp);
                const distanceToMove = { x: rightUpMag.x - rightUp.x, y: rightUpMag.y - rightUp.y };
                position = { x: imagePosition.x + distanceToMove.x, y: imagePosition.y + distanceToMove.y };
                return position;
            }
            case this.middleUp: {
                const middleUp = { x: imagePosition.x + imageData.width / 2, y: imagePosition.y };
                const middleUpMag = this.gridService.closestIntersection(middleUp);
                const distanceToMove = { x: middleUpMag.x - middleUp.x, y: middleUpMag.y - middleUp.y };
                position = { x: imagePosition.x + distanceToMove.x, y: imagePosition.y + distanceToMove.y };
                return position;
            }
            case this.middleDown: {
                const middleDown = { x: imagePosition.x + imageData.width / 2, y: imagePosition.y + imageData.height };
                const middleDownMag = this.gridService.closestIntersection(middleDown);
                const distanceToMove = { x: middleDownMag.x - middleDown.x, y: middleDownMag.y - middleDown.y };
                position = { x: imagePosition.x + distanceToMove.x, y: imagePosition.y + distanceToMove.y };
                return position;
            }
            case this.leftMiddle: {
                const leftMiddle = { x: imagePosition.x, y: imagePosition.y + imageData.height / 2 };
                const leftMiddleMag = this.gridService.closestIntersection(leftMiddle);
                const distanceToMove = { x: leftMiddleMag.x - leftMiddle.x, y: leftMiddleMag.y - leftMiddle.y };
                position = { x: imagePosition.x + distanceToMove.x, y: imagePosition.y + distanceToMove.y };
                return position;
            }
            case this.rightMiddle: {
                const rightMiddle = { x: imagePosition.x + imageData.width, y: imagePosition.y + imageData.height / 2 };
                const rightMiddleMag = this.gridService.closestIntersection(rightMiddle);
                const distanceToMove = { x: rightMiddleMag.x - rightMiddle.x, y: rightMiddleMag.y - rightMiddle.y };
                position = { x: imagePosition.x + distanceToMove.x, y: imagePosition.y + distanceToMove.y };
                return position;
            }
            case this.middle: {
                const rightMiddle = { x: imagePosition.x + imageData.width / 2, y: imagePosition.y + imageData.height / 2 };
                const rightMiddleMag = this.gridService.closestIntersection(rightMiddle);
                const distanceToMove = { x: rightMiddleMag.x - rightMiddle.x, y: rightMiddleMag.y - rightMiddle.y };
                position = { x: imagePosition.x + distanceToMove.x, y: imagePosition.y + distanceToMove.y };
                return position;
            }
            default: {
                position = this.gridService.closestIntersection(imagePosition);
                return position;
            }
        }
    }

    initialise(): void {
        this.middle = false;
        this.leftUp = false;
        this.middleUp = false;
        this.rightUp = false;
        this.leftMiddle = false;
        this.leftDown = false;
        this.middleDown = false;
        this.rightDown = false;
        this.rightMiddle = false;
    }
}

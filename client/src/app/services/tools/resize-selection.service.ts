import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { RESIZE_ZONE, SIZE_ADJUSTMENT_EIGHT } from '@app/constant/constants';

@Injectable({
    providedIn: 'root',
})
export class ResizeSelectionService {
    private leftUp: boolean = false;
    private middleUp: boolean = false;
    private rightUp: boolean = false;
    private leftMiddle: boolean = false;
    private leftDown: boolean = false;
    private middleDown: boolean = false;
    private rightDown: boolean = false;
    private rightMiddle: boolean = false;

    isOnControlePoint(position: Vec2, imagePosition: Vec2, width: number, height: number): boolean {
        // tslint:disable-next-line: cyclomatic-complexity
        const controlePointLeftX = imagePosition.x - SIZE_ADJUSTMENT_EIGHT;
        const controlePointUpY = imagePosition.y - SIZE_ADJUSTMENT_EIGHT;
        const controlePointMiddleX = imagePosition.x + width / 2 - SIZE_ADJUSTMENT_EIGHT;
        const controlePointMiddleY = imagePosition.y + height / 2 - SIZE_ADJUSTMENT_EIGHT;
        const controlePointRightX = imagePosition.x + width - SIZE_ADJUSTMENT_EIGHT;
        const controlePointDownY = imagePosition.y + height - SIZE_ADJUSTMENT_EIGHT;
        this.initialise();
        switch (true) {
            case position.x > controlePointLeftX &&
                position.y > controlePointUpY &&
                position.x < controlePointLeftX + RESIZE_ZONE &&
                position.y < controlePointUpY + RESIZE_ZONE: {
                this.leftUp = true;
                return true;
            }
            case position.x > controlePointLeftX &&
                position.y > controlePointMiddleY &&
                position.x < controlePointLeftX + RESIZE_ZONE &&
                position.y < controlePointMiddleY + RESIZE_ZONE: {
                this.leftMiddle = true;
                return true;
            }
            case position.x > controlePointLeftX &&
                position.y > controlePointDownY &&
                position.x < controlePointLeftX + RESIZE_ZONE &&
                position.y < controlePointDownY + RESIZE_ZONE: {
                this.leftDown = true;
                return true;
            }
            case position.x > controlePointMiddleX &&
                position.y > controlePointUpY &&
                position.x < controlePointMiddleX + RESIZE_ZONE &&
                position.y < controlePointUpY + RESIZE_ZONE: {
                this.middleUp = true;
                return true;
            }
            case position.x > controlePointRightX &&
                position.y > controlePointUpY &&
                position.x < controlePointRightX + RESIZE_ZONE &&
                position.y < controlePointUpY + RESIZE_ZONE: {
                this.rightUp = true;
                return true;
            }
            case position.x > controlePointRightX &&
                position.y > controlePointMiddleY &&
                position.x < controlePointRightX + RESIZE_ZONE &&
                position.y < controlePointMiddleY + RESIZE_ZONE: {
                this.rightMiddle = true;
                return true;
            }
            case position.x > controlePointRightX &&
                position.y > controlePointDownY &&
                position.x < controlePointRightX + RESIZE_ZONE &&
                position.y < controlePointDownY + RESIZE_ZONE: {
                this.rightDown = true;
                return true;
            }
            case position.x > controlePointMiddleX &&
                position.y > controlePointDownY &&
                position.x < controlePointMiddleX + RESIZE_ZONE &&
                position.y < controlePointDownY + RESIZE_ZONE: {
                this.middleDown = true;
                return true;
            }
            default: {
                return false;
            }
        }
    }
    // tslint:disable-next-line: cyclomatic-complexity
    resizeImage(imagePos: Vec2, pointPosition: Vec2, width: number, height: number, shiftDown: boolean): Vec2[] {
        // tslint:disable-next-line: prefer-const
        let positions = [];
        // tslint:disable-next-line: prefer-const
        let imageResisedPos = {} as Vec2;
        // tslint:disable-next-line: prefer-const
        let imageInitialPos = {} as Vec2;

        switch (true) {
            case this.leftUp: {
                imageInitialPos.x = pointPosition.x;
                imageInitialPos.y = pointPosition.y;
                if (shiftDown) {
                    imageResisedPos.x = width + 2 * (imagePos.x - imageInitialPos.x);
                    imageResisedPos.y = height + 2 * (imagePos.y - imageInitialPos.y);
                } else {
                    imageResisedPos.x = width + (imagePos.x - imageInitialPos.x);
                    imageResisedPos.y = height + (imagePos.y - imageInitialPos.y);
                }
                positions.push(imageResisedPos);
                positions.push(imageInitialPos);
                return positions;
            }
            case this.leftDown: {
                imageInitialPos.x = pointPosition.x;
                if (shiftDown) {
                    imageInitialPos.y = height + imagePos.y - pointPosition.y + imagePos.y;
                    imageResisedPos.x = width + 2 * (imagePos.x - pointPosition.x);
                    imageResisedPos.y = pointPosition.y - imageInitialPos.y;
                } else {
                    imageInitialPos.y = imagePos.y;
                    imageResisedPos.x = width + (imagePos.x - pointPosition.x);
                    imageResisedPos.y = pointPosition.y - imagePos.y;
                }
                positions.push(imageResisedPos);
                positions.push(imageInitialPos);
                return positions;
            }
            case this.rightDown: {
                if (shiftDown) {
                    imageInitialPos.x = width + imagePos.x - pointPosition.x + imagePos.x;
                    imageInitialPos.y = height + imagePos.y - pointPosition.y + imagePos.y;
                    imageResisedPos.x = width + 2 * (imagePos.x - imageInitialPos.x);
                    imageResisedPos.y = height + 2 * (imagePos.y - imageInitialPos.y);
                } else {
                    imageInitialPos.x = imagePos.x;
                    imageInitialPos.y = imagePos.y;
                    imageResisedPos.x = pointPosition.x - imagePos.x;
                    imageResisedPos.y = pointPosition.y - imagePos.y;
                }
                positions.push(imageResisedPos);
                positions.push(imageInitialPos);
                return positions;
            }
            case this.rightUp: {
                imageInitialPos.y = pointPosition.y;
                if (shiftDown) {
                    imageInitialPos.x = width + imagePos.x - pointPosition.x + imagePos.x;
                    imageResisedPos.x = width + 2 * (imagePos.x - imageInitialPos.x);
                    imageResisedPos.y = height + 2 * (imagePos.y - imageInitialPos.y);
                } else {
                    imageInitialPos.x = imagePos.x;
                    imageResisedPos.x = pointPosition.x - imagePos.x;
                    imageResisedPos.y = height + (imagePos.y - imageInitialPos.y);
                }
                positions.push(imageResisedPos);
                positions.push(imageInitialPos);
                return positions;
            }
            case this.middleUp: {
                imageInitialPos.x = imagePos.x;
                imageInitialPos.y = pointPosition.y;
                imageResisedPos.x = width;
                imageResisedPos.y = height + (imagePos.y - imageInitialPos.y);
                positions.push(imageResisedPos);
                positions.push(imageInitialPos);
                return positions;
            }
            case this.middleDown: {
                imageInitialPos.x = imagePos.x;
                imageInitialPos.y = imagePos.y;
                imageResisedPos.x = width;
                imageResisedPos.y = pointPosition.y - imagePos.y;

                positions.push(imageResisedPos);
                positions.push(imageInitialPos);
                return positions;
            }
            case this.leftMiddle: {
                imageInitialPos.x = pointPosition.x;
                imageResisedPos.x = width + (imagePos.x - imageInitialPos.x);
                imageInitialPos.y = imagePos.y;
                imageResisedPos.y = height;
                positions.push(imageResisedPos);
                positions.push(imageInitialPos);
                return positions;
            }
            case this.rightMiddle: {
                imageInitialPos.x = imagePos.x;
                imageInitialPos.y = imagePos.y;
                imageResisedPos.x = pointPosition.x - imagePos.x;
                imageResisedPos.y = height;
                positions.push(imageResisedPos);
                positions.push(imageInitialPos);
                return positions;
            }
            default: {
                positions.push(imageResisedPos);
                return positions;
            }
        }
    }
    initialise(): void {
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

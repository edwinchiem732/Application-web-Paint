import { TestBed } from '@angular/core/testing';
import { ResizeSelectionService } from './resize-selection.service';

/* tslint:disable:no-string-literal */
describe('ResizeSelectionService', () => {
    let service: ResizeSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should call isOncontrolePoint with leftUp', () => {
        const pos = { x: 55, y: 40 };
        const imagePOS = { x: 50, y: 45 };
        const width = 50;
        const height = 20;
        service.isOnControlePoint(pos, imagePOS, width, height);
        expect(service['leftUp']).toBeTruthy();
    });
    it('should call isOncontrolePoint with leftMiddle', () => {
        const pos = { x: 80, y: 90 };
        const imagePOS = { x: 85, y: 65 };
        const width = 15;
        const height = 50;
        service.isOnControlePoint(pos, imagePOS, width, height);
        expect(service['leftMiddle']).toBeTruthy();
    });
    it('should call isOncontrolePoint with leftDown', () => {
        const pos = { x: 85, y: 165 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service.isOnControlePoint(pos, imagePOS, width, height);
        expect(service['leftDown']).toBeTruthy();
    });
    it('should call isOncontrolePoint with rigthUp', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service.isOnControlePoint(pos, imagePOS, width, height);
        expect(service['rightUp']).toBeTruthy();
    });
    it('should call isOncontrolePoint with rightMiddle = true', () => {
        const pos = { x: 290, y: 130 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service.isOnControlePoint(pos, imagePOS, width, height);
        expect(service['rightMiddle']).toBeTruthy();
    });
    it('should call isOncontrolePoint and rightDown = true', () => {
        const pos = { x: 290, y: 165 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service.isOnControlePoint(pos, imagePOS, width, height);
        expect(service['rightDown']).toBeTruthy();
    });
    it('should call isOncontrolePoint and middleDown = true', () => {
        const pos = { x: 190, y: 165 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service.isOnControlePoint(pos, imagePOS, width, height);
        expect(service.resizeImage).toBeTruthy();
    });

    it('should call resizeImage with leftDown = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['leftDown'] = true;
        service.resizeImage(pos, imagePOS, width, height, false);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with leftUp = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['leftUp'] = true;
        service.resizeImage(pos, imagePOS, width, height, false);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with leftMiddle = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['leftMiddle'] = true;
        service.resizeImage(pos, imagePOS, width, height, false);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with rightDown = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['rightDown'] = true;
        service.resizeImage(pos, imagePOS, width, height, false);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with rightUp = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['rightUp'] = true;
        service.resizeImage(pos, imagePOS, width, height, false);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with rightMiddle = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['rightMiddle'] = true;
        service.resizeImage(pos, imagePOS, width, height, false);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with middleDown = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['middleDown'] = true;
        service.resizeImage(pos, imagePOS, width, height, false);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with middleUp = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['middleUp'] = true;
        service.resizeImage(pos, imagePOS, width, height, false);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with rightMiddle = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['rightMiddle'] = true;
        service.resizeImage(pos, imagePOS, width, height, false);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with rightUp = true and shift= true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['rightUp'] = true;
        service.resizeImage(pos, imagePOS, width, height, true);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with leftUp = true and shift = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['leftUp'] = true;
        service.resizeImage(pos, imagePOS, width, height, true);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with rigthDown = true and shift = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['rightDown'] = true;
        service.resizeImage(pos, imagePOS, width, height, true);
        expect(service.resizeImage).toBeTruthy();
    });
    it('should call resizeImage with leftDown = true and shift = true ', () => {
        const pos = { x: 285, y: 65 };
        const imagePOS = { x: 85, y: 65 };
        const width = 200;
        const height = 100;
        service['leftDown'] = true;
        service.resizeImage(pos, imagePOS, width, height, true);
        expect(service.resizeImage).toBeTruthy();
    });
});

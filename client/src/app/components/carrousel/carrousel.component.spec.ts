import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { ExportComponent } from '@app/components/export/export.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerService } from '@app/services/server/server.service';
import { Observable } from 'rxjs';
import { CarrouselComponent } from './carrousel.component';

/* tslint:disable:no-string-literal */
/* tslint:disable:no-any */
describe('CarrouselComponent', () => {
    let component: CarrouselComponent;
    let fixture: ComponentFixture<CarrouselComponent>;
    let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<ExportComponent>>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let baseCtxSpyObj: jasmine.SpyObj<CanvasRenderingContext2D>;
    let serverServiceSpyObj: jasmine.SpyObj<ServerService>;
    let dataArrayStub: any;
    let deleteDrawingObservable: Observable<void>;
    let getDrawingUploadObservable: Observable<any>;

    let initialMethodSpy: jasmine.Spy<any>;
    let removeFilterMethod: jasmine.Spy<any>;
    let loadImagesMethod: jasmine.Spy<any>;
    let getnamesAndTagsMethod: jasmine.Spy<any>;
    beforeEach(async(() => {
        dialogRefSpyObj = jasmine.createSpyObj('ExportComponent', ['close']);
        baseCtxSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['drawImage']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['checkEmptyCanvas', 'clearCanvas'], {
            previewCtx: {},
            baseCtx: baseCtxSpyObj,
        });

        dataArrayStub = [];
        deleteDrawingObservable = new Observable<void>();
        getDrawingUploadObservable = new Observable<any>();
        serverServiceSpyObj = jasmine.createSpyObj('ServerService', ['getDrawingUploads', 'deleteDrawing'], { dataArray: dataArrayStub });
        serverServiceSpyObj.deleteDrawing.and.returnValue(deleteDrawingObservable);
        serverServiceSpyObj.getDrawingUploads.and.returnValue(getDrawingUploadObservable);
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [CarrouselComponent],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: dialogRefSpyObj,
                },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ServerService, useValue: serverServiceSpyObj },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarrouselComponent);
        component = fixture.componentInstance;
        initialMethodSpy = spyOn(component, 'initial');
        removeFilterMethod = spyOn(component, 'removeFilter');
        loadImagesMethod = spyOn(component, 'loadImages');
        getnamesAndTagsMethod = spyOn(component, 'getServerNameAndTags');

        initialMethodSpy.and.stub();
        removeFilterMethod.and.stub();
        loadImagesMethod.and.stub();
        getnamesAndTagsMethod.and.stub();

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add a tag', () => {
        const tag = 'dog';
        const event = { value: tag } as MatChipInputEvent;
        component.tags.push(event.value);
        component.addInputTag(event);
        expect(component.tags[component.tags.length - 1]).toEqual(tag);
    });

    it("should not add a tag if there's a number in the tag", () => {
        const tag = 'dog1';
        const event = { value: tag } as MatChipInputEvent;
        component.tags.push(event.value);
        component.removeTagInput(tag);
        component.addInputTag(event);
        expect(component.tags[component.tags.length - 1]).not.toEqual(tag);
    });

    it("should not add a tag if there's a space in the tag", () => {
        const tag = 'dogs ';
        const event = { value: tag } as MatChipInputEvent;
        component.tags.push(event.value);
        component.removeTagInput(tag);
        component.addInputTag(event);
        expect(component.tags[component.tags.length - 1]).not.toEqual(tag);
    });

    it("should not add a tag if there's more than 5 letters in the tag", () => {
        const tag = 'dogsAreTheBest';
        const event = { value: tag } as MatChipInputEvent;
        component.tags.push(event.value);
        component.removeTagInput(tag);
        component.addInputTag(event);
        expect(component.tags[component.tags.length - 1]).not.toEqual(tag);
    });

    it('should call leftSideSlide on window keydown j', () => {
        const spy = spyOn(component, 'leftSideSlide').and.callThrough();
        const eventMock = { key: 'j' } as KeyboardEvent;
        component.shortcutSelect(eventMock);
        expect(spy).toHaveBeenCalled();
    });

    it('should call rightSideSlide on window keydown k', () => {
        const spy = spyOn(component, 'rightSideSlide').and.callThrough();
        const eventMock = { key: 'k' } as KeyboardEvent;
        component.shortcutSelect(eventMock);
        expect(spy).toHaveBeenCalled();
    });

    it('should set the 3 filtered canvas to their appropriate index', () => {
        component.filterInitial();
        expect(component['centerImage']).toEqual(0);
        expect(component['rightImage']).toEqual(1);
        expect(component['leftImage']).toEqual(component.filterArray.length - 1);
    });

    it('should remove and set the inital filtered canvas', () => {
        const spyFilterInitial = spyOn(component, 'filterInitial').and.callThrough();
        const spyFilterDrawing = spyOn(component, 'filterDrawing').and.callThrough();
        const loadFilteredImageSpy = spyOn(component, 'loadFilteredImage');
        component.filterDrawing();
        expect(removeFilterMethod).toHaveBeenCalled();
        expect(spyFilterInitial).toHaveBeenCalled();
        expect(spyFilterDrawing).toHaveBeenCalled();
        expect(loadFilteredImageSpy).toHaveBeenCalled();
        expect(component.isFilter).toEqual(true);
    });

    it('should remove the filters of tags', () => {
        component.removeFilter();
        expect(component.isFilter).toEqual(false);
        expect(component['centerImage']).toEqual(0);
        expect(component['rightImage']).toEqual(1);
        expect(component['leftImage']).toEqual(component.imageUrlArray.length - 1);
        expect(component['dataArray']).toEqual([]);
        expect(component['filterArray']).toEqual([]);
        expect(loadImagesMethod).toHaveBeenCalled();
    });

    it('remove should call loadImages', () => {
        const tag = 'aaa';
        component.tags.length = 0;
        component.removeTagInput(tag);
        expect(component.isFilter).toBeFalse();
        expect(component['dataArray']).toEqual([]);
        expect(component.filterArray).toEqual([]);
        expect(loadImagesMethod).toHaveBeenCalled();
    });

    it('remove should call loadImages', () => {
        const tag = 'aaa';
        component.tags.length = 0;
        component.removeTagInput(tag);
        expect(component.isFilter).toBeFalse();
        expect(component['dataArray']).toEqual([]);
        expect(component.filterArray).toEqual([]);
        expect(loadImagesMethod).toHaveBeenCalled();
    });

    it('when loadFilteredImage is called', () => {
        const displayNameAndTagsspy = spyOn(component, 'displayNameAndTags');
        component.filterArray.length = 1;

        component.loadFilteredImage();
        expect(displayNameAndTagsspy).toHaveBeenCalled();
    });

    it('when loadImage is called', () => {
        const displayNameAndTagsspy = spyOn(component, 'displayNameAndTags');
        component.filterArray.length = 1;

        component.loadFilteredImage();
        expect(displayNameAndTagsspy).toHaveBeenCalled();
    });

    it('when cancel is called, dialog.close should be called ', () => {
        component.cancel();
        expect(dialogRefSpyObj.close).toHaveBeenCalled();
        expect(component.isFilter).toBeFalse();
    });

    it('leftSideSlide image position, isfilter is true ', () => {
        const loadFilteredImageSpy = spyOn(component, 'loadFilteredImage');
        component.isFilter = true;
        component['centerImage'] = 0;
        component['rightImage'] = 1;
        component['leftImage'] = 2;

        component.leftSideSlide();

        expect(component['centerImage']).toEqual(2);
        expect(component['rightImage']).toEqual(0);
        expect(component['leftImage']).toEqual(1);
        expect(loadFilteredImageSpy).toHaveBeenCalled();
    });

    it('leftSideSlide image position, isfilter is true, leftimage = 0 ', () => {
        const loadFilteredImageSpy = spyOn(component, 'loadFilteredImage');
        component.isFilter = true;
        component['centerImage'] = 1;
        component['rightImage'] = 2;
        component['leftImage'] = 0;

        component.leftSideSlide();
        const positionLeft = -1;
        expect(component['centerImage']).toEqual(0);
        expect(component['rightImage']).toEqual(1);
        expect(component['leftImage']).toEqual(positionLeft);
        expect(loadFilteredImageSpy).toHaveBeenCalled();
    });

    it('leftSideSlide image position , isfilter is false', () => {
        component.isFilter = false;
        component['centerImage'] = 0;
        component['rightImage'] = 1;
        component['leftImage'] = 2;

        component.leftSideSlide();

        expect(component['centerImage']).toEqual(2);
        expect(component['rightImage']).toEqual(0);
        expect(component['leftImage']).toEqual(1);
        expect(loadImagesMethod).toHaveBeenCalled();
    });

    it('leftSideSlide image position , isfilter is false, leftimage = 0', () => {
        component.isFilter = false;
        component['centerImage'] = 1;
        component['rightImage'] = 2;
        component['leftImage'] = 0;

        component.leftSideSlide();

        const positionLeft = -1;
        expect(component['centerImage']).toEqual(0);
        expect(component['rightImage']).toEqual(1);
        expect(component['leftImage']).toEqual(positionLeft);
    });

    it('rightSideSlide image position, isfilter is true ', () => {
        const loadFilteredImageSpy = spyOn(component, 'loadFilteredImage');
        component.isFilter = true;
        component['centerImage'] = 0;
        component['rightImage'] = 1;
        component['leftImage'] = 2;

        component.rightSideSlide();

        expect(component['centerImage']).toEqual(1);
        expect(component['rightImage']).toEqual(0);
        expect(component['leftImage']).toEqual(0);
        expect(loadFilteredImageSpy).toHaveBeenCalled();
    });
    it('rightSideSlide image position, isfilter is true, leftimage = 0 ', () => {
        const loadFilteredImageSpy = spyOn(component, 'loadFilteredImage');
        component.isFilter = true;
        component['centerImage'] = 1;
        component['rightImage'] = 2;
        component['leftImage'] = 0;

        component.rightSideSlide();

        expect(component['centerImage']).toEqual(2);
        expect(component['rightImage']).toEqual(0);
        expect(component['leftImage']).toEqual(1);
        expect(loadFilteredImageSpy).toHaveBeenCalled();
    });

    it('rightSideSlide image position , isfilter is false', () => {
        component.isFilter = false;
        component['centerImage'] = 0;
        component['rightImage'] = 1;
        component['leftImage'] = 2;
        component.rightSideSlide();
        expect(component['centerImage']).toEqual(1);
        expect(component['rightImage']).toEqual(0);
        expect(component['leftImage']).toEqual(0);
        expect(loadImagesMethod).toHaveBeenCalled();
    });

    it('rightSideSlide image position , isfilter is false, leftimage = 0', () => {
        component.isFilter = false;
        component['centerImage'] = 1;
        component['rightImage'] = 2;
        component['leftImage'] = 0;
        component.rightSideSlide();
        expect(component['centerImage']).toEqual(2);
        expect(component['rightImage']).toEqual(0);
        expect(component['leftImage']).toEqual(1);
        expect(loadImagesMethod).toHaveBeenCalled();
    });

    it('call load images and set values when removeFilter is called', () => {
        component.removeFilter();
        expect(component.isFilter).toEqual(false);
        expect(component['centerImage']).toEqual(0);
        expect(component['rightImage']).toEqual(1);
        expect(component['leftImage']).toEqual(component.imageUrlArray.length - 1);
        expect(component['dataArray']).toEqual([]);
        expect(component['filterArray']).toEqual([]);
        expect(loadImagesMethod).toHaveBeenCalled();
    });

    it('should display the names and tags', () => {
        component.isFilter = true;
        component.displayNameAndTags();
        expect(component.displayNameCenter).toEqual(component['filterNameArray'][0]);
        expect(component.displayNameRight).toEqual(component['filterNameArray'][1]);
        expect(component.displayNameLeft).toEqual(component['filterNameArray'][-1]);
    });

    it('should display the names and tags when false', () => {
        component.isFilter = false;
        component.displayNameAndTags();
        expect(component.displayNameCenter).toEqual(component['nameArray'][0]);
        expect(component.displayNameRight).toEqual(component['nameArray'][1]);
        expect(component.displayNameLeft).toEqual(component['nameArray'][-1]);
    });
});

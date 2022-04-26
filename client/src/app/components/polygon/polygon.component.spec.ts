import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { PolygonComponent } from './polygon.component';

describe('PolygonComponent', () => {
    let component: PolygonComponent;
    let fixture: ComponentFixture<PolygonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PolygonComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PolygonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the border width of Polygon', () => {
        const width = 10;
        const event = { value: width } as MatSliderChange;
        component.changePolygonWidth(event);
        expect(component.widthPolygon).toEqual(width);
        expect(component.polygonService.width).toEqual(width);
    });

    it('should change the border sides of Polygon', () => {
        const sides = 8;
        const event = { value: sides } as MatSliderChange;
        component.changePolygonSides(event);
        expect(component.sidesPolygon).toEqual(sides);
    });

    it('should chose the trace of Polygon', () => {
        // tslint:disable:no-string-literal
        const selectValue = component['polygonTraceSelected'];
        const event = { value: selectValue } as MatSelectChange;
        component.changePolygonTrace(event);
        expect(component.polygonService.polygonMode).toEqual(selectValue);
    });
});

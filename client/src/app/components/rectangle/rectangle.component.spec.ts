import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { RectangleComponent } from './rectangle.component';

describe('RectangleComponent', () => {
    let component: RectangleComponent;
    let fixture: ComponentFixture<RectangleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the border width of rectangle', () => {
        const width = 10;
        const event = { value: width } as MatSliderChange;
        component.changeBorderSize(event);
        expect(component.widthBorderRectangle).toEqual(width);
        expect(component.rectangleService.width).toEqual(width);
    });

    it('should chose the trace of rectangle', () => {
        const selectValue = component.rectangleTraceselected;
        const event = { value: selectValue } as MatSelectChange;
        component.changeRectangleTrace(event);
        expect(component.rectangleService.rectangleMode).toEqual(selectValue);
    });
});

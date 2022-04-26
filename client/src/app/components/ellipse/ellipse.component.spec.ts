import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { EllipseComponent } from './ellipse.component';

describe('EllipseComponent', () => {
    let component: EllipseComponent;
    let fixture: ComponentFixture<EllipseComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipseComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the border width of ellipse', () => {
        const width = 10;
        const event = { value: width } as MatSliderChange;
        component.changeBorderEllipseSize(event);
        expect(component.widthBorderEllipse).toEqual(width);
        expect(component.ellipseService.width).toEqual(width);
    });

    it('should chose the trace of ellipse', () => {
        const selectValue = component.ellipseTraceselected;
        const event = { value: selectValue } as MatSelectChange;
        component.changeEllipseTrace(event);
        expect(component.ellipseService.ellipseTrace).toEqual(selectValue);
    });
});

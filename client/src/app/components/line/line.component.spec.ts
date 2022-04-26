import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSliderChange } from '@angular/material/slider';
import { LineComponent } from './line.component';

describe('LineComponent', () => {
    let component: LineComponent;
    let fixture: ComponentFixture<LineComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LineComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the width of the line', () => {
        const width = 10;
        const event = { value: width } as MatSliderChange;
        component.changeLineSize(event);
        expect(component.widthLine).toEqual(width);
        expect(component.lineService.lineWidth).toEqual(width);
    });

    it('should change the radius of the juntion of the line', () => {
        const width = 10;
        const event = { value: width } as MatSliderChange;
        component.changeJunctionRadius(event);
        expect(component.junctionRadius).toEqual(width);
        expect(component.lineService.junctionRadius).toEqual(width);
    });

    it('should check the box when clicked to add the junction fonctionnality for line', () => {
        const event = { checked: true } as MatCheckbox;
        component.junctionChecked(event);
        // tslint:disable:no-string-literal
        expect(component['junctionOn']).toBeTrue();
        expect(component.lineService.junctionOn).toBeTrue();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { AerosolComponent } from './aerosol.component';

describe('AerosolComponent', () => {
    let component: AerosolComponent;
    let fixture: ComponentFixture<AerosolComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AerosolComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AerosolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the size of the circumference of Aerosol', () => {
        const width = 10;
        const event = { value: width } as MatSliderChange;
        component.changeAerosolSize(event);
        expect(component.widthAerosol).toEqual(width);
        expect(component.aerosolService.aerosolWidth).toEqual(width);
    });

    it('should change the droplet size of Aerosol', () => {
        const size = 10;
        const event = { value: size } as MatSliderChange;
        component.changeDropletSize(event);
        expect(component.dropletDiameter).toEqual(size);
        expect(component.aerosolService.dropletDiameter).toEqual(size);
    });

    it('should change the droplet quantity of Aerosol', () => {
        const quantity = 20;
        const event = { value: quantity } as MatSliderChange;
        component.changeDropletQuantity(event);
        expect(component.dropletQuantity).toEqual(quantity);
        expect(component.aerosolService.dropletQuantity).toEqual(quantity);
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/classes/enum';
import { ColorService } from '@app/services/color.service';
import { ColorComponent } from './color.component';

describe('ColorComponent', () => {
    let component: ColorComponent;
    let fixture: ComponentFixture<ColorComponent>;
    let colorService: ColorService;

    beforeEach(async () => {
        colorService = new ColorService();
        await TestBed.configureTestingModule({
            declarations: [ColorComponent],
            providers: [{ provide: ColorService, useValue: colorService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set primary color as secondary and vice versa', () => {
        colorService.primaryColor = '#0001';
        colorService.secondaryColor = '#1001';
        component.exchangeColor();
        expect(colorService.primaryColor).toEqual('#1001');
        expect(colorService.secondaryColor).toEqual('#0001');
    });

    it('should change rgba value to hexa', () => {
        component.conversionToHexa('255', '255', '255');
        expect(colorService.primaryColor).toEqual('#ffffff');
    });

    it('should not allow values not in hexa', () => {
        const colorNotAllowed = 'GHIJ';
        colorService.primaryColor = colorNotAllowed;
        component.colorInputInHexa();
        expect(colorService.primaryColor).toEqual('#000000');
    });

    it('should select add a color when clicking on it and set it as primary', () => {
        const event = { offsetX: 50, offsetY: 60, button: MouseButton.Left } as MouseEvent;
        const spy = spyOn(colorService, 'addPreviousColorToList').and.stub();
        component.onMouseDownPalette(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should select primary color when left clicking on mouse from previous colors', () => {
        const event = { offsetX: 50, offsetY: 60, button: MouseButton.Left } as MouseEvent;
        const spy = spyOn(colorService, 'addPreviousColorToList').and.stub();
        component.selectPrimaryAndSecondary(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should select secondary color when right clicking on mouse from previous colors', () => {
        const event = { offsetX: 50, offsetY: 60, button: MouseButton.Right } as MouseEvent;
        const spy = spyOn(colorService, 'addPreviousColorToList').and.stub();
        const spyDisplayColorSlider = spyOn(component, 'displayColorSlider').and.stub();
        component.selectPrimaryAndSecondary(event);
        expect(spyDisplayColorSlider);
        expect(spy).toHaveBeenCalled();
    });

    it('should select primary color when left clicking on mouse', () => {
        const lastPositionArray = 9;
        const event = { offsetX: 50, offsetY: 60, button: MouseButton.Left } as MouseEvent;
        colorService.addPreviousColorToList('rgba(1,1,1,1)');
        component.chooseFromPreviousColors(event, colorService.previousColors[lastPositionArray]);
        expect(colorService.primaryColor).toEqual('rgba(1,1,1,1)');
    });

    it('should select secondary color when right clicking on mouse', () => {
        const lastPositionArray = 9;
        const event = { offsetX: 50, offsetY: 60, button: MouseButton.Right } as MouseEvent;
        colorService.addPreviousColorToList('rgba(1,1,1,1)');
        component.chooseFromPreviousColors(event, colorService.previousColors[lastPositionArray]);
        expect(colorService.secondaryColor).toEqual('rgba(1,1,1,1)');
    });
});

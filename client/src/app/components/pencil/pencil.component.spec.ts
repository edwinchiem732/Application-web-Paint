import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { PencilComponent } from './pencil.component';

describe('PencilComponent', () => {
    let component: PencilComponent;
    let fixture: ComponentFixture<PencilComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the line width of pencil', () => {
        const width = 10;
        const event = { value: width } as MatSliderChange;
        component.onWidthPencilChange(event);
        expect(component.widthPencil).toEqual(width);
        expect(component.pencilService.pencilWidth).toEqual(width);
    });
});

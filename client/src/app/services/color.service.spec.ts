import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';

describe('ColorServiceService', () => {
    let service: ColorService;
    const LAST_POSITION_ARRAY = 9;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ColorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add new color in last ten colors table', () => {
        service.addPreviousColorToList('#0fff');
        const table = service.getPreviousColor();
        expect(table[LAST_POSITION_ARRAY]).toEqual({ color: '#0fff' });
    });
});

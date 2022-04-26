import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PaintBucketComponent } from './paint-bucket.component';

describe('PaintBucketComponent', () => {
    let component: PaintBucketComponent;
    let fixture: ComponentFixture<PaintBucketComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaintBucketComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaintBucketComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { Component } from '@angular/core';
import { ColorService } from '@app/services/color.service';
import { PaintBucketService } from '@app/services/paint-bucket/paint-bucket.service';

@Component({
    selector: 'app-paint-bucket',
    templateUrl: './paint-bucket.component.html',
    styleUrls: ['./paint-bucket.component.scss'],
})
export class PaintBucketComponent {
    constructor(public paintBucketService: PaintBucketService, public colorService: ColorService) {}
}

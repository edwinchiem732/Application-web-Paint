import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { ExportComponent } from '@app/components/export/export.component';
import { DEFAULT, MAX_LETTER } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServerService } from '@app/services/server/server.service';

@Component({
    selector: 'app-carrousel',
    templateUrl: './carrousel.component.html',
    styleUrls: ['./carrousel.component.scss'],
})
export class CarrouselComponent implements OnInit {
    @ViewChild('canvasLeft', { static: true }) canvasLeft: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasCenter', { static: true }) canvasCenter: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasRight', { static: true }) canvasRight: ElementRef<HTMLCanvasElement>;
    @ViewChild('rightGrabber', { static: false }) rightGrabber: ElementRef<HTMLElement>;

    contextLeft: CanvasRenderingContext2D;
    contextCenter: CanvasRenderingContext2D;
    contextRight: CanvasRenderingContext2D;

    // database info
    private nameArray: string[] = [];
    private tagsArray: string[] = [];
    private idArray: string[] = [];
    // tslint:disable-next-line: no-any
    private dataArray: any[] = []; // contains everything

    isFilter: boolean = false;
    imageUrlArray: string[] = [];
    tags: string[] = [];

    private centerImage: number = 0;
    private leftImage: number = this.imageUrlArray.length - 1;
    private rightImage: number = 1;
    tag: string = '';
    alert: boolean = false;
    messageError: string = '';

    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    private filterNameArray: string[] = [];
    private filterTagArray: string[] = [];
    filterArray: string[] = [];

    displayNameCenter: string = this.nameArray[this.centerImage];
    displayTagCenter: string = this.tagsArray[this.centerImage];

    displayNameRight: string = this.nameArray[this.centerImage];
    displayTagRight: string = this.tagsArray[this.centerImage];

    displayNameLeft: string = this.nameArray[this.centerImage];
    displayTagLeft: string = this.tagsArray[this.centerImage];

    constructor(public serverService: ServerService, private dialog: MatDialogRef<ExportComponent>, public drawingService: DrawingService) {
        this.initial();
        this.getServerNameAndTags();
    }

    ngOnInit(): void {
        this.removeFilter();
        this.initial();
        this.loadImages();
        this.getServerNameAndTags();
    }

    @HostListener('window:keydown', ['$event'])
    shortcutSelect(keyboardEvent: KeyboardEvent): void {
        switch (
            keyboardEvent.key // disable key for input
        ) {
            case 'j':
                this.leftSideSlide();
                break;
            case 'k':
                this.rightSideSlide();
                break;
        }
    }

    initial(): void {
        this.centerImage = 0;
        this.rightImage = 1;
        this.leftImage = this.imageUrlArray.length - 1;
    }

    filterInitial(): void {
        this.centerImage = 0;
        this.rightImage = 1;
        this.leftImage = this.filterArray.length - 1;
    }

    addInputTag(event: MatChipInputEvent): void {
        let bool = true;
        const input = event.input;
        const value = event.value;
        this.alert = false;

        for (const it of this.tags) {
            if (it === value) {
                bool = false;
            }
        }

        if ((value || '').trim() && bool) {
            this.tags.push(value.trim());
        }

        if (value.length > MAX_LETTER) {
            this.alert = true;
            this.messageError = 'S.V.P entrez un maximum de 5 lettres';
            this.removeTagInput(value);
        }

        if (!/^\S{3,}$/.test(value)) {
            this.alert = true;
            this.messageError = 'S.V.P ne pas inclure des espaces';
            this.removeTagInput(value);
        }

        if (/\d/.test(value)) {
            this.alert = true;
            this.messageError = 'S.V.P ne pas inclure des chiffres';
            this.removeTagInput(value);
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeTagInput(tag: string): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
        if (this.tags.length === 0) {
            this.isFilter = false;
            this.dataArray = [];
            this.filterArray = [];
            this.loadImages();
        }
    }

    // add data of drawing from server to an array
    // tslint:disable-next-line: no-any
    getDataDrawing(): any {
        for (const i of this.serverService.dataArray) {
            for (const j of this.tags) {
                if (i.tags.indexOf(j) > DEFAULT) {
                    this.dataArray.push(i);
                    break;
                }
            }
        }
        this.isFilter = true;
        return this.dataArray;
    }

    filterDrawing(): void {
        this.removeFilter();
        this.filterInitial();
        this.isFilter = true;
        this.getDataDrawing();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.tagsArray.length; i++) {
            // tslint:disable-next-line: prefer-for-of
            for (let j = 0; j < this.dataArray.length; j++) {
                if (this.tagsArray[i] === this.dataArray[j].tags) {
                    this.filterArray.push(this.imageUrlArray[i]);
                    this.filterNameArray.push(this.nameArray[i]);
                    this.filterTagArray.push(this.tagsArray[i]);
                }
            }
        }
        this.filterInitial();
        this.loadFilteredImage();
    }

    removeFilter(): void {
        this.isFilter = false;
        this.centerImage = 0;
        this.rightImage = 1;
        this.leftImage = this.imageUrlArray.length - 1;
        this.dataArray = [];
        this.filterArray = [];
        this.loadImages();
    }

    // get the names and tags from the server
    getServerNameAndTags(): void {
        // tslint:disable-next-line: deprecation
        this.serverService.getDrawingUploads().subscribe(
            (data) => {
                data.pop();
                for (const it of data) {
                    this.imageUrlArray.push(it.url);
                    this.nameArray.push(it.name);
                    this.tagsArray.push(it.tags);
                    this.idArray.push(it.id);
                }
                this.leftImage = this.imageUrlArray.length - 1;
                this.loadImages();
            },
            (err) => {
                alert(err);
            },
        );
    }

    deleteDrawing(): void {
        // tslint:disable-next-line: deprecation
        this.serverService.deleteDrawing(this.idArray[this.centerImage]).subscribe(
            () => {
                alert('Image supprimée');
                this.idArray.splice(this.centerImage, 1);
                this.imageUrlArray.splice(this.centerImage, 1);
                this.nameArray.splice(this.centerImage, 1);
                this.tagsArray.splice(this.centerImage, 1);
                this.dataArray.splice(this.centerImage, 1);
                this.updatePositionImages();
                this.loadImages();
            },
            (err) => {
                alert("Image n'a pas pu être supprimée");
            },
        );
    }

    selectDrawing(): void {
        if (this.drawingService.checkEmptyCanvas()) {
            const answer = confirm('Est-ce que vous voulez abandonner ce dessin?');
            if (answer) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                const image = new Image();
                image.src = this.imageUrlArray[this.centerImage];

                image.onload = () => {
                    this.drawingService.baseCtx.drawImage(image, 0, 0);
                };

                this.cancel();
            }
        } else {
            const image = new Image();
            image.src = this.imageUrlArray[this.centerImage];
            image.onload = () => {
                this.drawingService.baseCtx.drawImage(image, 0, 0);
            };
            this.cancel();
        }
    }

    sizeSavedImages(): void {
        this.contextLeft = this.canvasLeft.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        const imgLeft = new Image();
        const imgCenter = new Image();
        const imgRight = new Image();

        imgLeft.onload = () => {
            this.contextLeft.drawImage(imgLeft, this.contextLeft.canvas.width, this.contextLeft.canvas.height);
        };
        imgLeft.src = this.imageUrlArray[this.leftImage];

        this.contextCenter = this.canvasCenter.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        imgCenter.onload = () => {
            this.contextCenter.drawImage(imgCenter, this.contextCenter.canvas.width, this.contextCenter.canvas.height);
        };
        imgCenter.src = this.imageUrlArray[this.centerImage];

        this.contextRight = this.canvasRight.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        imgRight.onload = () => {
            this.contextRight.drawImage(imgRight, this.contextRight.canvas.width, this.contextRight.canvas.height);
        };
        imgRight.src = this.imageUrlArray[this.rightImage];
        console.log('canvas size', this.contextRight.canvas.width, this.contextRight.canvas.height);
        console.log('imgright', imgRight.width, imgRight.height);
    }

    private updatePositionImages(): void {
        if (this.rightImage >= this.imageUrlArray.length - 1) this.rightImage = 0;
        if (this.leftImage >= this.imageUrlArray.length - 1) this.leftImage--;
        if (this.centerImage >= this.imageUrlArray.length - 1) {
            this.centerImage = this.rightImage;
            this.rightImage++;
            this.leftImage++;
        }
    }

    // for right button
    rightSideSlide(): void {
        if (this.isFilter) {
            this.leftImage = this.centerImage;
            this.centerImage = this.rightImage;
            if (this.rightImage >= this.filterArray.length - 1) {
                this.rightImage = 0;
            } else {
                this.rightImage++;
            }
            this.loadFilteredImage();
        } else {
            this.leftImage = this.centerImage;
            this.centerImage = this.rightImage;
            if (this.rightImage >= this.imageUrlArray.length - 1) {
                this.rightImage = 0;
            } else {
                this.rightImage++;
            }
            this.loadImages();
        }
    }

    // for left button
    leftSideSlide(): void {
        if (this.isFilter) {
            this.rightImage = this.centerImage;
            this.centerImage = this.leftImage;
            if (this.leftImage === 0) this.leftImage = this.filterArray.length - 1;
            else {
                this.leftImage--;
            }
            this.loadFilteredImage();
        } else {
            this.rightImage = this.centerImage;
            this.centerImage = this.leftImage;
            if (this.leftImage === 0) this.leftImage = this.imageUrlArray.length - 1;
            else {
                this.leftImage--;
            }
            this.loadImages();
        }
    }

    // display the names and the tags on the UI side
    displayNameAndTags(): void {
        if (this.isFilter) {
            this.displayNameCenter = this.filterNameArray[this.centerImage];
            this.displayNameRight = this.filterNameArray[this.rightImage];
            this.displayNameLeft = this.filterNameArray[this.leftImage];

            this.displayTagCenter = this.filterTagArray[this.centerImage];
            this.displayTagRight = this.filterTagArray[this.rightImage];
            this.displayTagLeft = this.filterTagArray[this.leftImage];
        } else {
            this.displayNameCenter = this.nameArray[this.centerImage];
            this.displayNameRight = this.nameArray[this.rightImage];
            this.displayNameLeft = this.nameArray[this.leftImage];

            this.displayTagCenter = this.tagsArray[this.centerImage];
            this.displayTagRight = this.tagsArray[this.rightImage];
            this.displayTagLeft = this.tagsArray[this.leftImage];
        }
    }

    // load images when trying to filter images
    loadFilteredImage(): void {
        this.displayNameAndTags();
        if (this.isFilter) {
            if (this.filterArray.length === 1) {
                const mainView = document.getElementById('mainView');
                // tslint:disable-next-line: no-non-null-assertion
                mainView!.style.background = 'url(' + this.filterArray[this.centerImage] + ')';
                // this.canvasCenter.nativeElement.style.background = 'url(' + this.filterArray[this.centerImage] + ')';
            }
            if (this.filterArray.length === 2) {
                const mainView = document.getElementById('mainView');
                // tslint:disable-next-line: no-non-null-assertion
                mainView!.style.background = 'url(' + this.filterArray[this.centerImage] + ')';

                const rightView = document.getElementById('rightView');
                // tslint:disable-next-line: no-non-null-assertion
                rightView!.style.background = 'url(' + this.filterArray[this.rightImage] + ')';
            } else {
                const mainView = document.getElementById('mainView');
                // tslint:disable-next-line: no-non-null-assertion
                mainView!.style.background = 'url(' + this.filterArray[this.centerImage] + ')';

                const leftView = document.getElementById('leftView');
                // tslint:disable-next-line: no-non-null-assertion
                leftView!.style.background = 'url(' + this.filterArray[this.leftImage] + ')';

                const rightView = document.getElementById('rightView');
                // tslint:disable-next-line: no-non-null-assertion
                rightView!.style.background = 'url(' + this.filterArray[this.rightImage] + ')';
            }
        }
    }

    // source: https://codepen.io/Mrrowlie/pen/bGbLOdv
    // without the filtering
    loadImages(): void {
        this.displayNameAndTags();
        if (this.imageUrlArray.length === 1) {
            const mainView = document.getElementById('mainView');
            // tslint:disable-next-line: no-non-null-assertion
            mainView!.style.background = 'url(' + this.imageUrlArray[this.centerImage] + ')';
        }

        if (this.imageUrlArray.length === 2) {
            const mainView = document.getElementById('mainView');
            // tslint:disable-next-line: no-non-null-assertion
            mainView!.style.background = 'url(' + this.imageUrlArray[this.centerImage] + ')';

            const rightView = document.getElementById('rightView');
            // tslint:disable-next-line: no-non-null-assertion
            rightView!.style.background = 'url(' + this.imageUrlArray[this.rightImage] + ')';
        } else {
            const mainView = document.getElementById('mainView');
            // tslint:disable-next-line: no-non-null-assertion
            mainView!.style.background = 'url(' + this.imageUrlArray[this.centerImage] + ')';

            const leftView = document.getElementById('leftView');
            // tslint:disable-next-line: no-non-null-assertion
            leftView!.style.background = 'url(' + this.imageUrlArray[this.leftImage] + ')';

            const rightView = document.getElementById('rightView');
            // tslint:disable-next-line: no-non-null-assertion
            rightView!.style.background = 'url(' + this.imageUrlArray[this.rightImage] + ')';
        }
    }

    cancel(): void {
        this.isFilter = false;
        this.dialog.close();
    }
}
// tslint:disable-next-line: max-file-line-count

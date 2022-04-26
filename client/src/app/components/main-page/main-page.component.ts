import { Component } from '@angular/core';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { IndexService } from '@app/services/index/index.service';
import { Message } from '@common/message';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'Poly Dessin 2';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    routeQueryParams$: Subscription;
    isNotEmpty: boolean;

    constructor(private basicService: IndexService, public drawingService: DrawingService, public sidebarComponent: SidebarComponent) {
        console.log('constructor');
        this.isNotEmpty = localStorage.hasOwnProperty('url');
    }

    sendTimeToServer(): void {
        const newTimeMessage: Message = {
            title: 'Hello from the client',
            body: 'Time is : ' + new Date().toString(),
        };
        // Important not to forget "subscribe" or the call will never be launched since no one is watching it
        this.basicService.basicPost(newTimeMessage).subscribe();
    }

    getMessagesFromServer(): void {
        this.basicService
            .basicGet()
            // This step transforms the Message into a single string
            .pipe(
                map((message: Message) => {
                    return `${message.title} ${message.body}`;
                }),
            )
            .subscribe(this.message);
    }

    openCarrousel(): void {
        this.sidebarComponent.openCarrousel();
    }

    continueDrawing(): void {
        this.drawingService.getLocalStorageData();
    }

    newDrawing(): void {
        this.drawingService.newDrawing();
    }
}

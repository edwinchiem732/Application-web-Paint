import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDrawing } from '@common/communication/drawing';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ServerService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/drawing';
    // tslint:disable-next-line: no-any
    dataArray: any[] = [{}];
    drawing: IDrawing[] = [];

    constructor(private http: HttpClient) {}

    // save drawing
    // tslint:disable-next-line: no-any
    addDrawing(drawing: any): Observable<any> {
        return this.http.post(this.BASE_URL, drawing);
    }

    // carrousel
    // tslint:disable-next-line: no-any
    getDrawingUploads(): Observable<any[]> {
        // tslint:disable-next-line: no-any
        const subject = new Subject<any[]>();
        // tslint:disable-next-line: no-any
        this.http.get<any[]>(this.BASE_URL).subscribe((data) => {
            this.dataArray = data;
            // send messages to an observable which are then sent to all angular components that are subscribers
            subject.next(data);
        });
        return subject.asObservable();
    }

    // carrousel
    // tslint:disable-next-line: no-any
    deleteDrawing(id: string): Observable<any> {
        const url = `${this.BASE_URL}/${id}`;
        return this.http.delete(url);
    }
}

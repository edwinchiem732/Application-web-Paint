import { HttpClientModule } from '@angular/common/http'; // protocol for communicating with the web server
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AerosolComponent } from './components/aerosol/aerosol.component';
import { AppComponent } from './components/app/app.component';
import { CarrouselComponent } from './components/carrousel/carrousel.component';
import { ColorComponent } from './components/color/color.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { EllipseComponent } from './components/ellipse/ellipse.component';
import { EraserComponent } from './components/eraser/eraser.component';
import { ExportComponent } from './components/export/export.component';
import { GridComponent } from './components/grid/grid/grid.component';
import { LineComponent } from './components/line/line.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { NewDrawingDialogComponent } from './components/new-drawing-dialog/new-drawing-dialog.component';
import { PencilComponent } from './components/pencil/pencil.component';
import { PolygonComponent } from './components/polygon/polygon.component';
import { RectangleComponent } from './components/rectangle/rectangle.component';
import { SaveDrawingComponent } from './components/save-drawing/save-drawing.component';
import { SelectionComponent } from './components/selection/selection.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StampComponent } from './components/stamp/stamp.component';
import { TextComponent } from './components/text/text.component';
import { PaintBucketComponent } from './paint-bucket/paint-bucket.component';
import { PipetteComponent } from './pipette/pipette.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        NewDrawingDialogComponent,
        ColorComponent,
        ExportComponent,
        SaveDrawingComponent,
        CarrouselComponent,
        PipetteComponent,
        AerosolComponent,
        PolygonComponent,
        LineComponent,
        EllipseComponent,
        RectangleComponent,
        StampComponent,
        GridComponent,
        PencilComponent,
        EraserComponent,
        SelectionComponent,
        PaintBucketComponent,
        TextComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        MatSliderModule,
        MatTooltipModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatRadioModule,
        MatInputModule,
        MatChipsModule,
        MatSnackBarModule,
    ],

    exports: [MatButtonModule, MatFormFieldModule],
    providers: [SidebarComponent],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constant/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeCanvasService } from '@app/services/resize-canvas.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { DrawingComponent } from './drawing.component';
class ToolStub extends Tool {}

/* tslint:disable:no-string-literal */
describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let shiftEvent: KeyboardEvent;
    let escapeEvent: KeyboardEvent;
    let backspaceEvent: KeyboardEvent;
    let resizeCanvasService: ResizeCanvasService;
    // let altDownEvent: KeyboardEvent;
    // let altUpEvent: KeyboardEvent;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService();

        resizeCanvasService = new ResizeCanvasService(drawingStub);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: ResizeCanvasService, useValue: resizeCanvasService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        shiftEvent = new KeyboardEvent('keypress', {
            key: 'Shift',
        });

        escapeEvent = new KeyboardEvent('keypress', {
            key: 'Escape',
        });

        backspaceEvent = new KeyboardEvent('keypress', {
            key: 'Backspace',
        });

        // altDownEvent = new KeyboardEvent('keypress', {
        //     key: 'Alt',
        // });

        // altUpEvent = new KeyboardEvent('keyUp', {
        //     key: 'Alt',
        // });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a default WIDTH and HEIGHT', () => {
        const height = component.height;
        const width = component.width;
        expect(height).toEqual(DEFAULT_HEIGHT);
        expect(width).toEqual(DEFAULT_WIDTH);
    });

    it('dotted canvas should have a default WIDTH and HEIGTH', () => {
        const dottedWidth = drawingStub.dotSize.x;
        const dottedHeight = drawingStub.dotSize.y;
        expect(dottedHeight).toEqual(DEFAULT_HEIGHT);
        expect(dottedWidth).toEqual(DEFAULT_WIDTH);
    });

    it('should get stubTool', () => {
        const currentTool = component['currentTool'];
        expect(currentTool).toEqual(toolStub);
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown');

        spyOn(component.sideGrabber.nativeElement, 'contains').and.returnValue(false);
        spyOn(component.bottomGrabber.nativeElement, 'contains').and.returnValue(false);
        spyOn(component.rightGrabber.nativeElement, 'contains').and.returnValue(false);

        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(component['grabber']).toBeFalse();
    });

    it(' should set grabber to true when mouse down on grabber', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown');

        spyOn(component.sideGrabber.nativeElement, 'contains').and.returnValue(true);
        spyOn(component.bottomGrabber.nativeElement, 'contains').and.returnValue(true);
        spyOn(component.rightGrabber.nativeElement, 'contains').and.returnValue(true);

        component.onMouseDown(event);
        expect(mouseEventSpy).not.toHaveBeenCalled();
        expect(mouseEventSpy).not.toHaveBeenCalledWith(event);
        expect(component['grabber']).toBeTrue();
    });

    it(' should call the tools mouse click when receiving a mouse  click event ', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseClick');

        spyOn(component.baseCanvas.nativeElement, 'contains').and.returnValue(true);
        spyOn(component.previewCanvas.nativeElement, 'contains').and.returnValue(true);

        component.onMouseClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' should not call the tools on mouse click when not receiving a mouse click event', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseClick');

        spyOn(component.baseCanvas.nativeElement, 'contains').and.returnValue(false);
        spyOn(component.previewCanvas.nativeElement, 'contains').and.returnValue(false);

        component.onMouseClick(event);
        expect(mouseEventSpy).not.toHaveBeenCalled();
        expect(mouseEventSpy).not.toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const resizerSpy = spyOn(resizeCanvasService, 'resizer');
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(resizerSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' should resize and set new properties of the dotted canvas if grabber is moving', () => {
        const event = {} as MouseEvent;
        component['grabber'] = true;
        component.onMouseMove(event);
        expect(component.dot.nativeElement.style.border).toEqual('dotted');
    });

    it(' should resize and set new properties of the dotted canvas if grabber bas is moving', () => {
        const event = {} as MouseEvent;
        component['boolGrabberBottom'] = true;
        component.onMouseMove(event);
        expect(component.dot.nativeElement.style.border).toEqual('dotted');
    });

    it(' should resize and set new properties of the dotted canvas if grabber droite is moving', () => {
        const event = {} as MouseEvent;
        component['boolGrabberRight'] = true;
        component.onMouseMove(event);
        expect(component.dot.nativeElement.style.border).toEqual('dotted');
    });

    it(" should call the tool's mouse out when receiving a mouse out event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseOut').and.callThrough();
        component.onMouseOut(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse enter when receiving a mouse enter event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseEnter').and.callThrough();
        component.onMouseEnter(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse double click when receiving a mouse double click event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDoubleClick').and.callThrough();
        component.onMouseDoubleClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' should set bool grabber, boolGrabberBottom and boolGrabberRight to false when mouseUp', () => {
        const event = {} as MouseEvent;
        component.onMouseUp(event);
        expect(component['grabber']).toEqual(false);
        expect(component['boolGrabberBottom']).toEqual(false);
        expect(component['boolGrabberRight']).toEqual(false);
    });

    it(" should call the tool's shift up when receiving a shift up event", () => {
        const event = new KeyboardEvent('window:keyup', {});
        const spy = spyOn(toolStub, 'onShiftUp').and.callThrough();
        component.selectKeyUp(shiftEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's shift down when receiving a shift down event", () => {
        const event = new KeyboardEvent('window:keydown', {});
        const spy = spyOn(toolStub, 'onShiftDown').and.callThrough();
        component.shortcutSelect(shiftEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's escape down when receiving a escape down event", () => {
        const event = new KeyboardEvent('window:keydown', {});
        const spy = spyOn(toolStub, 'onEscape').and.callThrough();
        component.shortcutSelect(escapeEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's backspace down when receiving a spackspace down event", () => {
        const event = new KeyboardEvent('window:keydown', {});
        const spy = spyOn(toolStub, 'onBackspace').and.callThrough();
        component.shortcutSelect(backspaceEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event);
    });
});

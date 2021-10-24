import { AfterViewInit, Directive, ElementRef } from "@angular/core";

@Directive({
    selector: "input[inputAutoFocus]",
})
export class AutofocusDirective implements AfterViewInit {
    constructor(private _elementRef: ElementRef) {}

    ngAfterViewInit(): void {
        this._elementRef.nativeElement.focus();
    }
}

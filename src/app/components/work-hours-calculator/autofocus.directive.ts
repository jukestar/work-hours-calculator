import { AfterViewInit, Directive, ElementRef } from "@angular/core";

@Directive({
    selector: "[autofocus]",
})
export class AutofocusDirective implements AfterViewInit {
    constructor(private _host: ElementRef) {}

    ngAfterViewInit(): void {
        console.log(this._host);
    }
}

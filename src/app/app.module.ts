import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";

import { AppComponent } from "./app.component";
import { WorkHoursCalculatorComponent } from "./components/work-hours-calculator/work-hours-calculator.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
    ],
    declarations: [AppComponent, WorkHoursCalculatorComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { WorkHoursCalculatorComponent } from "./components/work-hours-calculator/work-hours-calculator.component";

@NgModule({
    imports: [BrowserModule, FormsModule, ReactiveFormsModule],
    declarations: [AppComponent, WorkHoursCalculatorComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}

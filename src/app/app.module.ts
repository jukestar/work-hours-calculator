import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";

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
        MatButtonModule,
        MatDividerModule,
        MatCardModule,
    ],
    declarations: [AppComponent, WorkHoursCalculatorComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}

import { Component } from "@angular/core";
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
import { defer, Observable } from "rxjs";
import { distinctUntilChanged, startWith } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { validateTimeRange } from "./time-range.validator";

export const controlChanges = <T>(control: AbstractControl): Observable<T> =>
    defer(() =>
        control.valueChanges.pipe(
            startWith(control.value),
            distinctUntilChanged()
        )
    );

interface WorkTime {
    startTime: string;
    endTime: string;
    lunchBreak: number;
}

@Component({
    selector: "app-work-hours-calculator",
    templateUrl: "work-hours-calculator.component.html",
    styleUrls: ["work-hours-calculator.component.scss"],
})
export class WorkHoursCalculatorComponent {
    form: FormGroup;

    private _initialWorkTime: WorkTime = {
        startTime: "00:00",
        endTime: "00:00",
        lunchBreak: 30,
    };

    constructor(private _builder: FormBuilder, private _snackBar: MatSnackBar) {
        this.form = this._buildForm(_builder, this._initialWorkTime);
    }

    get totalWorkTime(): string {
        if (this.form.invalid) {
            return "Ugyldig";
        }
        const workHours = this.workHoursArray.value;

        let total = 0;
        workHours.forEach((workTime: WorkTime) => {
            const totalSeconds = this._calculateSeconds(workTime);
            total += totalSeconds;
        });
        if (total < 0) {
            return "Ugyldig";
        }
        return this.secondsToHHMM(total);
    }

    get workHoursArray(): FormArray {
        return this.form.get("workHours") as FormArray;
    }

    hasError(group: FormGroup) {
        const startTimeControl = group.get("startTime");
        const endTimeControl = group.get("endTime");
        const displayError =
            startTimeControl.touched &&
            startTimeControl.dirty &&
            endTimeControl.touched &&
            endTimeControl.dirty;
        return displayError && group.hasError("timeRange");
    }

    getWorkHourFormGroup(formGroup: any) {
        return formGroup as FormGroup;
    }

    workTimeLineValue(index: number): string {
        const workTime = this.workHoursArray.value[index];
        const totalSeconds = this._calculateSeconds(workTime);
        if (totalSeconds < 0) {
            return "";
        }
        return this.secondsToHHMM(totalSeconds);
    }

    addWorkHours() {
        this.workHoursArray.push(
            this._builder.group(
                {
                    startTime: this._initialWorkTime.startTime,
                    endTime: this._initialWorkTime.endTime,
                    lunchBreak: [0, Validators.min(0)],
                },
                { validator: validateTimeRange }
            )
        );
    }

    removeWorkTimeLine(index: number): void {
        if (index === 0) {
            return;
        }
        this.workHoursArray.removeAt(index);
    }

    secondsToHHMM(seconds: number): string {
        if (seconds === 0) {
            return "";
        }

        const isValid = seconds > 0;
        if (!isValid) {
            return "Ugyldig";
        }
        var secondsAsHours = (seconds / 3600).toString();
        var secondsAsMinutes = ((seconds / 60) % 60).toString();
        var hours = parseInt(secondsAsHours, 10);
        var minutes = parseInt(secondsAsMinutes, 10);

        return [hours, minutes]
            .map((value) =>
                value.toString().length === 2 ? value : "0" + value
            )
            .join(":");
    }

    onReset(): void {
        this.workHoursArray.clear();
        this.workHoursArray.setControl(
            0,
            this._builder.group(
                {
                    startTime: this._initialWorkTime.startTime,
                    endTime: this._initialWorkTime.endTime,
                    lunchBreak: [
                        this._initialWorkTime.lunchBreak,
                        Validators.min(0),
                    ],
                },
                { validator: validateTimeRange }
            )
        );
    }

    copyComplete(value: string): void {
        this._snackBar.open(`${value} kopiert!`, "", {
            duration: 2000,
        });
    }

    private _calculateSeconds(workTime: WorkTime): number {
        const fromDate = new Date(`${"2000-01-01"}T${workTime.startTime}`);
        const toDate = new Date(`${"2000-01-01"}T${workTime.endTime}`);
        const diffAsSeconds = (toDate.valueOf() - fromDate.valueOf()) / 1000;
        const breakInSeconds = workTime.lunchBreak * 60;
        return diffAsSeconds - breakInSeconds;
    }

    private _buildForm(builder: FormBuilder, workTime: WorkTime): FormGroup {
        return builder.group({
            workHours: builder.array([
                builder.group(
                    {
                        startTime: workTime.startTime,
                        endTime: workTime.endTime,
                        lunchBreak: [workTime.lunchBreak, Validators.min(0)],
                    },
                    { validator: validateTimeRange }
                ),
            ]),
        });
    }
}

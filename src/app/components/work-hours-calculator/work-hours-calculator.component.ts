import { Component } from "@angular/core";
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
} from "@angular/forms";
import { defer, Observable, combineLatest } from "rxjs";
import {
    distinctUntilChanged,
    map,
    startWith,
    take,
    takeUntil,
} from "rxjs/operators";

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

interface Dictionary<T> {
    [key: string]: T;
}

@Component({
    selector: "app-work-hours-calculator",
    templateUrl: "work-hours-calculator.component.html",
    styleUrls: ["work-hours-calculator.component.scss"],
})
export class WorkHoursCalculatorComponent {
    form: FormGroup;
    fromControl = new FormControl();
    toControl = new FormControl();
    breakControl = new FormControl(30);
    value$: Observable<number>;
    timeDurations: number[] = [];

    private _initialWorkTime: WorkTime = {
        startTime: "00:00",
        endTime: "00:00",
        lunchBreak: 30,
    };

    constructor(builder: FormBuilder) {
        this.form = this._buildForm(builder, this._initialWorkTime);

        this.value$ = controlChanges(this.form).pipe(
            map((formValues: any) => {
                const fromDate = new Date(
                    `${"2000-01-01"}T${formValues.startTime}`
                );
                const toDate = new Date(
                    `${"2000-01-01"}T${formValues.endTime}`
                );
                const diffAsSeconds =
                    (toDate.valueOf() - fromDate.valueOf()) / 1000;
                const breakInSeconds = formValues.lunchBreak * 60;
                const totalSeconds = diffAsSeconds - breakInSeconds;
                return totalSeconds > 0 ? totalSeconds : null;
            })
        );
    }

    get summation(): string | undefined {
        if (
            this.timeDurations === null ||
            this.timeDurations === undefined ||
            this.timeDurations.length === 0
        )
            return undefined;

        const totalSeconds = this.timeDurations.reduce((a, b) => a + b);
        return this.secondsToHHMM(totalSeconds);
    }

    addTimeDuration(seconds: number): void {
        this.timeDurations.push(seconds);
        this.breakControl.setValue(0);
        this.fromControl.setValue(null);
        this.toControl.setValue(null);
    }

    secondsToHHMM(seconds: number) {
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
        this.breakControl.setValue(30);
        this.fromControl.setValue(null);
        this.toControl.setValue(null);
        this.timeDurations = [];
    }

    private _toFormData(value: WorkTime): any {
        return {
            startTime: value.startTime,
            endTime: value.endTime,
            lunchBreak: value.lunchBreak,
        };
    }

    private _buildForm(builder: FormBuilder, workTime: WorkTime): FormGroup {
        return builder.group({
            startTime: workTime.startTime,
            endTime: workTime.endTime,
            lunchBreak: workTime.lunchBreak,
        });
    }
}

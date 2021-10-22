import { Component } from "@angular/core";
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { defer, Observable } from "rxjs";
import { distinctUntilChanged, map, startWith, take } from "rxjs/operators";

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
    form2: FormGroup;

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

    constructor(private _builder: FormBuilder) {
        this.form = this._buildForm(_builder, this._initialWorkTime);
        this.form2 = this._buildForm2(_builder, this._initialWorkTime);

        this.form2.valueChanges.pipe(take(10)).subscribe(console.log);

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
    get workHoursArray(): FormArray {
        return this.form2.get("workHours") as FormArray;
    }

    get totalWorkTime(): number | string {
        if (this.form2.invalid) {
            return "Ugyldig";
        }
        const workHours = this.form2.get("workHours").value;

        let total = 0;
        workHours.forEach((workHour: WorkTime) => {
            const fromDate = new Date(`${"2000-01-01"}T${workHour.startTime}`);
            const toDate = new Date(`${"2000-01-01"}T${workHour.endTime}`);
            const diffAsSeconds =
                (toDate.valueOf() - fromDate.valueOf()) / 1000;
            const breakInSeconds = workHour.lunchBreak * 60;
            const totalSeconds = diffAsSeconds - breakInSeconds;
            total += totalSeconds;
        });
        if (total < 0) {
            return "Ugyldig";
        }
        return this.secondsToHHMM(total);
    }

    lineValue(index: number): string {
        const workTime = this.form2.get("workHours").value[index];
        const fromDate = new Date(`${"2000-01-01"}T${workTime.startTime}`);
        const toDate = new Date(`${"2000-01-01"}T${workTime.endTime}`);
        const diffAsSeconds = (toDate.valueOf() - fromDate.valueOf()) / 1000;
        const breakInSeconds = workTime.lunchBreak * 60;
        const totalSeconds = diffAsSeconds - breakInSeconds;
        if (totalSeconds < 0) {
            return "";
        }
        return this.secondsToHHMM(totalSeconds);
    }

    getWorkHourFormGroup(x: any) {
        return x as FormGroup;
    }

    addWorkHours() {
        this.workHoursArray.push(
            this._builder.group({
                startTime: this._initialWorkTime.startTime,
                endTime: this._initialWorkTime.endTime,
                lunchBreak: [0, Validators.min(0)],
            })
        );
    }

    removeWorkTimeLine(index: number): void {
        if (index === 0) {
            return;
        }
        this.workHoursArray.removeAt(index);
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
        const newWorkItem = {
            ...this._initialWorkTime,
            lunchBreak: 0,
        };
        this.form.reset(this._toFormData(newWorkItem));
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
        this.form.reset(this._toFormData(this._initialWorkTime));
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
            lunchBreak: [workTime.lunchBreak, Validators.min(0)],
        });
    }

    private _buildForm2(builder: FormBuilder, workTime: WorkTime): FormGroup {
        return builder.group({
            workHours: builder.array([
                builder.group({
                    startTime: workTime.startTime,
                    endTime: workTime.endTime,
                    lunchBreak: [workTime.lunchBreak, Validators.min(0)],
                }),
            ]),
        });
    }
}

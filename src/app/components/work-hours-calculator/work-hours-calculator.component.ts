import { Component } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

// import moment from 'moment';
import { defer, Observable, combineLatest } from "rxjs";
import { distinctUntilChanged, map, startWith } from "rxjs/operators";

export const superChanges = <T>(control: AbstractControl): Observable<T> =>
    defer(() =>
        control.valueChanges.pipe(
            startWith(control.value),
            distinctUntilChanged()
        )
    );

@Component({
    selector: "app-work-hours-calculator",
    templateUrl: "./work-hours-calculator.component.html",
    styleUrls: ["./work-hours-calculator.component.scss"],
})
export class WorkHoursCalculatorComponent {
    fromControl = new FormControl();
    toControl = new FormControl();
    breakControl = new FormControl(30);

    value$: Observable<number>;

    timeDurations: number[] = [];

    constructor() {
        const from$ = superChanges<string | null>(this.fromControl);
        const to$ = superChanges<string | null>(this.toControl);
        const break$ = superChanges<number | null>(this.breakControl);

        this.value$ = combineLatest([from$, to$, break$]).pipe(
            map(([from, to, breakValue]) => {
                const fromDate = new Date(`${"2000-01-01"}T${from}`);
                const toDate = new Date(`${"2000-01-01"}T${to}`);

                const diffAsSeconds =
                    Math.abs(fromDate.valueOf() - toDate.valueOf()) / 1000;

                const breakInSeconds = breakValue * 60;

                // const toMoment = moment(`${'2000-01-01'}T${to}`).subtract(
                //   breakValue,
                //   'minutes'
                // );

                // let diff = toMoment.diff(fromMoment);
                // let diffAsHoursAndMinutes = moment.utc(diff).format('HH:mm');

                // return diffAsHoursAndMinutes === 'Invalid date'
                //   ? null
                //   : diffAsHoursAndMinutes;

                return diffAsSeconds - breakInSeconds;
            })
        );
    }

    get summation(): any {
        if (
            this.timeDurations === null ||
            this.timeDurations === undefined ||
            this.timeDurations.length === 0
        )
            return;

        const totalSeconds = this.timeDurations.reduce((a, b) => a + b);
        return this.secondsToHHMMSS(totalSeconds);
    }

    addTimeDuration(seconds: number): void {
        this.timeDurations.push(seconds);
        this.breakControl.setValue(0);
        this.fromControl.setValue(null);
        this.toControl.setValue(null);
    }

    hhmmssToSeconds(str: string) {
        var arr = str.split(":").map(Number);
        return arr[0] * 3600 + arr[1] * 60;
    }

    secondsToHHMMSS(seconds: number) {
        var a = (seconds / 3600).toString();
        var b = ((seconds / 60) % 60).toString();
        var hours = parseInt(a, 10);
        var minutes = parseInt(b, 10);

        return [hours, minutes]
            .map(function (i) {
                return i.toString().length === 2 ? i : "0" + i;
            })
            .join(":");
    }

    onReset(): void {
        this.breakControl.setValue(30);
        this.fromControl.setValue(null);
        this.toControl.setValue(null);
        this.timeDurations = [];
    }
}

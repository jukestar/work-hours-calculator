import { AbstractControl, ValidationErrors } from "@angular/forms";

export function validateTimeRange(
    control: AbstractControl
): ValidationErrors | null {
    const start = control.get("startTime").value;
    const end = control.get("endTime").value;

    return start >= end ? { timeRange: true } : null;
}

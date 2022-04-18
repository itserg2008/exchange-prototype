import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, of, delay, map, catchError } from "rxjs";

function valueExceedAsync(num: string, maxNumber: number): Observable<boolean> {
    return of(num).pipe(
      delay(500),
      map((num) => {        
        return parseFloat(num) > maxNumber;
      })
    );
  }

export function maxValidatorAsync(maxNumber: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return valueExceedAsync(control.value, maxNumber).pipe(
          map((exists) => (exists ? { maxValueExceeded: true } : null))          
        );
      };
  }
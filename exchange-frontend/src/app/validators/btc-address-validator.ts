import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { validate, Network } from 'bitcoin-address-validation';
import { Observable, of, delay, map } from 'rxjs';


function validateAddressAsync(address: string): Observable<boolean> {
    return of(address).pipe(
      delay(500),
      map((address) => {        
        const result = validate(address, Network.testnet);
        console.log(result);
        return result;
      })
    );
  }

export function btcAddressValidatorAsync(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return validateAddressAsync(control.value).pipe(
          map((valid) => (valid ? null : { wrongAddress: true }))          
        );
      };
  }
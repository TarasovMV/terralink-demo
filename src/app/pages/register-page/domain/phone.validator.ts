import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {CountryCode, isValidPhoneNumber} from 'libphonenumber-js/max';

export function phoneValidator(countryCode: CountryCode): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const valid = isValidPhoneNumber(control.value, countryCode);

        return valid ? null : {message: 'error'};
    };
}

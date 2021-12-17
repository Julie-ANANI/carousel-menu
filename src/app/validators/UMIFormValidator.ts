import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UMIFormValidator {
  static validFormString(control: AbstractControl) : ValidationErrors | null {
    if((control.value||'' as string).trim().length === 0){
      return {validFormString: true}
    }

    return null;
  }
}

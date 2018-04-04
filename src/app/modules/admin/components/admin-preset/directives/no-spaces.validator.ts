import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const forbidden = /\s/g.test(control.value);
    return forbidden ? {'forbiddenChain': {value: control.value}} : null;
  };
}

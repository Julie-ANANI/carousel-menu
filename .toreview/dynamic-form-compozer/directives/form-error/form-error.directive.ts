import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appErrorsForm]'
})
export class FormErrorDirective implements AfterViewInit {
  private _field: AbstractControl;
  @Input() public appErrorsForm: FormGroup;
  @Input() public errorsMessages: any;

  constructor(private _el: ElementRef) {}

  ngAfterViewInit() {
    this._field = this.appErrorsForm.get(this._el.nativeElement.getAttribute('for').toString());
    this._field.valueChanges.subscribe(_ => {
      if (this._field && this._field.errors) {
        let errorMessage = '';
        switch (Object.keys(this._field.errors)[0]) { // On regarde le type de la première erreur et on affiche le message correspondant
          case 'required':
            errorMessage = (this.errorsMessages && this.errorsMessages.required)
              ? this.errorsMessages.required
              : `${this._el.nativeElement.textContent} is required`; // TODO translate
            break;
          case 'email':
            errorMessage = this.errorsMessages && this.errorsMessages.email
              ? this.errorsMessages.email
              : `${this._el.nativeElement.textContent} should be a valid email address`; // TODO translate
            break;
          case 'minlength': {
            errorMessage = this.errorsMessages && this.errorsMessages.minlength
              ? this.errorsMessages.minlength
              : `${this._el.nativeElement.textContent} should contains at least ${this._field.errors.minlength.requiredLength} characters`; // TODO translate
            break;
          }
          case 'maxlength':
            errorMessage = this.errorsMessages && this.errorsMessages.maxlength
              ? this.errorsMessages.maxlength
              : `${this._el.nativeElement.textContent} should contains less than ${this._field.errors.maxlength.requiredLength} characters`; // TODO translate
            break;
        }
        this._el.nativeElement.setAttribute('data-error', errorMessage);
      }
    });
  }
}

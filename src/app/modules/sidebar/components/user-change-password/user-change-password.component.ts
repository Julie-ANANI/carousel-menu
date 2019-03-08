import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss']
})

export class UserChangePasswordComponent {

 @Input() set sidebarState(value: string) {
   if (value === undefined || value === 'active') {
     this.buildForm();
     this._formData.reset();
   }
 }

  @Output() passwordUpdate = new EventEmitter<FormGroup>();

  private _formData: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  private buildForm() {
    this._formData = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(9)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.passwordUpdate.emit(this._formData);
  }

  get formData(): FormGroup {
    return this._formData;
  }

  set formData(value: FormGroup) {
    this._formData = value;
  }

}

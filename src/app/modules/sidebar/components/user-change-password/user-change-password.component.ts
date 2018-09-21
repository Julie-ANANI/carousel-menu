import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss']
})

export class UserChangePasswordComponent implements OnInit {

  @Input() sidebarState: Subject<string>;

  @Output() changePasswordData = new EventEmitter<FormGroup>();

  private _formData: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();

    if (this.sidebarState) {
      this.sidebarState.subscribe((state) => {
        if (state === 'inactive') {
          setTimeout (() => {
            this._formData.reset();
          }, 500);
        }
      })
    }

  }

  private buildForm() {
    this._formData = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(9), Validators.pattern(/[\w]*[\&\@\$\.\#\+\=\/]+[\w]*/g)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.changePasswordData.emit(this._formData);
  }

  get formData(): FormGroup {
    return this._formData;
  }

  set formData(value: FormGroup) {
    this._formData = value;
  }

}

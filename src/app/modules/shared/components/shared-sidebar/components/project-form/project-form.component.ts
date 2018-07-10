import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})

export class ProjectFormComponent implements OnInit, OnChanges {

  /*
     For type 'editUser', put the data into the attribute user and patch it to the formData
  */
  @Input() set emailToBlacklist(value: any) {
    this._emailToBlacklist = value;
    this.loadBlacklist();
  };

  @Input() sidebarState: string;
  @Input() set type(type: string) {

  }

  @Output() editBlacklist = new EventEmitter<any>();

  isBlacklist = false;
  projectForm: FormGroup;
  private _emailToBlacklist: any = null;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.projectForm = this.formBuilder.group( {
      email: ['', [Validators.required, Validators.email]],
      expiration: ''
    });
  }

  loadBlacklist() {
    this.isBlacklist = true;
    if (this._emailToBlacklist && this.projectForm) {
      this._emailToBlacklist.expiration === ''
        ? this._emailToBlacklist.expiration = ''
        : this._emailToBlacklist.expiration = new Date(this._emailToBlacklist.expiration);
      this.projectForm.patchValue(this._emailToBlacklist);
    }
  }

  onSubmit() {
    if (this.isBlacklist) {
      const blacklist = this.projectForm.value;
      blacklist.expiration === '' ? blacklist.expiration = 0 : blacklist.expiration = blacklist.expiration
      blacklist._id = this._emailToBlacklist._id;
      this.editBlacklist.emit(blacklist);
    }
  }

  resetExpirationDate(check: boolean) {
    if (check === true) {
      this.projectForm.value.expiration = '';
    } else {
      this.projectForm.value.expiration = new Date();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*if (changes.sidebarState.currentValue !== changes.sidebarState.previousValue) {
        this.projectForm.reset();
    }*/
  }

  get emailToBlacklist(): any {
    return this._emailToBlacklist;
  }

}

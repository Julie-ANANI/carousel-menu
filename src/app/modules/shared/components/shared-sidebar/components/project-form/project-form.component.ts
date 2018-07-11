import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})

export class ProjectFormComponent implements OnInit, OnChanges {

  @Input() set editBlacklistEmail(value: any) {
    this.emailToEdit = value;
    this.loadBlacklist();
  };

  @Input() sidebarState: string;

  @Input() set type(type: string) {
    if (type === 'addEmail') {
      this.isBlacklist = false;
      this.isAddEmail = true;
    } else if (type === 'editBlacklist') {
      this.isBlacklist = true;
      this.isAddEmail = false;
    }
  }

  @Output() editBlacklist = new EventEmitter<any>();
  @Output() addBlacklists = new EventEmitter<Array<string>>();

  isBlacklist = false;
  isAddEmail = false;

  formData: FormGroup;

  emailToEdit: any = null;

  constructor (private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formData = this.formBuilder.group( {
      email: ['', [Validators.required, Validators.email]],
      expiration: ''
    });
  }

  loadBlacklist() {
    if (this.emailToEdit && this.formData) {
      this.emailToEdit.expiration === ''
        ? this.emailToEdit.expiration = ''
        : this.emailToEdit.expiration = new Date(this.emailToEdit.expiration);
      this.formData.patchValue(this.emailToEdit);
    }
  }

  onSubmit() {
    if (this.isBlacklist) {
      const blacklist = this.formData.value;
      blacklist.expiration === '' ? blacklist.expiration = 0 : blacklist.expiration = blacklist.expiration
      blacklist._id = this.emailToEdit._id;
      this.editBlacklist.emit(blacklist);
    } else if (this.isAddEmail) {
      this.addBlacklists.emit(this.formData.value.email);
    }
  }

  resetExpirationDate(check: boolean) {
    if (check === true) {
      this.formData.value.expiration = '';
    } else {
      this.formData.value.expiration = new Date();
    }
  }

  addEmail(event: {value: Array<any>}) {
    this.formData.get('email')!.setValue(event.value)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isAddEmail) {
      if (changes.sidebarState.currentValue !== changes.sidebarState.previousValue) {
        this.formData.reset();
      }
    }

  }


}

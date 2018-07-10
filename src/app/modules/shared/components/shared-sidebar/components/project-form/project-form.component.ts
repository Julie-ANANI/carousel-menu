import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})

export class ProjectFormComponent implements OnInit, OnChanges {

  @Input() set emailToBlacklist(value: any) {
    this._emailToBlacklist = value;
    this.loadBlacklist();
  };

  @Input() sidebarState: string;
  @Input() set type(type: string) {
    if (type === 'addEmail') {
      this.isBlacklist = false;
      this.isAddEmail = true;
    }
  }

  @Output() editBlacklist = new EventEmitter<any>();
  @Output() addBlacklists = new EventEmitter<Array<string>>();

  isBlacklist = false;
  editBlacklistForm: FormGroup = null;

  isAddEmail = false;
  addBlacklistForm: FormGroup = null;

  private _emailToBlacklist: any = null;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.editBlacklistForm = this.formBuilder.group( {
      email: ['', [Validators.required, Validators.email]],
      expiration: ''
    });

    this.addBlacklistForm = this.formBuilder.group( {
      emails: ['', [Validators.required, Validators.email]]
    });
  }

  loadBlacklist() {
    this.isBlacklist = true;
    if (this._emailToBlacklist && this.editBlacklistForm) {
      this._emailToBlacklist.expiration === ''
        ? this._emailToBlacklist.expiration = ''
        : this._emailToBlacklist.expiration = new Date(this._emailToBlacklist.expiration);
      this.editBlacklistForm.patchValue(this._emailToBlacklist);
    }
  }

  onSubmit() {
    if (this.isBlacklist) {
      const blacklist = this.editBlacklistForm.value;
      blacklist.expiration === '' ? blacklist.expiration = 0 : blacklist.expiration = blacklist.expiration
      blacklist._id = this._emailToBlacklist._id;
      this.editBlacklist.emit(blacklist);
      this.isBlacklist = false;
    }

    if (this.isAddEmail) {
      this.addBlacklists.emit(this.addBlacklistForm.value.emails);
      this.isAddEmail = false;
    }
  }

  resetExpirationDate(check: boolean) {
    if (check === true) {
      this.editBlacklistForm.value.expiration = '';
    } else {
      this.editBlacklistForm.value.expiration = new Date();
    }
  }

  addEmail(event: {value: Array<string>}) {
    this.addBlacklistForm.get('email')!.setValue(event.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sidebarState.currentValue !== changes.sidebarState.previousValue) {
        this.editBlacklistForm.reset();
        this.addBlacklistForm.reset();
    }
  }

  get emailToBlacklist(): any {
    return this._emailToBlacklist;
  }

}

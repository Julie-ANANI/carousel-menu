import { Component, EventEmitter, Input, Output } from '@angular/core';
import 'rxjs/add/operator/filter';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-batch-form',
  templateUrl: './batch-form.component.html',
  styleUrls: ['./batch-form.component.scss']
})

export class BatchFormComponent {

  @Input() set sidebarState(value: string) {
    if (value === undefined || 'active') {
      this.buildForm();
      this.activeSaveButton = false;
      this.errorPros = false;
    }
  }

  @Input() set type(value: string) {
    this.actionType = value;
    this.loadTypes();
  }

  @Output() batchOutput = new EventEmitter <any>();

  // @Input() set rowBatch(value: any) {
  //   this.load(value);
  // }
  //
  // @Input() set content(content: {}) {
  //   this._content = content;
  // }
  //
  // public formData: FormGroup;
  // private _row: any;
  // private _formHidden = false;
  //
  // @Output() batchChange = new EventEmitter <any>();
  //
  // private _content = {};
  // private _dateMail: Date;
  // private _timeMail = '';

  actionType = '';

  formData: FormGroup;

  activeSaveButton = false;

  isNewBatch = false;

  errorPros = false;

  constructor(private formBuilder: FormBuilder) { }

  /*ngOnInit(): void {
    this.formData = this._formBuilder.group({
      dateMail: ['', [Validators.required]],
      timeMail: ['', [Validators.required]],
    });
  }*/


  private buildForm() {
    this.formData = this.formBuilder.group( {
      date: [''],
      time: [''],
      pros: [''],
      send: [''],
    });
  }


  private reinitialiseVariables() {
    this.isNewBatch = false;
    this.activeSaveButton = false;
  }


  private loadTypes() {
    this.reinitialiseVariables();

    switch (this.actionType) {

      case 'newBatch':
        this.isNewBatch = true;
        break;

      default:
      // do nothing...

    }

  }

  onSave() {

    switch (this.actionType) {

      case 'newBatch':
        this.sendNewBatch();
        break;

      default:
      // do nothing...

    }

    this.activeSaveButton = false;

  }


  private sendNewBatch() {
    const pros = this.formData.get('pros').value;
    const send = this.formData.get('date').value || this.formData.get('time').value ? 'false' : 'true';

    this.formData.get('send').setValue(send);

    if (pros <= 0) {
      this.errorPros = true;
      this.activeSaveButton = false;
    } else {
      this.batchOutput.emit(this.formData);
    }

  }


  onKeyboardPress(event: Event) {
    event.preventDefault();
    this.errorPros = false;
    this.activeSaveButton = true;
  }



  onSubmit() {
    /*if (this.formData.valid) {
      this.formData.value.dateMail = new Date(this.formData.value.dateMail);
      this._dateMail = this.formData.value.dateMail;
      this._timeMail = this.formData.value.timeMail;
      this.batchChange.emit({date: this._dateMail, time: this._timeMail});
    }*/
  }

  /*load(row: any) {
    this._row = row;
    if (row.Date) {
      this._dateMail = new Date(row.Date);
      this._timeMail = row.Time;
      this.formData.patchValue({dateMail: this._dateMail, timeMail: this._timeMail});
    }
    this.thanks();
  }*/

  /*public thanks() {
    if (this._row.Step === '04 - Thanks') {
      this._formHidden = true;
    } else {
      this._formHidden = false;
    }
  }*/


  // get getdateMail() { return this._dateMail; }
  // get formHidden() { return this._formHidden; }
  // get gettimeMail() {return this._timeMail; }
  // get content() { return this._content; }
  // get row() { return this._row; }

}

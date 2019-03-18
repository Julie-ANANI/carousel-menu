import { Component, EventEmitter, Input, Output } from '@angular/core';
import 'rxjs/add/operator/filter';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-batch-form',
  templateUrl: './batch-form.component.html',
  styleUrls: ['./batch-form.component.scss']
})

export class BatchFormComponent {

  @Input() set currentRow(value: any) {
    this._rowCurrent = value;
  }

  @Input() set content(value: any) {
    this._contentCurrent = value;
  }

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this.buildForm();
      this._errorPros = false;
      this._formData.reset();
      this.patchData();
    }
  }


  @Input() set type(value: string) {
    this._actionType = value;
    this.loadTemplate();
  }

  @Output() batchOutput = new EventEmitter <any>();

  private _actionType = '';

  private _formData: FormGroup;

  private _isNewBatch = false;

  private _isEditBatch = false;

  private _errorPros = false;

  private _rowCurrent: any = {};

  private _contentCurrent: any = {};

  private _mailDate: Date;

  private _mailTime: '';

  private _hideInput = false;

  constructor(private formBuilder: FormBuilder) { }

  private buildForm() {
    this._formData = this.formBuilder.group( {
      date: [''],
      time: [''],
      pros: [''],
      send: [''],
    });
  }


  private reinitialiseVariables() {
    this._isNewBatch = false;
    this._isEditBatch = false;
  }


  private loadTemplate() {
    this.reinitialiseVariables();

    switch (this._actionType) {

      case 'newBatch':
        this._isNewBatch = true;
        break;

      case 'editBatch':
        this._isEditBatch = true;
        break;

      default:
      // do nothing...

    }

  }


  private patchData() {

    if (this._rowCurrent.Date) {
      this._mailDate = new Date(this._rowCurrent.Date);
      this._mailTime = this._rowCurrent.Time;
      this._formData.get('date').setValue(this._mailDate);
      this._formData.get('time').setValue(this._mailTime);
    }

    if (this._rowCurrent.Step === '04 - Thanks') {
      this._hideInput = true;
    } else {
      this._hideInput = false;
    }

  }



  onSave() {

    switch (this._actionType) {

      case 'newBatch':
        this.sendNewBatch();
        break;

      case 'editBatch':
        this.updateBatch();
        break;

      default:
      // do nothing...

    }

  }


  private sendNewBatch() {
    const pros = this._formData.get('pros').value;
    const send = this._formData.get('date').value || this._formData.get('time').value ? 'false' : 'true';

    this._formData.get('send').setValue(send);

    if (pros <= 0) {
      this._errorPros = true;
    } else {
      this.batchOutput.emit(this._formData);
    }

  }


  private updateBatch() {
    this.batchOutput.emit(this._formData);
  }


  onKeyboardPress(event: Event) {
    event.preventDefault();
    this._errorPros = false;
  }

  get actionType(): string {
    return this._actionType;
  }

  get isNewBatch(): boolean {
    return this._isNewBatch;
  }

  get isEditBatch(): boolean {
    return this._isEditBatch;
  }

  get errorPros(): boolean {
    return this._errorPros;
  }

  get rowCurrent(): any {
    return this._rowCurrent;
  }

  get contentCurrent(): any {
    return this._contentCurrent;
  }

  get mailDate(): Date {
    return this._mailDate;
  }

  get mailTime(): "" {
    return this._mailTime;
  }

  get hideInput(): boolean {
    return this._hideInput;
  }

  get formData(): FormGroup {
    return this._formData;
  }

}

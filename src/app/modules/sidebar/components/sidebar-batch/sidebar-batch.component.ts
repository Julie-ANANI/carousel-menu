import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import 'rxjs/add/operator/filter';
import { FormGroup, Validators, FormBuilder  } from '@angular/forms';


@Component({
  selector: 'app-sidebar-batch',
  templateUrl: './sidebar-batch.component.html',
  styleUrls: ['./sidebar-batch.component.scss']
})
export class SidebarBatchComponent implements OnInit {

  public formData: FormGroup;
  private _row: any;
  private _formHidden = false;

  @Input() set rowBatch(value: any) {
    this.load(value);
  }

  @Input() set content(content: {}) {
    this._content = content;
  }

  @Output() batchChange = new EventEmitter <any>();

  private _content = {};
  private _dateMail: Date;
  private _timeMail = '';

  constructor(// private _notificationsService: TranslateNotificationsService,
              private _formBuilder: FormBuilder
              ) {}

  ngOnInit(): void {
    this.formData = this._formBuilder.group({
      dateMail: ['', [Validators.required]],
      timeMail: ['', [Validators.required]],
    });
  }

  public onSubmit() {
    if (this.formData.valid) {
      this.formData.value.dateMail = new Date(this.formData.value.dateMail);
      this._dateMail = this.formData.value.dateMail;
      this._timeMail = this.formData.value.timeMail;
      this.batchChange.emit({date: this._dateMail, time: this._timeMail});
    }
  }

  load(row: any) {
    this._row = row;
    if (row.Date) {
      this._dateMail = new Date(row.Date);
      this._timeMail = row.Time;
      this.formData.patchValue({dateMail: this._dateMail, timeMail: this._timeMail});
    }
    this.thanks();
  }

  public thanks() {
    if (this._row.Step === '04 - Thanks') {
      this._formHidden = true;
    } else {
      this._formHidden = false;
    }
  }


  get getdateMail() { return this._dateMail; }
  get formHidden() { return this._formHidden; }
  get gettimeMail() {return this._timeMail; }
  get content() { return this._content; }
  get row() { return this._row; }

}

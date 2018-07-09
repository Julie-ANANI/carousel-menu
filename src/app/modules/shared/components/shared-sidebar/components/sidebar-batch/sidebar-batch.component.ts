import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
// import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import 'rxjs/add/operator/filter';
import { FormGroup, Validators, FormBuilder  } from '@angular/forms';


@Component({
  selector: 'app-sidebar-batch',
  templateUrl: './sidebar-batch.component.html',
  styleUrls: ['./sidebar-batch.component.scss']
})
export class SidebarBatchComponent implements OnInit {

  public formData: FormGroup;

  @Input() set rowBatch(value: any) {
    this.load(value);
  }

  @Input() set content(content: {}) {
    this._content = content;
    if (content) {
      this._text = true;
    }
  }

  @Output() batchChange = new EventEmitter <any>();

  private _content = {};
  private _dateMail: Date;
  private _timeMail = '';
  private _text = false;

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
      this._dateMail = this.formData.value.dateMail;
      this._timeMail = this.formData.value.timeMail;
      this.batchChange.emit({date: this._dateMail, time: this._timeMail});
      this._text = false;
    }
  }

  load(row: any) {
    if (row.Date) {
      this._dateMail = new Date(row.Date);
      this._timeMail = row.time;
      this.formData.patchValue({dateMail: this._dateMail, timeMail: this._timeMail});
    }
  }

  get dateMail() {
      return this._dateMail;
  }
  get timeMail() { return this._timeMail; }
  get content() { return this._content; }
}

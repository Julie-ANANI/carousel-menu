import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, Output } from '@angular/core';
import 'rxjs/add/operator/filter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { ErrorFrontService } from '../../../../services/error/error-front.service';

type Template = 'NEW_BATCH' | 'EDIT_BATCH' | '';

@Component({
  selector: 'app-sidebar-batch',
  templateUrl: './sidebar-batch.component.html',
  styleUrls: ['./sidebar-batch.component.scss']
})

export class SidebarBatchComponent implements OnChanges {

  @Input() isEditable = false;

  @Input() currentRow: any = <any>{};

  @Input() content: any = <any>{};

  @Input() workflow = '';

  @Input() campaignWorkflows: Array<string> = [];

  @Input() sidebarState = 'inactive';

  @Input() templateType: Template = '';

  @Output() batchOutput: EventEmitter<any> = new EventEmitter<any>();

  private _formData: FormGroup = this._formBuilder.group({
    date: [''], time: [''], pros: [''], send: [''], workflow: ['']
  });

  private _errorPros = false;

  private _mailDate = '';

  private _mailTime = '';

  private _hideInput = false;

  constructor(@Inject(LOCALE_ID) private _locale: string,
              private _formBuilder: FormBuilder,
              private _translateNotificationsService: TranslateNotificationsService,
              private _campaignService: CampaignService) {
  }

  ngOnChanges(): void {
    if (this.sidebarState === 'active') {
      this._errorPros = false;
      this._patchData();
    } else if (this.sidebarState === 'inactive') {
      this._formData.reset();
    }
  }

  private _patchData() {
    if (this.currentRow.Date) {
      this._mailDate = new DatePipe(this._locale).transform(new Date(this.currentRow.Date), 'yyyy-MM-dd');
      this._mailTime = this.currentRow.Time;
      this._formData.get('date').setValue(this._mailDate);
      this._formData.get('time').setValue(this._mailTime);
    }

    this._hideInput = this.currentRow.Step === '04 - Thanks';
    this._formData.get('workflow').setValue(this.workflow);
  }

  public onSubmit() {
    if (this.isEditable) {
      switch (this.templateType) {

        case 'NEW_BATCH':
          this._sendNewBatch();
          break;

        case 'EDIT_BATCH':
          this._updateBatch();
          break;

      }
    }
  }

  private _sendNewBatch() {
    const _pros = this._formData.get('pros').value;
    const _send = this._formData.get('date').value || this._formData.get('time').value ? 'false' : 'true';
    this._formData.get('send').setValue(_send);

    if (_pros <= 0) {
      this._errorPros = true;
    } else {
      this._updateBatch();
    }

  }

  private _updateBatch() {
    this.batchOutput.emit(this._formData);
  }

  public updateBatchStatus(event: Event) {
    const _status = (event.target as HTMLInputElement).valueAsNumber;
    this._campaignService.updateBatchStatus(this.content._id, _status).subscribe(() => {
      this._translateNotificationsService.success('Success', 'The batch status has been modified.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public onKeyboardPress(event: Event) {
    event.preventDefault();
    this._errorPros = false;
  }

  get errorPros(): boolean {
    return this._errorPros;
  }

  get mailDate(): string {
    return this._mailDate;
  }

  get mailTime(): string {
    return this._mailTime;
  }

  get hideInput(): boolean {
    return this._hideInput;
  }

  get formData(): FormGroup {
    return this._formData;
  }

}

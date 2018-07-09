import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
// import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import 'rxjs/add/operator/filter';
 import { FormGroup, Validators, FormBuilder  } from '@angular/forms';
import {Batch} from '../../../../../../models/batch';

@Component({
  selector: 'app-sidebar-batch',
  templateUrl: './sidebar-batch.component.html',
  styleUrls: ['./sidebar-batch.component.scss']
})
export class SidebarBatchComponent implements OnInit {

  public formData: FormGroup;

  @Input() set rowBatch(value: any) {
    this.loadBatch(value);
  }

  @Input() set content(content: {}) {
    this._content = content;
  }

  @Output() batchChange = new EventEmitter <any>();

  private _batchId = '';
  private _content = {};
  private _firstMail = new Date();
  private _secondMail = new Date();
  private _thirdMail = new Date();

  // TODO : profile picture, location

  constructor(// private _notificationsService: TranslateNotificationsService,
              private _formBuilder: FormBuilder
              ) {}

  ngOnInit(): void {


    this.formData = this._formBuilder.group({
      firstMail: ['', [Validators.required]],
      secondMail: ['', [Validators.required]],
      thirdMail: ['', [Validators.required]],
      firstTime: ['', [Validators.required]],
      secondTime: ['', [Validators.required]],
      thirdTime: ['', [Validators.required]]
    });
  }

  public onSubmit() {
    console.log(this.formData);
    if (this.formData.valid) {

    }
      /*
      this._userService.updateOther(user)
        .first()
        .subscribe(
          data => {
            this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ACCOUNT.UPDATE_TEXT');
            this.formData.patchValue(data);
            this.userChange.emit();
          },
          error => {
            this._notificationsService.error('ERROR.ERROR', error.message);
          });
    }
    else {
      this._notificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
    */
  }

  loadBatch(b: Batch) {
    console.log(b);
    this._batchId = b._id;
    this._firstMail = b.firstMail;
    this._secondMail = b.secondMail;
    this._thirdMail = b.thirdMail;
  }


  get firstMail(): any { return this._firstMail; }
  get secondMail(): any { return this._secondMail; }
  get thirdMail(): any { return this._thirdMail; }

  set firstMail(d: any) { this._firstMail = d; }
  set secondMail(d: any) { this._secondMail = d; }
  set thirdMail(d: any ) { this._thirdMail = d; }
}

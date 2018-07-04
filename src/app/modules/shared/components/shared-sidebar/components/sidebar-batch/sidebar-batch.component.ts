import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
// import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import 'rxjs/add/operator/filter';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sidebar-batch',
  templateUrl: './sidebar-batch.component.html',
  styleUrls: ['./sidebar-batch.component.scss']
})
export class SidebarBatchComponent implements OnInit {

  public formData: FormGroup;

  @Input() set batchId(value: string) {
    this.loadBatch(value);
  }

  @Output() batchChange = new EventEmitter <any>();

  private _batchId = '';

  // TODO : profile picture, location

  constructor(// private _notificationsService: TranslateNotificationsService,
              private _formBuilder: FormBuilder) {}

  ngOnInit(): void {

    this._batchId = '';

    this.formData = this._formBuilder.group({
      isOperator: false,
      firstName: '',
      lastName: '',
      email: ['', [Validators.email]],
      companyName: '',
      jobTitle: '',
      language: ''
    });
  }

  public onSubmit() {
    /*if (this.formData.valid) {
      const user = new User(this.formData.value);
      user.id = this._userId;
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
    }*/
  }

  loadBatch(id: string) {
    this._batchId = id;
    // this._userService.get(this._userId).subscribe(user => {
    //  this.formData.patchValue(user);
    // });
  }

}

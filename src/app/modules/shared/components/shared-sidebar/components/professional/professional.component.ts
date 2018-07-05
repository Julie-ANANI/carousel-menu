import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { ProfessionalsService } from '../../../../../../services/professionals/professionals.service';
import { Professional } from '../../../../../../models/professional';
// import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import 'rxjs/add/operator/filter';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-professional-sidebar',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.scss']
})
export class ProfessionalComponent implements OnInit, OnChanges {

  public formData: FormGroup;

  @Input() set proId(value: string) {
    this.loadPro(value);
  }
  @Input() sidebarState: string;

  @Output() proChange = new EventEmitter <any>();
  @Output() deletePro = new EventEmitter<Professional>();

  private _proId = '';

  // TODO : profile picture, location

  constructor(private _professionalService: ProfessionalsService,
              // private _notificationsService: TranslateNotificationsService,
              private _formBuilder: FormBuilder) {}

  ngOnInit(): void {

    this._proId = '';

    this.formData = this._formBuilder.group({
      firstName: '',
      lastName: '',
      email: ['', [Validators.email]],
      companyName: '',
      jobTitle: '',
      language: '',
      profileUrl: ''
    });
  }

  public onSubmit() {
    /*if (this.formData.valid) {
      this._professionalService.
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

  loadPro(id: string) {
    this._proId = id;
    if (this._proId) {
      this._professionalService.get(this._proId).subscribe((pro: Professional) => {
        this.formData.patchValue(pro);
      });
    }
  }

  removePro() {
    const pro: Professional = this.formData.value;
    this.deletePro.emit(pro);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sidebarState) {
      if (changes.sidebarState.currentValue !== changes.sidebarState.previousValue) {
        this.loadPro(this._proId);
      }
    }
  }

}

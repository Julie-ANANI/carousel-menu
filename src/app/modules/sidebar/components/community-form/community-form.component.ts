import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Router } from '@angular/router';
import { Professional } from '../../../../models/professional';

@Component({
  selector: 'community-form',
  templateUrl: './community-form.component.html',
  styleUrls: ['./community-form.component.scss']
})

export class CommunityFormComponent implements OnInit {

  @Input() set context(value: any) {
    this._context = value;
  }

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this._buildForm();
      this._lookingProfessional = false;
      this._addingProfessional = false;
    }
  }

  @Input() set innovationId(value: string) {
    this._innovationId = value;
  }

  @Input() set type(value: string) {
    this._actionType = value;
  }

  @Input() set config(value: any) {
    this._config = value;
  }

  @Output('callbackNotification') _callbackNotification = new EventEmitter<any>();

  private _actionType: string;

  private _config: any;

  private _context: any = null;

  private _parentCb: any = null;

  private _innovationId: string;

  private _form: FormGroup;

  private _lookingProfessional: boolean;

  private _addingProfessional: boolean;

  private _professional: Professional;

  constructor(private _formBuilder: FormBuilder,
              private _professionalService: ProfessionalsService,
              private _router: Router,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    console.log(this._parentCb && typeof this._parentCb === 'function');
  }


  private _buildForm() {
    this._form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
  }


  public onValueTyped(event: any) {
    this._config = {
      fields: 'firstName lastName tags.label country answers.innovation answers.status ambassador.industry campaigns._id campaigns.innovation campaigns.type innovations._id',
      limit: '10',
      offset: '0',
      search: '',
      "$text": `{ "$search": "${event}" }`,
      sort: '{"created":-1}'
    };
  }


  public callbackNotification(event: Event) {
    this._callbackNotification.emit(event);
  }


  public onEmailChange() {
    this._professional = null;
    const email = this._form.get('email').value;
    const config: any = {
      fields: 'firstName lastName ambassador',
      limit: '1',
      offset: '0',
      search: '{}',
      email: email,
      sort: '{ "created": -1 }'
    };

    if (email && this._form.get('email').valid) {

      this._lookingProfessional = true;

      this._professionalService.getAll(config).subscribe((response) => {
        if (response && response.result && response.result.length > 0) {
          this._professional = response.result[0];
          this._form.patchValue(response.result[0]);
        }
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
      }, () => {
        this._lookingProfessional = false;
      });

    }

  }


  public addAmbassador() {
    if (this._form.valid) {
      this._addingProfessional = true;

      if (this._professional) {
        this._professional.ambassador.is = true;
        this._professionalService.save(this._professional._id, this._professional).subscribe(() => {
          this.goToAmbassador();
        }, () => {
          this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
        });
      } else {
        this._createAmbassador();
      }

    }
  }


  public goToAmbassador() {
    this._router.navigate([`user/admin/community/members/${this._professional._id}`]);
  }


  private _createAmbassador() {

    const newPro: Professional = {
      firstName: this._form.get('firstName').value,
      lastName: this._form.get('lastName').value,
      email: this._form.get('email').value,
      ambassador: {
        is: true
      }
    };

    this._professionalService.createAmbassadors([newPro]).subscribe((response) => {
      if (response && response.result) {
        this._professional = response.result[0];
        this.goToAmbassador();
      }
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }


  get actionType() {
    return this._actionType;
  }

  get config(): any {
    return this._config;
  }

  get context() {
    return this._context;
  }

  get innovationId(): string {
    return this._innovationId;
  }

  get form(): FormGroup {
    return this._form;
  }

  get lookingProfessional(): boolean {
    return this._lookingProfessional;
  }

  get addingProfessional(): boolean {
    return this._addingProfessional;
  }

  get professional(): Professional {
    return this._professional;
  }

}

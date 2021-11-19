import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Campaign } from '../../../../models/campaign';

type Template = 'EDIT_NAME' | '';

@Component({
  selector: 'app-sidebar-campaign',
  templateUrl: './sidebar-campaign.component.html',
})

export class SidebarCampaignComponent implements OnInit {

  @Input() isEditable = false;

  @Input() campaign: Campaign = <Campaign>{};

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this.buildForm();
      this._campaignForm.reset();
      this.patchValue();
    }
  }

  @Input() set type(value: Template) {
    if (value) {
      this._type = value;
      this.loadTemplate();
    }
  }

  @Output() campaignOutput = new EventEmitter<FormGroup>();

  private _campaignForm: FormGroup;

  private _type: Template = '';

  private _isEditName = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this._campaignForm = this.formBuilder.group( {
      title: [{value: '', disabled: !this.isEditable}],
      rgpd: [{value: false, disabled: !this.isEditable}]
    });
  }

  private reinitialiseVariables() {
    this._isEditName = false;
  }

  private loadTemplate() {
    this.reinitialiseVariables();

    switch (this._type) {

      case 'EDIT_NAME':
        this._isEditName = true;
        break;

      default:
        // do nothing...

    }

  }

  private patchValue() {
    if (this.campaign && this.campaign._id && this._campaignForm) {
      this._campaignForm.get('title').setValue(this.campaign.title);
      this._campaignForm.get('rgpd').setValue(!!this.campaign.rgpd);
    }
  }

  public onSave() {
    if (this.isEditable) {
      switch (this._type) {

        case 'EDIT_NAME':
          this.campaignOutput.emit(this._campaignForm);
          break;

        default:
        // do nothing...

      }
    }
  }

  get isGDPRMode(): boolean {
    return this._campaignForm.get('rgpd').value;
  }

  get campaignForm(): FormGroup {
    return this._campaignForm;
  }

  get isEditName(): boolean {
    return this._isEditName;
  }

}

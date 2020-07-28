import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Campaign } from '../../../../models/campaign';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss']
})

export class CampaignFormComponent implements OnInit {

  @Input() isEditable = false;

  @Input() campaign: Campaign = <Campaign>{};

  @Input() set sidebarState(value: string) {
    if (value === undefined || value === 'active') {
      this.buildForm();
      this._campaignForm.reset();
      this.patchValue();
    }
  }

  @Input() set type(value: string) {
    this._actionType = value;
    this.loadTemplate();
  }

  @Output() campaignOutput = new EventEmitter<FormGroup>();

  private _campaignForm: FormGroup;

  private _actionType = '';

  private _isEditName = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this._campaignForm = this.formBuilder.group( {
      title: [''],
    });
  }

  private reinitialiseVariables() {
    this._isEditName = false;
  }

  private loadTemplate() {
    this.reinitialiseVariables();

    switch (this._actionType) {

      case 'editName':
        this._isEditName = true;
        break;

      default:
        // do nothing...

    }

  }

  private patchValue() {
    if (this.campaign && this.campaign._id && this._campaignForm) {
      this._campaignForm.get('title').setValue(this.campaign.title);
    }
  }

  public onSave() {
    if (this.isEditable) {
      switch (this._actionType) {

        case 'editName':
          this.campaignOutput.emit(this._campaignForm);
          break;

        default:
        // do nothing...

      }
    }
  }

  get campaignForm(): FormGroup {
    return this._campaignForm;
  }

  get isEditName(): boolean {
    return this._isEditName;
  }

}

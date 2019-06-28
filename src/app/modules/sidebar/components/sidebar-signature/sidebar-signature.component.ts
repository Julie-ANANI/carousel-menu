import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lang, Language } from '../../../../models/static-data/language';


@Component({
  selector: 'app-sidebar-signature',
  templateUrl: './sidebar-signature.component.html',
  styleUrls: ['./sidebar-signature.component.scss']
})


export class SidebarSignatureComponent {

  @Input() set sidebarState(value: string) {
    if (value === undefined || value ===  'active') {
      this._buildForm();
      this._patchData();
      this._editionMode = true;
    } else {
      this._form.reset();
    }
  }

  @Input() set signature(value: EmailSignature) {
    this._signature = value;
    this._patchData();
  }

  @Output() signatureChange: EventEmitter<EmailSignature> = new EventEmitter<EmailSignature>();

  private _signature: EmailSignature;

  private _editionMode: boolean;

  private _form: FormGroup;

  private _languages: Array<Language> = lang;

  constructor(private _formBuilder: FormBuilder) { }

  private _buildForm() {
    this._form = this._formBuilder.group({
      name: [''],
      from_name: [''],
      email: ['', [Validators.email]],
      content: [''],
      language: [''],
    });
  }

  private _patchData() {
    if (this._signature) {
      this._form.get('name').setValue(this._signature.name || '');
      this._form.get('from_name').setValue(this._signature.from || '');
      this._form.get('email').setValue(this._signature.email || '');
      this._form.get('content').setValue(this._signature.content || '');
      this._form.get('language').setValue(this._signature.language || '');
    }
  }

  public onClickSave() {
    this._setValues();
    this.signatureChange.emit(this._signature);
  }

  private _setValues() {
    this._signature.name = this._form.get('name').value;
    this._signature.content = this._form.get('content').value;
    this._signature.from = this._form.get('email').value;
    this._signature.language = this._form.get('language').value;
    this._signature.email = this._form.get('email').value;
  }

  get signature(): EmailSignature {
    return this._signature;
  }

  get editionMode(): boolean {
    return this._editionMode;
  }

  get form(): FormGroup {
    return this._form;
  }

  get languages(): Array<Language> {
    return this._languages;
  }

}

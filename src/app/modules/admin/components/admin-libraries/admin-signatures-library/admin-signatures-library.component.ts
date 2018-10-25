import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../../../../services/templates/templates.service';
import { EmailSignature } from '../../../../../models/email-signature';
import { Table } from '../../../../table/models/table';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import {Template} from '../../../../sidebar/interfaces/template';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-signatures-library',
  templateUrl: 'admin-signatures-library.component.html',
  styleUrls: ['admin-signatures-library.component.scss']
})
export class AdminSignaturesLibraryComponent implements OnInit {

  private _signatures: Array<EmailSignature> = [];
  private _signatureToEdit: EmailSignature;
  private _newSignatureName: string = null;
  private _more: Template = {};
  private _total = 0;
  private _tableInfos: Table = null;
  private _config = {
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"id":-1}'
  };

  constructor(private _templatesService: TemplatesService,
              private _notificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this.getSignatures();
  }

  public getSignatures(config?: any) {
    if (config) this._config = config;
    this._templatesService.getAllSignatures(this._config).pipe(first()).subscribe((signatures: any) => {
      this._signatures = signatures.result;
      this._total = signatures._metadata.totalCount;

      this._tableInfos = {
        _selector: 'admin-signatures',
        _title: 'Signatures',
        _content: this._signatures,
        _total: this._total,
        _isHeadable: true,
        _isFiltrable: true,
        _isDeletable: true,
        _isSelectable: true,
        _isEditable: true,
        _columns: [
          {_attrs: ['name'], _name: 'COMMON.NAME', _type: 'TEXT'},
          {_attrs: ['from'], _name: 'COMMON.SORT.BY_AUTHOR', _type: 'TEXT'},
          {_attrs: ['content'], _name: 'Content', _type: 'TEXT'},
          {_attrs: ['language'], _name: 'COMMON.LANGUAGE', _type: 'TEXT'},
          {_attrs: ['email'], _name: 'COMMON.EMAIL', _type: 'TEXT'}]
      };
    });
  }


  public closeSidebar(value: string) {
    this.more.animate_state = value;
  }

  public editSignature(signature: any) {
    this._signatureToEdit = signature;
    this._more = {
      size: '650px',
      animate_state: this._more.animate_state === 'active' ? 'inactive' : 'active',
      title: signature.name
    };
  }

  public updateSignature(signature: EmailSignature) {
    this._templatesService.saveSignature(signature).pipe(first()).subscribe((updatedSignature: any) => {
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }

  removeSignatures(signatures: Array<EmailSignature>) {
    signatures.forEach((signature: EmailSignature) => {
      this.deleteSignature(signature._id);
    });
  }

  public deleteSignature(signatureId: string) {
    this._templatesService.removeSignature(signatureId).pipe(first()).subscribe((_: any) => {
      this.getSignatures();
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    });
  }

  public createSignature() {
    this._templatesService.createSignature({name: this._newSignatureName}).pipe(first()).subscribe((newSignature: any) => {
      this._newSignatureName = null;
      this.editSignature(newSignature);
      this.getSignatures();
    });
  }

  get signatures(): Array<EmailSignature> { return this._signatures; }
  get newSignatureName(): string { return this._newSignatureName; }
  set newSignatureName(name: string) { this._newSignatureName = name; }
  get tableInfos(): any { return this._tableInfos; }
  get signatureToEdit(): any { return this._signatureToEdit; }
  get more(): any { return this._more; }
  get config(): any { return this._config; }
  set config(value: any) { this._config = value; }
  set signatureToEdit(value: any) { this._signatureToEdit = value; }
}

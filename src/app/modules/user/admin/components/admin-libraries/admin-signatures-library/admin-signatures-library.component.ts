import { Component } from '@angular/core';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { EmailSignature } from '../../../../../../models/email-signature';
import { Table } from '../../../../../table/models/table';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';
import { Config } from '../../../../../../models/config';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { Response } from '../../../../../../models/response';

@Component({
  selector: 'app-admin-signatures-library',
  templateUrl: 'admin-signatures-library.component.html',
  styleUrls: ['admin-signatures-library.component.scss']
})

export class AdminSignaturesLibraryComponent {

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "id": -1 }'
  };

  private _fetchingError: boolean;

  private _signatures: Array<EmailSignature> = [];

  private _signatureToEdit: EmailSignature;

  private _newSignatureName: string = null;

  private _sidebarValue: SidebarInterface = {};

  private _total: number;

  private _table: Table;

  private _modalAdd: boolean;

  constructor(private _templatesService: TemplatesService,
              private _translateTitleService: TranslateTitleService,
              private _activatedRoute: ActivatedRoute,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._translateTitleService.setTitle('Signatures | Libraries');

    if (this._activatedRoute.snapshot.data.signatures && Array.isArray(this._activatedRoute.snapshot.data.signatures.result)) {
      this._signatures = this._activatedRoute.snapshot.data.signatures.result;
      this._total = this._activatedRoute.snapshot.data.signatures._metadata.totalCount;
      this._initializeTable();
    } else {
      this._fetchingError = true;
    }

  }

  private _initializeTable() {
    this._table = {
      _selector: 'admin-signatures-limit',
      _title: 'signature(s)',
      _content: this._signatures,
      _total: this._total,
      _isSearchable: true,
      _isDeletable: true,
      _isSelectable: true,
      _isPaginable: true,
      _isEditable: true,
      _isTitle: true,
      _editIndex: 1,
      _columns: [
        {_attrs: ['name'], _name: 'COMMON.LABEL.NAME', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['from'], _name: 'COMMON.SORT.BY_AUTHOR', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['content'], _name: 'Content', _type: 'TEXT'},
        {_attrs: ['language'], _name: 'COMMON.LANGUAGE', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['email'], _name: 'COMMON.LABEL.EMAIL', _type: 'TEXT', _isSearchable: true}
      ]
    };
  }

  private _getSignatures() {
    this._templatesService.getAllSignatures(this._config).pipe(first()).subscribe((response: Response) => {
      this._signatures = response.result;
      this._total = response._metadata.totalCount;
      this._initializeTable();
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }

  onClickAdd() {
    this._modalAdd = true;
  }

  removeSignatures(signatures: Array<EmailSignature>) {
    signatures.forEach((signature: EmailSignature) => {
      this.deleteSignature(signature._id);
    });
  }

  public deleteSignature(signatureId: string) {
    this._templatesService.removeSignature(signatureId).pipe(first()).subscribe((_: any) => {
      //this.getSignatures();
      //this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    });
  }

  public onClickConfirm() {
    this._templatesService.createSignature({ name: this._newSignatureName }).pipe(first()).subscribe((response: EmailSignature) => {
      this._getSignatures();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.SIGNATURES.ADDED');
      this._newSignatureName = null;
      this._modalAdd = false;
      this.editSignature(response);
    }, () => {
      this._modalAdd = false;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public editSignature(signature: EmailSignature) {
    this._signatureToEdit = signature;

    this._sidebarValue = {
      size: '650px',
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.EDIT_SIGNATURE'
    };

  }

  public updateSignature(signature: EmailSignature) {
    this._templatesService.saveSignature(signature).pipe(first()).subscribe(() => {
      this._getSignatures();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.SIGNATURES.UPDATED');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    this._getSignatures();
  }

  get signatures(): Array<EmailSignature> {
    return this._signatures;
  }

  get newSignatureName(): string {
    return this._newSignatureName;
  }

  set newSignatureName(name: string) {
    this._newSignatureName = name;
  }

  get table(): Table {
    return this._table;
  }

  get signatureToEdit(): any {
    return this._signatureToEdit;
  }

  set signatureToEdit(value: any) {
    this._signatureToEdit = value;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get modalAdd(): boolean {
    return this._modalAdd;
  }

  set modalAdd(value: boolean) {
    this._modalAdd = value;
  }

  get total(): number {
    return this._total;
  }

}

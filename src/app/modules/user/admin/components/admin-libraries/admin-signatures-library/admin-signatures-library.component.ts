import {Component, OnInit} from '@angular/core';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { EmailSignature } from '../../../../../../models/email-signature';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { first } from 'rxjs/operators';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { Response } from '../../../../../../models/response';
import {UmiusConfigInterface, UmiusSidebarInterface, Table} from '@umius/umi-common-component';

@Component({
  selector: 'app-admin-signatures-library',
  templateUrl: 'admin-signatures-library.component.html',
  styleUrls: ['admin-signatures-library.component.scss']
})

export class AdminSignaturesLibraryComponent implements OnInit {

  private _config: UmiusConfigInterface = {
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

  private _sidebarValue: UmiusSidebarInterface = {};

  private _total: number;

  private _table: Table;

  private _modalOpen: boolean;

  private _signaturesToRemove: Array<EmailSignature> = [];

  private _isModalAdd: boolean;

  private _isModalDelete: boolean;

  private _noResult: boolean;

  constructor(private _templatesService: TemplatesService,
              private _translateTitleService: TranslateTitleService,
              private _activatedRoute: ActivatedRoute,
              private _translateNotificationsService: TranslateNotificationsService) {
    this._translateTitleService.setTitle('Signatures | Libraries');
  }

  ngOnInit(): void {
    if (this._activatedRoute.snapshot.data.signatures && Array.isArray(this._activatedRoute.snapshot.data.signatures.result)) {
      this._signatures = this._activatedRoute.snapshot.data.signatures.result;
      this._total = this._activatedRoute.snapshot.data.signatures._metadata.totalCount;
      this._noResult = this._total === 0;
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
      _paginationTemplate: 'TEMPLATE_1',
      _isTitle: true,
      _clickIndex: 1,
      _isNoMinHeight: true,
      _columns: [
        {_attrs: ['name'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['from'], _name: 'TABLE.HEADING.AUTHOR', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['content'], _name: 'TABLE.HEADING.CONTENT', _type: 'TEXT'},
        {_attrs: ['language'], _name: 'TABLE.HEADING.LANGUAGE', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['email'], _name: 'TABLE.HEADING.EMAIL_ADDRESS', _type: 'TEXT', _isSearchable: true}
      ]
    };
  }

  prepareSignatureTable(signatures: Array<EmailSignature>, total: number) {
    this._signatures = signatures || [];
    this._total = total || 0;
    this._noResult = this._config.search.length > 2 ? false : this._total === 0;
    this._initializeTable();
  }

  private _getSignatures() {
    this._templatesService.getAllSignatures(this._config).pipe(first()).subscribe((response: Response) => {
      this.prepareSignatureTable(response.result, response._metadata.totalCount);
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }

  private _resetModalVariables() {
    this._isModalAdd = false;
    this._isModalDelete = false;
  }

  public onClickAdd() {
    this._resetModalVariables();
    this._isModalAdd = true;
    this._modalOpen = true;
  }

  private _updateSignatureStorage(operation: string, newSignature: EmailSignature, signatureList: Array<EmailSignature> = []) {
      switch (operation) {
        case 'create':
          this._signatures.push(newSignature);
          this._total += 1;
          break;
        case 'update':
          this._signatures = this._signatures.map((sig: EmailSignature) => {
            return sig._id === newSignature._id ? newSignature : sig;
          });
          break;
        case 'delete':
          this._signatures = this._signatures.filter((sig: EmailSignature) =>
            !signatureList.find(ele => sig._id === ele._id));
          this._total -= signatureList.length;
          break;
    }
    this.prepareSignatureTable(this._signatures, this._total);
    this._initializeTable();
  }

  public onAddConfirm() {
    this._templatesService.createSignature({name: this._newSignatureName}).pipe(first()).subscribe((response: EmailSignature) => {
      this._updateSignatureStorage('create', response);
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.SIGNATURES.ADDED');
      this._newSignatureName = null;
      this._modalOpen = false;
      this.editSignature(response);
    }, () => {
      this._checkSignatureAlready();
    });
  }

  private _checkSignatureAlready() {
    if (this._signatures.length > 0 && this._newSignatureName && this._signatures.find((signature) => signature.name === this._newSignatureName)) {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SIGNATURES.ALREADY_EXIST');
    } else {
      this._modalOpen = false;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    }
  }

  public editSignature(signature: EmailSignature) {
    this._signatureToEdit = signature;

    this._sidebarValue = {
      size: '650px',
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.EDIT_SIGNATURE'
    };

  }

  public updateSignature(signature: EmailSignature) {
    this._templatesService.saveSignature(signature).pipe(first()).subscribe(() => {
      this._updateSignatureStorage('update', signature);
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.SIGNATURES.UPDATED');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public OnClickDelete(value: Array<EmailSignature>) {
    this._signaturesToRemove = value;
    this._resetModalVariables();
    this._isModalDelete = true;
    this._modalOpen = true;
  }

  public onDeleteConfirm() {
    this._updateSignatureStorage('delete', null, this._signaturesToRemove);
    this._signaturesToRemove.forEach((signature) => {
      this._templatesService.removeSignature(signature._id).pipe(first()).subscribe(() => {
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.SIGNATURES.DELETED');
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
      });
    });

    this._modalOpen = false;

  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get config(): UmiusConfigInterface {
    return this._config;
  }

  set config(value: UmiusConfigInterface) {
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

  get sidebarValue(): UmiusSidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: UmiusSidebarInterface) {
    this._sidebarValue = value;
  }

  get modalOpen(): boolean {
    return this._modalOpen;
  }

  set modalOpen(value: boolean) {
    this._modalOpen = value;
  }

  get total(): number {
    return this._total;
  }

  get signaturesToRemove(): Array<EmailSignature> {
    return this._signaturesToRemove;
  }

  get isModalAdd(): boolean {
    return this._isModalAdd;
  }

  get isModalDelete(): boolean {
    return this._isModalDelete;
  }

  get noResult(): boolean {
    return this._noResult;
  }

}

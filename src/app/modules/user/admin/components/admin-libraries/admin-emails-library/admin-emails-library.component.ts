import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TransactionalEmail } from '../../../../../../models/transactionnal-email';
import { Table } from '../../../../../table/models/table';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';
import { EmailSignature } from '../../../../../../models/email-signature';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-emails-library',
  templateUrl: 'admin-emails-library.component.html',
  styleUrls: ['admin-emails-library.component.scss']
})
export class AdminEmailsLibraryComponent implements OnInit {

  language = 'en';

  private _signatures: Array<EmailSignature> = [];

  private _emails: Array<TransactionalEmail> = [];

  private _emailToEdit: TransactionalEmail;

  private _newEmailName: string = null;

  private _sidebarValue: SidebarInterface = {};

  private _total = 0;

  private _tableInfos: Table = null;

  private _modalAdd = false;

  private _config = {
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"id":-1}'
  };

  constructor(private templatesService: TemplatesService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this.templatesService.getAllSignatures({limit: '0'}).pipe(first()).subscribe((signatures: any) => {
      this._signatures = signatures.result;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
    this.getEmails();
  }


  public getEmails(config?: any) {

    if (config) {
      this._config = config;
    }

    this.templatesService.getAllEmails(this._config).pipe(first()).subscribe((emails:any) => {
      this._emails = emails.result;
      this._total = emails._metadata.totalCount;
      this.initTable();
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });

  }


  onClickAdd() {
    this._modalAdd = true;
  }


  private initTable() {
    this._emails.forEach((email: TransactionalEmail) => {
      if (email.en && email.en.signature) {
        const fullSignature = this._signatures.find(s => s._id === email.en.signature.toString());
        if (fullSignature) email.en.signatureName = fullSignature.name;
      }
      if (email.fr && email.fr.signature) {
        const fullSignature = this._signatures.find(s => s._id === email.fr.signature.toString());
        if (fullSignature) email.fr.signatureName = fullSignature.name;
      }
    });

    this._tableInfos = {
      _selector: 'admin-emails',
      _content: this._emails,
      _total: this._total,
      _isHeadable: false,
      _isFiltrable: false,
      _isDeletable: true,
      _isSelectable: true,
      _isNotPaginable: true,
      _isEditable: true,
      _reloadColumns: true,
      _columns: [
        {_attrs: [`name`], _name: 'Nom', _type: 'TEXT', _isSortable: false},
        {_attrs: [`${this.language}.subject`], _name: 'Objet', _type: 'TEXT', _isSortable: false},
        {_attrs: [`${this.language}.content`], _name: 'Contenu', _type: 'TEXT', _isSortable: false},
        {_attrs: [`${this.language}.signatureName`], _name: 'Signature', _type: 'TEXT', _isSortable: false}
      ]
    };

  }

  public changeLanguage(value: string) {
    this.language = value;
    this.initTable();
  }


  public editEmail(email: any) {
    this._emailToEdit = email;
    this._sidebarValue = {
      size: '650px',
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: email.name
    };
  }


  public updateEmail(email: TransactionalEmail) {
    this.templatesService.saveEmail(email).pipe(first()).subscribe((updatedEmail: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  removeEmails(emails: Array<TransactionalEmail>) {
    emails.forEach((email: TransactionalEmail) => {
      this.deleteEmail(email._id);
    });
  }


  public deleteEmail(emailId: string) {
    this.templatesService.removeEmail(emailId).pipe(first()).subscribe((_: any) => {
      this.getEmails();
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  public onClickConfirm() {
    this.templatesService.createEmail({name: this._newEmailName}).pipe(first()).subscribe((newEmail: any) => {
      this._newEmailName = null;
      this.editEmail(newEmail);
      this.getEmails();
      this._modalAdd = false;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  getId(): string {
    return this._emailToEdit ? `${this._emailToEdit.name.replace(/\s/ig, '_').toLowerCase()}` : "_none";
  }

  get emails(): Array<TransactionalEmail> {
    return this._emails;
  }

  get newEmailName(): string {
    return this._newEmailName;
  }

  set newEmailName(name: string) {
    this._newEmailName = name;
  }

  get tableInfos(): any {
    return this._tableInfos;
  }

  get emailToEdit(): any {
    return this._emailToEdit;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get config(): any {
    return this._config;
  }

  set config(value: any) {
    this._config = value;
  }

  set emailToEdit(value: any) {
    this._emailToEdit = value;
  }

  get signatures(): Array<EmailSignature> {
    return this._signatures;
  }

  get modalAdd(): boolean {
    return this._modalAdd;
  }

  set modalAdd(value: boolean) {
    this._modalAdd = value;
  }

}

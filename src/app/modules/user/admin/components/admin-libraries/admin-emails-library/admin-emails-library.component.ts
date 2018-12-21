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

  public language = 'en';
  private _signatures: Array<EmailSignature> = [];
  private _emails: Array<TransactionalEmail> = [];
  private _emailToEdit: TransactionalEmail;
  private _newEmailName: string = null;
  private _more: SidebarInterface = {};
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
    this._templatesService.getAllSignatures({limit: '0'}).pipe(first()).subscribe((signatures: any) => {
      this._signatures = signatures.result;
    });
    this.getEmails();
  }

  public getEmails(config?: any) {
    if (config) {
      this._config = config;
    }
    this._templatesService.getAllEmails(this._config).pipe(first()).subscribe((emails:any) => {
      this._emails = emails.result;
      this._total = emails._metadata.totalCount;
      this._initTable();
    });
  }

  private _initTable() {
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
    this._initTable();
  }

  public closeSidebar(value: string) {
    this.more.animate_state = value;
  }

  public editEmail(email: any) {
    this._emailToEdit = email;
    this._more = {
      size: '650px',
      animate_state: this._more.animate_state === 'active' ? 'inactive' : 'active',
      title: email.name
    };
  }

  public updateEmail(email: TransactionalEmail) {
    this._templatesService.saveEmail(email).pipe(first()).subscribe((updatedEmail: any) => {
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }

  removeEmails(emails: Array<TransactionalEmail>) {
    emails.forEach((email: TransactionalEmail) => {
      this.deleteEmail(email._id);
    });
  }

  public deleteEmail(emailId: string) {
    this._templatesService.removeEmail(emailId).pipe(first()).subscribe((_: any) => {
      this.getEmails();
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    });
  }

  public createEmail() {
    this._templatesService.createEmail({name: this._newEmailName}).pipe(first()).subscribe((newEmail: any) => {
      this._newEmailName = null;
      this.editEmail(newEmail);
      this.getEmails();
    });
  }

  get emails(): Array<TransactionalEmail> { return this._emails; }
  get newEmailName(): string { return this._newEmailName; }
  set newEmailName(name: string) { this._newEmailName = name; }
  get tableInfos(): any { return this._tableInfos; }
  get emailToEdit(): any { return this._emailToEdit; }
  get more(): any { return this._more; }
  get config(): any { return this._config; }
  set config(value: any) { this._config = value; }
  set emailToEdit(value: any) { this._emailToEdit = value; }
  get signatures(): Array<EmailSignature> { return this._signatures; }
}

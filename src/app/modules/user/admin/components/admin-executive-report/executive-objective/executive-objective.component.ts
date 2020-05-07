import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { ExecutiveObjective } from '../../../../../../models/executive-report';
import { UserService } from '../../../../../../services/user/user.service';
import { CommonService } from '../../../../../../services/common/common.service';
import { TranslateService } from '@ngx-translate/core';

interface Commercial {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'executive-objective',
  templateUrl: './executive-objective.component.html',
  styleUrls: ['./executive-objective.component.scss']
})

export class ExecutiveObjectiveComponent implements OnInit {

  @Input() set config(value: ExecutiveObjective) {
    this._config = value;
    this.textColor('objective');
    this.textColor('clientName');
    this.textColor('clientEmail');
  }

  @Output() configChange: EventEmitter<ExecutiveObjective> = new EventEmitter<ExecutiveObjective>();

  private _config: ExecutiveObjective = <ExecutiveObjective> {
    objective: '',
    client: {
      name: '',
      email: '',
    },
    sale: ''
  };

  private _allCommercials: Array<Commercial> = [];

  private _commercial: Commercial = <Commercial>{};

  private _objectiveColor = '';

  private _clientNameColor = '';

  private _clientEmailColor = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _userService: UserService,
              private _translateService: TranslateService) { }

  ngOnInit(): void {
    this._getCommercials();
  }

  /***
   * this is to get the commercial list from the back. From the moment we are getting the
   * super-admin.
   * @private
   */
  private _getCommercials() {
    if (isPlatformBrowser(this._platformId)) {
      this._userService.getAll({ roles: 'super-admin', fields: '_id firstName lastName phone email' })
        .pipe(first()).subscribe((response) => {

          this._allCommercials = response && response['result'] ? response['result'] : [];

          if (this._allCommercials.length > 0) {
            this._allCommercials = this._allCommercials.sort((a, b) => {
              const nameA = (a.firstName + a.lastName).toLowerCase();
              const nameB =  (b.firstName + b.lastName).toLowerCase();
              return nameA.localeCompare(nameB);
            });
          }

          this._populateCommercial();

        }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  /***
   * populating the sale field.
   * @private
   */
  private _populateCommercial() {
    if (this._config.sale) {
      const index = this._allCommercials.findIndex((commercial) => commercial._id === this._config.sale);
      if (index !== -1) {
        this._commercial = this._allCommercials[index];
      }
    }
  }

  public textColor(field: string) {
    switch (field) {

      case 'objective':
        this._objectiveColor = CommonService.getLimitColor(this._config.objective.length, 120);
        break;

      case 'clientName':
        this._clientNameColor = CommonService.getLimitColor(this._config.client.name.length, 58);
        break;

      case 'clientEmail':
        this._clientEmailColor = CommonService.getLimitColor(this._config.client.email.length, 58);
        break;

    }
  }

  public emitChanges() {
    this.configChange.emit(this._config);
  }

  public onClickSnippet(event: Event) {
    event.preventDefault();
    this._translateService.get('ADMIN_EXECUTIVE_REPORT.SNIPPET.OBJECTIVE').subscribe((text) => {
      this._config.objective = text;
      this.textColor('objective');
      this.emitChanges();
    });
  }

  /***
   * when the user selects the commercial from the Select box.
   * @param event
   */
  public selectCommercial(event: Event) {
    this._config.sale = event && event.target && (event.target as HTMLSelectElement).value || '';
    this._populateCommercial();
    this.emitChanges();
  }

  get config(): ExecutiveObjective {
    return this._config;
  }

  get allCommercials(): Array<Commercial> {
    return this._allCommercials;
  }

  get commercial(): Commercial {
    return this._commercial;
  }

  get objectiveColor(): string {
    return this._objectiveColor;
  }

  get clientNameColor(): string {
    return this._clientNameColor;
  }

  get clientEmailColor(): string {
    return this._clientEmailColor;
  }

}

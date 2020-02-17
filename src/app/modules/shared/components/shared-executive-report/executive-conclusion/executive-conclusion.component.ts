import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { ExecutiveConclusion } from '../../../../../models/executive-report';
import { CommonService } from '../../../../../services/common/common.service';
import { UserService } from '../../../../../services/user/user.service';
import { isPlatformBrowser } from '@angular/common';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

interface Operator {
  _id: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'executive-conclusion',
  templateUrl: './executive-conclusion.component.html',
  styleUrls: ['./executive-conclusion.component.scss']
})

export class ExecutiveConclusionComponent implements OnInit {
  @Input() set config(value: ExecutiveConclusion) {
    this._config = {
      conclusion: value.conclusion || '',
      umiOperator: value.umiOperator || ''
    };
  }

  @Output() configChange: EventEmitter<ExecutiveConclusion> = new EventEmitter<ExecutiveConclusion>();

  private _config: ExecutiveConclusion = <ExecutiveConclusion> {
    conclusion: '',
    umiOperator: ''
  };

  private _conclusionColor = '';

  private _allOperators: Array<Operator> = [];

  private _umiOperator: Operator = <Operator>{};

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _userService: UserService) { }

  ngOnInit(): void {
    this.textColor();
    this._getOperators();
  }

  private _getOperators() {
    if (isPlatformBrowser(this._platformId)) {
      this._userService.getAll({ roles: 'super-admin', fields: '_id firstName lastName' }).pipe(first()).subscribe((response) => {

        this._allOperators = response && response['result'] ? response['result'] : [];

        if (this._allOperators.length > 0) {
          this._allOperators = this._allOperators.sort((a, b) => {
            const nameA = (a.firstName + a.lastName).toLowerCase();
            const nameB =  (b.firstName + b.lastName).toLowerCase();
            return nameA.localeCompare(nameB);
          });
        }

        this._populateOperator();

      }, (err: HttpErrorResponse) => {
        console.log(err);
      })
    }
  }

  private _populateOperator() {
    if (this._config.umiOperator) {
      const index = this._allOperators.findIndex((operator) => operator._id === this._config.umiOperator);
      if (index !== -1) {
        this._umiOperator = this._allOperators[index];
      }
    }
  }

  public emitChanges() {
    this.configChange.emit(this.config);
  }

  public textColor() {
    this._conclusionColor = CommonService.getLimitColor(this._config.conclusion.length, 270);
  }

  public selectOperator(event: Event) {
    this._config.umiOperator = event && event.target && (event.target as HTMLSelectElement).value || '';
    this._populateOperator();
    this.emitChanges();
  }

  get config(): ExecutiveConclusion {
    return this._config;
  }

  get conclusionColor(): string {
    return this._conclusionColor;
  }

  get allOperators(): Array<Operator> {
    return this._allOperators;
  }

  get umiOperator(): Operator {
    return this._umiOperator;
  }


}

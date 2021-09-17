import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TargetPros } from '../../models/targetPros';

@Injectable({providedIn: 'root'})
export class JobsFrontService {

  private _targetedProsUpdated: TargetPros = <TargetPros>{};

  private _targetedProsToUpdate: BehaviorSubject<TargetPros> = new BehaviorSubject<TargetPros>(<TargetPros>{});

  /***
   * set the TargetPros value using this function.
   * @param value
   */
  public setTargetedProsToUpdate(value: TargetPros) {
    this._targetedProsUpdated = value;
    this._targetedProsToUpdate.next(value);
  }

  public targetedProsUpdatedOnChange(value: any) {
    let _identifier = '';
    switch (value.action) {
      case 'jobTypos':
        _identifier = value.identifier;
        this._targetedProsUpdated.jobsTypologies[_identifier].state = value.state;
        this._targetedProsUpdated.jobsTypologies[_identifier].jobs = value.jobs;
        this.setTargetedProsToUpdate(this._targetedProsUpdated);
        break;
      case 'seniorLevels':
        _identifier = value.identifier;
        this._targetedProsUpdated.seniorityLevels[_identifier].state = value.state;
        this.setTargetedProsToUpdate(this._targetedProsUpdated);
        break;
      case 'searchOperator':
        this._targetedProsUpdated.searchOperator = value.searchOp === 'OR' ? 'OR' : 'AND';
        this.setTargetedProsToUpdate(this._targetedProsUpdated);
        break;
    }
  }

  /***
   * use this to listen the value in the components that
   * we set.
   */
  public targetedProsToUpdate(): BehaviorSubject<TargetPros> {
    return this._targetedProsToUpdate;
  }
}

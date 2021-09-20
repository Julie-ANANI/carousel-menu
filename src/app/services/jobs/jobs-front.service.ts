import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TargetPros } from '../../models/targetPros';

@Injectable({providedIn: 'root'})
export class JobsFrontService {

  private _targetedProsUpdated: TargetPros = <TargetPros>{};

  private _targetedProsToUpdate: BehaviorSubject<{ targetPros: TargetPros, toSort: boolean, isToggle?: boolean, identifier?: string }> =
    new BehaviorSubject<{ targetPros: TargetPros, toSort: boolean, isToggle?: boolean, identifier?: string }>({
      targetPros: <TargetPros>{},
      toSort: true,
      isToggle: false,
      identifier: 'x'
    });

  private _currentJobTypologieIdentifier = '';

  private _currentIdentifierObj: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /***
   * set the TargetPros value using this function.
   * @param value
   */
  public setTargetedProsToUpdate(value: { targetPros: TargetPros, toSort: boolean, isToggle?: boolean, identifier?: string }) {
    this._targetedProsUpdated = value.targetPros;
    this._targetedProsToUpdate.next(value);
  }

  public setCurrentIdentifierObj(value: string) {
    this._currentIdentifierObj.next(value);
  }

  public setIsSortJobTypologiesList(identifier: string) {
    if (!this._currentJobTypologieIdentifier) {
      this._currentJobTypologieIdentifier = identifier;
      return true;
    } else {
      if (this._currentJobTypologieIdentifier !== identifier) {
        return true;
      } else {
        this._currentJobTypologieIdentifier = identifier;
        return false;
      }
    }
  }

  public targetedProsUpdatedOnChange(value: any) {
    let _identifier = '';
    switch (value.action) {
      case 'jobTypos':
        _identifier = value.identifier;
        const toSort = this.setIsSortJobTypologiesList(_identifier);
        this._targetedProsUpdated.jobsTypologies[_identifier].state = value.state;
        this._targetedProsUpdated.jobsTypologies[_identifier].jobs = value.jobs;
        this.setTargetedProsToUpdate({
          targetPros: this._targetedProsUpdated,
          toSort: toSort,
          identifier: _identifier,
          isToggle: value.isToggle
        });
        break;
      case 'seniorLevels':
        _identifier = value.identifier;
        this._targetedProsUpdated.seniorityLevels[_identifier].state = value.state;
        this.setTargetedProsToUpdate({targetPros: this._targetedProsUpdated, toSort: false});
        break;
      case 'searchOperator':
        this._targetedProsUpdated.searchOperator = value.searchOp === 'OR' ? 'OR' : 'AND';
        this.setTargetedProsToUpdate({targetPros: this._targetedProsUpdated, toSort: false});
        break;
    }
  }

  setSortValue(value: any) {
    let sort = false;
    if (value.isAll) {
      if (this._currentJobTypologieIdentifier === value.identifier) {

      }
    }
  }

  /***
   * use this to listen the value in the components that
   * we set.
   */
  public targetedProsToUpdate(): BehaviorSubject<{ targetPros: TargetPros, toSort: boolean }> {
    return this._targetedProsToUpdate;
  }

  public currentIdentifierObj(): BehaviorSubject<string> {
    return this._currentIdentifierObj;
  }
}

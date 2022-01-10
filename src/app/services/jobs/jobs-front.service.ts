import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JobConfig, TargetPros } from '../../models/target-pros';

@Injectable({providedIn: 'root'})
export class JobsFrontService {

  private _targetedProsUpdated: TargetPros = <TargetPros>{};

  private _targetedProsToUpdate: BehaviorSubject<{ targetPros: TargetPros, isToggle?: boolean, identifier?: string, toSave?: boolean }> =
    new BehaviorSubject<{ targetPros: TargetPros, isToggle?: boolean, identifier?: string, toSave?: boolean }>({
      targetPros: <TargetPros>{},
      isToggle: false,
      identifier: '',
      toSave: false
    });

  /***
   * set the TargetPros value using this function.
   * @param value
   */
  public setTargetedProsToUpdate(value: { targetPros: TargetPros, isToggle?: boolean, identifier?: string, toSave?: boolean }) {
    this._targetedProsUpdated = this.prepareTargetPros(value.targetPros);
    this._targetedProsToUpdate.next(value);
  }

  public checkJobTypoState(jobs: Array<JobConfig>): number {
    const _stateNeutral = jobs.filter((_job: any) => {
      return _job.state === 2;
    }).length;

    const _stateExcluded = jobs.filter((_job: any) => {
      return _job.state === 0;
    }).length;

    const _stateIncluded = jobs.filter((_job: any) => {
      return _job.state === 1;
    }).length;

    if (_stateNeutral === jobs.length) {
      return 2;
    } else if (_stateExcluded === jobs.length) {
      return 0;
    } else if (_stateIncluded === jobs.length) {
      return 1;
    } else {
      return 3;
    }
  }

  public prepareTargetPros(targetPros: TargetPros) {
    Object.keys(targetPros.jobsTypologies).forEach(key => {
      targetPros.jobsTypologies[key].identifier = key;
      targetPros.jobsTypologies[key].isToggle = false;
      targetPros.jobsTypologies[key].state = this.checkJobTypoState(targetPros.jobsTypologies[key].jobs);
      switch (targetPros.jobsTypologies[key].state) {
        case 0:
          targetPros.jobsTypologies[key].jobs.map(_job => {
            _job.state = 0;
          });
          targetPros.jobsTypologies[key].totalCount = targetPros.jobsTypologies[key].jobs.length;
          break;
        case 1:
          targetPros.jobsTypologies[key].jobs.map(_job => {
            _job.state = 1;
          });
          targetPros.jobsTypologies[key].totalCount = targetPros.jobsTypologies[key].jobs.length;
          break;
        case 2:
          targetPros.jobsTypologies[key].jobs.map(_job => {
            _job.state = 2;
          });
          targetPros.jobsTypologies[key].totalCount = 0;
          break;
        case 3:
          targetPros.jobsTypologies[key].totalCount = targetPros.jobsTypologies[key].jobs.filter(_job =>
            _job.state === 1
          ).length + targetPros.jobsTypologies[key].jobs.filter(_job =>
            _job.state === 0
          ).length;
      }
    });
    return targetPros;
  }

  public targetedProsUpdatedOnChange(value: any) {
    let _identifier = '';
    switch (value.action) {
      case 'jobTypos':
        _identifier = value.identifier;
        this.updateJobs(_identifier, value.jobs);
        this._targetedProsUpdated.jobsTypologies[_identifier].isToggle = value.isToggle;
        this.setTargetedProsToUpdate({
          targetPros: this._targetedProsUpdated,
          identifier: _identifier,
          isToggle: value.isToggle,
          toSave: true
        });
        break;
      case 'seniorLevels':
        _identifier = value.identifier;
        this._targetedProsUpdated.seniorityLevels[_identifier].state = value.state;
        this.setTargetedProsToUpdate({targetPros: this._targetedProsUpdated, toSave: true});
        break;
      case 'searchOperator':
        this._targetedProsUpdated.searchOperator = value.searchOp === 'OR' ? 'OR' : 'AND';
        this.setTargetedProsToUpdate({targetPros: this._targetedProsUpdated, toSave: true});
        break;
    }
  }

  private updateJobs(identifier: string, jobsToUpdate: Array<JobConfig>) {
    this._targetedProsUpdated.jobsTypologies[identifier].jobs.map(job => {
      const jobToUpdate = jobsToUpdate.find(jobUpdate => jobUpdate._id === job._id);
      if (jobToUpdate) {
        job.state = jobToUpdate.state;
      }
    });
  }

  /***
   * use this to listen the value in the components that
   * we set.
   */
  public targetedProsToUpdate(): BehaviorSubject<{ targetPros: TargetPros, isToggle?: boolean, identifier?: string, toSave?: boolean }> {
    return this._targetedProsToUpdate;
  }
}

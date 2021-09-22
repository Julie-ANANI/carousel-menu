import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JobConfig, TargetPros } from '../../models/targetPros';

@Injectable({providedIn: 'root'})
export class JobsFrontService {

  private _targetedProsUpdated: TargetPros = <TargetPros>{};

  private _targetedProsToUpdate: BehaviorSubject<{ targetPros: TargetPros, isToggle?: boolean, identifier?: string }> =
    new BehaviorSubject<{ targetPros: TargetPros, isToggle?: boolean, identifier?: string }>({
      targetPros: <TargetPros>{},
      isToggle: false,
      identifier: ''
    });

  /***
   * set the TargetPros value using this function.
   * @param value
   */
  public setTargetedProsToUpdate(value: { targetPros: TargetPros, isToggle?: boolean, identifier?: string }) {
    this._targetedProsUpdated = value.targetPros;
    this._targetedProsToUpdate.next(value);
  }

  public targetedProsUpdatedOnChange(value: any) {
    let _identifier = '';
    switch (value.action) {
      case 'jobTypos':
        _identifier = value.identifier;
        this.updateJobs(_identifier, value.jobs);
        this._targetedProsUpdated.jobsTypologies[_identifier].state = value.state;
        this._targetedProsUpdated.jobsTypologies[_identifier].totalCount = this._targetedProsUpdated.jobsTypologies[_identifier].jobs.filter((job: any) => job.state === 1).length +
          this._targetedProsUpdated.jobsTypologies[_identifier].jobs.filter((job: any) => job.state === 0).length;
        this._targetedProsUpdated.jobsTypologies[_identifier].isToggle = value.isToggle;
        this.setTargetedProsToUpdate({
          targetPros: this._targetedProsUpdated,
          identifier: _identifier,
          isToggle: value.isToggle
        });
        break;
      case 'seniorLevels':
        _identifier = value.identifier;
        this._targetedProsUpdated.seniorityLevels[_identifier].state = value.state;
        this.setTargetedProsToUpdate({targetPros: this._targetedProsUpdated});
        break;
      case 'searchOperator':
        this._targetedProsUpdated.searchOperator = value.searchOp === 'OR' ? 'OR' : 'AND';
        this.setTargetedProsToUpdate({targetPros: this._targetedProsUpdated});
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
  public targetedProsToUpdate(): BehaviorSubject<{ targetPros: TargetPros, isToggle?: boolean, identifier?: string }> {
    return this._targetedProsToUpdate;
  }
}

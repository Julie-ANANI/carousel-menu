import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { JobConfig } from '../../../../models/targetPros';

/**
 * SL - 0: excluded, 1: included
 * JT - 0: excluded, 1: included, 2: neutral, 3:mixe
 */

@Component({
  selector: 'app-shared-search-config-pro',
  templateUrl: './shared-search-config-pro.component.html',
  styleUrls: ['./shared-search-config-pro.component.scss']
})
export class SharedSearchConfigProComponent implements OnInit {
  @Input() set option(value: any) {
    this._option = value;
    this._currentState = this._option.state;
    this._context = this._option.name;
  }

  @Input() set jobs(jobs: Array<JobConfig>) {
    this._jobConfigs = jobs;
    console.log(this._jobConfigs);
  }

  @Input() isJobTypo = false;

  @Output() sendStateOnChange: EventEmitter<any> = new EventEmitter();

  private _context = '';

  private _jobConfigs: Array<JobConfig> = [];

  private _option: any;

  private _currentState = 0;

  private _showToggleSearch = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object) {
  }

  ngOnInit() {
  }


  get jobConfigs(): Array<JobConfig> {
    return this._jobConfigs;
  }

  getCurrentState() {
    switch (this._currentState) {
      case 0:
        return {
          border: '5px solid #EA5858',
          color: '#EA5858'
        };
      case 3:
      case 2:
        return {
          border: '5px solid #FFFFFF',
          color: '#FFFFFF'
        };
      case 1:
        return {
          border: '5px solid #2ECC71',
          color: '#2ECC71'
        };
    }
  }

  get currentState(): number {
    return this._currentState;
  }

  get context(): string {
    return this._context;
  }

  setJobStates() {
    switch (this._currentState) {
      case 0:
        this._currentState = 2;
        this.jobConfigs.map(_job => {
          _job.state = 2;
        });
        break;
      case 1:
        this._currentState = 0;
        this.jobConfigs.map(_job => {
          _job.state = 0;
        });
        break;
      case 2:
        this._currentState = 1;
        this.jobConfigs.map(_job => {
          _job.state = 1;
        });
        break;
      case 3:
        this._currentState = 1;
        this.jobConfigs.map(_job => {
          _job.state = 1;
        });
        break;
    }
  }

  setSenoirLevelState() {
    switch (this._currentState) {
      case 0:
        this._currentState = 1;
        break;
      case 1:
        this._currentState = 0;
        break;
    }
  }

  stateOnChange(event: Event) {
    event.preventDefault();
    if (this.isJobTypo) {
      this.setJobStates();
      this.sendStateOnChange.emit({actions: 'jobTypos', value: this.jobConfigs});
    } else {
      this.setSenoirLevelState();
      this.sendStateOnChange.emit({action: 'seniorLevels', value: {name: this._context, state: this._currentState}});
    }

  }


  get showToggleSearch(): boolean {
    return this._showToggleSearch;
  }

  set showToggleSearch(value: boolean) {
    this._showToggleSearch = value;
  }

  onClickToggle() {
    this._showToggleSearch = !this._showToggleSearch;
  }

  getJobCurrentState(job: any) {
    switch (job.state) {
      case 0:
        return {
          border: '5px solid #EA5858',
          color: '#EA5858'
        };
      case 2:
        return {
          border: '5px solid #333333',
          color: '#333333'
        };
      case 1:
        return {
          border: '5px solid #2ECC71',
          color: '#2ECC71'
        };
    }
  }

  stateJobOnChange(event: Event, job: any) {
    event.preventDefault();
    switch (job.state) {
      case 0:
        job.state = 2;
        break;
      case 1:
        job.state = 0;
        break;
      case 2:
        job.state = 1;
        break;
    }
    this.sendStateOnChange.emit({actions: 'jobTypos', value: this.jobConfigs});
    this._currentState = this.checkTypoState();

  }

  checkTypoState() {
    const _stateNeutral = this._jobConfigs.filter((_job: any) => {
      return _job.state === 2;
    }).length;

    const _stateExcluded = this._jobConfigs.filter((_job: any) => {
      return _job.state === 0;
    }).length;

    const _stateIncluded = this._jobConfigs.filter((_job: any) => {
      return _job.state === 1;
    }).length;

    if (_stateNeutral === this._jobConfigs.length) {
      return 2;
    } else if (_stateExcluded === this._jobConfigs.length) {
      return 0;
    } else if (_stateIncluded === this._jobConfigs.length) {
      return 1;
    } else {
      return 3;
    }
  }

}

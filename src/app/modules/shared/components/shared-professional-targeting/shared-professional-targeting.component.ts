import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { JobsTypologies, SeniorityLevel, TargetPros } from '../../../../models/targetPros';
import { first } from 'rxjs/operators';
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { Campaign } from '../../../../models/campaign';

@Component({
  selector: 'app-shared-professional-targeting',
  templateUrl: './shared-professional-targeting.component.html',
  styleUrls: ['./shared-professional-targeting.component.scss'],
})
export class SharedProfessionalTargetingComponent implements OnInit {

  @Input() set campaign(campaign: Campaign) {
    this._campaign = campaign;
    this.getTargetedProsAndJobs();
  }

  @Input() set isPreview(value) {
    this._isPreview = value;
    if (value) {
      this.getTargetedProsAndJobs();
    }
  }

  @Input() set isReset(value: Boolean) {
    if (value) {
      this.getTargetedProsAndJobs();
    }
  }

  @Output() targetedProsOnChange: EventEmitter<TargetPros> = new EventEmitter<TargetPros>();
  @Output() isPreviewChange: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  // @ViewChild()

  private _campaign: Campaign = <Campaign>{};

  private _seniorityLevels: { [property: string]: SeniorityLevel } = {};

  private _filteredJobsTypologies: { [property: string]: JobsTypologies } = {};

  private _filteredSeniorityLevels: any = {};

  private _targetedProsToUpdate: TargetPros;

  private _jobsTypologies: { [property: string]: JobsTypologies } = {};

  private _searchOperator = 'OR' || 'AND';

  private _isLoading = false;

  private _isPreview: Boolean = false;

  private _selectAllSeniorityLevels = false;

  private _selectAllJobs = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _campaignService: CampaignService) {
  }

  ngOnInit() {

  }

  /**
   * initialise targetedPro
   */
  getTargetedProsAndJobs() {
    this._isLoading = true;
    this._campaignService.getTargetedPros(this._campaign._id).pipe(first())
      .subscribe(res => {
        this._targetedProsToUpdate = res;
        this._jobsTypologies = res.jobsTypologies;
        this._searchOperator = res.searchOperator;
        this._seniorityLevels = res.seniorityLevels;
        this._filteredJobsTypologies = res.jobsTypologies;
        this._filteredSeniorityLevels = res.seniorityLevels;
        setTimeout(() => {
          this._isLoading = false;
        }, 500);
      });
  }

  seniorityLevelsOnChange(event: any) {
    if (event.action === 'seniorLevels') {
      const _identifier = event.identifier;
      this._targetedProsToUpdate.seniorityLevels[_identifier].state = event.state;
    }
    this.targetedProsOnChange.emit(this._targetedProsToUpdate);
  }

  /**
   * update JobCategories
   * @param event
   */
  jobTypoOnChange(event: any) {
    if (event.action === 'jobTypos') {
      const _identifier: string = event.identifier;
      this._targetedProsToUpdate.jobsTypologies[_identifier].state = event.state;
      this._targetedProsToUpdate.jobsTypologies[_identifier].jobs = event.jobs;
      this.targetedProsOnChange.emit(this._targetedProsToUpdate);
    }
  }

  searchOperatorOnChange(searchOp: string) {
    this._searchOperator = searchOp;
    this._targetedProsToUpdate.searchOperator = searchOp === 'OR' ? 'OR' : 'AND';
    this.targetedProsOnChange.emit(this._targetedProsToUpdate);
  }

  previewSearchConfig() {
    this._isPreview = true;
  }

  get isPreview(): Boolean {
    return this._isPreview;
  }

  closePreviewMode() {
    this._isPreview = false;
    this.isPreviewChange.emit(false);
  }

  get filteredJobsTypologies(): { [p: string]: JobsTypologies } {
    return this._filteredJobsTypologies;
  }

  get filteredSeniorityLevels(): { [p: string]: JobsTypologies } {
    return this._filteredSeniorityLevels;
  }

  public onClickSearchJob(keyword: string) {
    if (!!keyword) {
      this._filteredJobsTypologies = {};
      const keys = Object.keys(this._jobsTypologies);
      for (let i = 0; i < keys.length; i++) {
        const category = this._jobsTypologies[keys[i]];

        if (category.name.en.toLowerCase().includes(keyword.toLowerCase())
          || category.name.fr.toLowerCase().includes(keyword.toLowerCase())) {
          this._filteredJobsTypologies[keys[i]] = {
            state: category.state,
            name: category.name,
            jobs: category.jobs
          };
        } else {
          const filteredJobs = category.jobs.filter(j => j.label.en.toLowerCase().includes(keyword.toLowerCase())
            || j.label.fr.toLowerCase().includes(keyword.toLowerCase()));
          if (filteredJobs.length) {
            this._filteredJobsTypologies[keys[i]] = {
              state: category.state,
              name: category.name,
              jobs: filteredJobs
            };
          }
        }
      }
    } else {
      this._filteredJobsTypologies = Object.assign({}, this._jobsTypologies);
    }
  }

  public onClickSearchSeniorityLevel(keyword: string) {
    if (!!keyword) {
      this._filteredSeniorityLevels = {};
      const keys = Object.keys(this._seniorityLevels);
      for (let i = 0; i < keys.length; i++) {
        const level = this._seniorityLevels[keys[i]];

        if (level.name.toLowerCase().includes(keyword.toLowerCase())) {
          this._filteredSeniorityLevels[keys[i]] = {
            state: level.state,
            name: level.name,
          };
        }
      }
    } else {
      this._filteredSeniorityLevels = this._seniorityLevels;
    }
  }

  selectAllOnChange(event: Event, type: 'SENIORITY_LEVEL' | 'JOB_TYPOLOGY') {
    switch (type) {
      case 'JOB_TYPOLOGY':
        this._selectAllJobs = !this._selectAllJobs;
          const keys = Object.keys(this._jobsTypologies);
          keys.forEach(key => {
            this._jobsTypologies[key].state = (this._selectAllJobs) ? 1 : 2;
            this._jobsTypologies[key].jobs.forEach(job => job.state = ((this._selectAllJobs) ? 1 : 2));
          });
          this._targetedProsToUpdate.jobsTypologies = this._jobsTypologies;
          this.targetedProsOnChange.emit(this._targetedProsToUpdate);
        break;
      case 'SENIORITY_LEVEL':
        this._selectAllSeniorityLevels = !this._selectAllSeniorityLevels;
        Object.keys(this._seniorityLevels).map(key => {
          this._seniorityLevels[key].state = (this._selectAllSeniorityLevels) ? 1 : 0;
        });
        this._targetedProsToUpdate.seniorityLevels = this._seniorityLevels;
        this.targetedProsOnChange.emit(this._targetedProsToUpdate);
        break;
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get getSeniorityLevelsKeys() {
    return Object.keys(this._seniorityLevels) || [];
  }

  get getFilteredJobsTypologiesKeys() {
    return Object.keys(this._filteredJobsTypologies) || Object.keys(this._jobsTypologies);
  }

  get seniorityLevels(): { [p: string]: SeniorityLevel } {
    return this._seniorityLevels;
  }

  get jobsTypologies(): { [p: string]: JobsTypologies } {
    return this._jobsTypologies;
  }

  get searchOperator(): string {
    return this._searchOperator;
  }

  get selectAllJobs(): boolean {
    return this._selectAllJobs;
  }

  get selectAllSeniorityLevels(): boolean {
    return this._selectAllSeniorityLevels;
  }

  get nbAllJobSelected(): number {
    let _total = 0;
    Object.keys(this._jobsTypologies).forEach(key => {
      _total += this._jobsTypologies[key].jobs.filter(job => job.state === 1).length;
    });
    return _total;
  }

  get nbAllJobExcluded(): number {
    let _total = 0;
    Object.keys(this._jobsTypologies).forEach(key => {
      _total += this._jobsTypologies[key].jobs.filter(job => job.state === 0).length;
    });
    return _total;
  }

  get nbAllSeniorityLevelSelected(): number {
    let _total = 0;
    Object.keys(this._seniorityLevels).forEach(key => {
      _total += this._seniorityLevels[key].state;
    });
    return _total;
  }

  get nbAllSeniorityLevelExcluded(): number {
    return Object.keys(this.seniorityLevels).length - this.nbAllSeniorityLevelSelected;
  }

}

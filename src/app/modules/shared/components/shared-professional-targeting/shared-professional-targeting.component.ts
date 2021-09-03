import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { JobsTypologies, TargetPros } from '../../../../models/targetPros';
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

  private _seniorityLevels: any = {};

  private _filteredJobsTypologies: { [property: string]: JobsTypologies } = {};

  private _targetedPros: TargetPros;

  private _targetedProsToUpdate: TargetPros;

  private _jobsTypologies: { [property: string]: JobsTypologies } = {};

  private _searchOperator = 'OR' || 'AND';

  private _isLoading = false;

  private _isPreview: Boolean = false;

  private _keyword = '';

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
        this._targetedPros = res;
        this._targetedProsToUpdate = res;
        this._jobsTypologies = this._targetedPros.jobsTypologies;
        this._searchOperator = this._targetedPros.searchOperator;
        this._seniorityLevels = this._targetedPros.seniorityLevels;
        this._filteredJobsTypologies = this._jobsTypologies;
        setTimeout(() => {
          this._isLoading = false;
        }, 500);
      });
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  getSeniorityLevelsKeys() {
    return Object.keys(this._seniorityLevels) || [];
  }

  getJobsTypologiesKeys() {
    return Object.keys(this._jobsTypologies) || [];
  }

  getFilteredJobsTypologiesKeys() {
    return Object.keys(this._filteredJobsTypologies) || Object.keys(this._jobsTypologies);
  }

  get seniorityLevels(): any {
    return this._seniorityLevels;
  }

  get targetedPros(): TargetPros {
    return this._targetedPros;
  }

  get jobsTypologies(): { [p: string]: JobsTypologies } {
    return this._jobsTypologies;
  }

  get searchOperator(): string {
    return this._searchOperator;
  }

  /**
   * update seniorityLevels
   * @param event
   */
  get keyword(): string {
    return this._keyword;
  }

  set keyword(value: string) {
    this._keyword = value;
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

  set filteredJobsTypologies(value: { [p: string]: JobsTypologies }) {
    this._filteredJobsTypologies = value;
  }

  public onClickSearch(keyword: string) {
    if (!!keyword) {
      this._filteredJobsTypologies = {};
      const keys = Object.keys(this._jobsTypologies);
      for (let i = 0; i < keys.length; i++) {
        const category = this._jobsTypologies[keys[i]];
        const filteredJobs = category.jobs.filter(j => j.label.en.toLowerCase().includes(keyword.toLowerCase()));
        if (filteredJobs.length) {
          this._filteredJobsTypologies[keys[i]] = {
            state: category.state,
            name: category.name,
            jobs: filteredJobs
          };
        }
      }
    } else {
      this._filteredJobsTypologies = Object.assign({}, this._jobsTypologies);
    }
  }
}

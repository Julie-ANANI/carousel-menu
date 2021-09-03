import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { JobsCategory, JobsTypologies, TargetPros } from '../../../../models/targetPros';
import { first } from 'rxjs/operators';
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { Campaign } from '../../../../models/campaign';
import { JobsService } from '../../../../services/jobs/jobs.service';

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

  @Input() set isPreview(value){
    this._isPreview = value;
  }

  @Output() isPreviewChange: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  // @ViewChild()

  private _campaign: Campaign = <Campaign>{};

  private _seniorityLevels: Array<any> = [];

  private _allCategoriesAndJobs: Array<JobsCategory> = [];

  private _targetedPros: TargetPros;

  private _jobsTypologies: { [property: string]: JobsTypologies };

  private _searchOperator: string;

  private _isLoading = false;

  private _isPreview: Boolean = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _campaignService: CampaignService,
              private _jobService: JobsService) {
  }

  ngOnInit() {

  }

  getTargetedProsAndJobs() {
    this._isLoading = true;
    this._campaignService.getTargetedPros(this._campaign._id).pipe(first())
      .subscribe(res => {
        this._targetedPros = res;
        this._jobsTypologies = this._targetedPros.jobsTypologies;
        this._searchOperator = this._targetedPros.searchOperator;
        Object.keys(this._targetedPros.seniorityLevels).forEach(level => {
          this._seniorityLevels.push(this._targetedPros.seniorityLevels[level]);
        });
        this._jobService.getAllCategoriesAndJobs({}).pipe(first())
          .subscribe(result => {
            this._allCategoriesAndJobs = result;
            setTimeout(() => {
              this._isLoading = false;
            }, 1500);
          });
      });
  }


  get isLoading(): boolean {
    return this._isLoading;
  }

  get seniorityLevels(): Array<any> {
    return this._seniorityLevels;
  }

  get allCategoriesAndJobs(): Array<JobsCategory> {
    return this._allCategoriesAndJobs;
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

  seniorityLevelsOnChange(event: any) {
    console.log(event);
  }

  jobTypoOnChange(event: any) {
    console.log(event);
  }

  searchOperatorOnChange(searchOp: string) {
    this._searchOperator = searchOp;
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
}

import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Campaign } from '../../../../models/campaign';
import { first, takeUntil } from 'rxjs/operators';
import { GeographySettings } from '../../../../models/innov-settings';
import { RolesFrontService } from '../../../../services/roles/roles-front.service';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../services/error/error-front.service';
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { TargetPros } from '../../../../models/target-pros';
import { JobsFrontService } from '../../../../services/jobs/jobs-front.service';
import { Subject } from 'rxjs/Subject';
import { UmiusLocalStorageService, UmiusSidebarInterface } from '@umius/umi-common-component';
import { CampaignFrontService } from "../../../../services/campaign/campaign-front.service";

@Component({
  selector: 'app-shared-search-pros',
  templateUrl: './shared-search-pros.component.html',
  styleUrls: ['./shared-search-pros.component.scss'],
})
export class SharedSearchProsComponent implements OnInit, OnDestroy {
  @Input() accessPath: Array<string> = [];

  @Input() set campaign(value: Campaign) {
    this._campaign = value;
    this._initParams();
    this.getTargetedProsFromService().then(_ => {
      /**
       * subscribe: get recent targetPros, not saved, current one
       * */
      this._jobFrontService
        .targetedProsToUpdate()
        .pipe(takeUntil(this._ngUnsubscribe))
        .subscribe((result: { targetPros: TargetPros, isToggle?: boolean, identifier?: string, toSave?: boolean }) => {
          this._toSave = result.toSave;
          this._targetedProsToUpdate = result.targetPros || <TargetPros>{};
          this._checkProsTargetingValid();
        });
    });
  }

  private _suggestions: Array<{
    expected_result: number;
    search_keywords: string;
    keywords: string;
  }> = [];

  private _params: any = null;

  private _geography: GeographySettings = {
    continentTarget: {
      africa: false,
      oceania: false,
      asia: false,
      europe: false,
      americaNord: false,
      americaSud: false,
    },
    exclude: [],
    include: [],
  };

  private _campaign: Campaign = <Campaign>{};

  private _sidebarValue: UmiusSidebarInterface = <UmiusSidebarInterface>{};

  private _googleQuota = 100000;

  private _catQuota = 100;

  private _estimatedNumberOfGoogleRequests = 0;

  private _countriesSettings: any[] = [];

  private _catResult: any = null;

  private _displayLoader = false;

  private _showModal = false;

  private _importRequestKeywords = '';

  private _isPreview: Boolean = false;

  private _targetedProsToUpdate: TargetPros;

  private _toSave = false;

  private _isReset = false;

  private _isSaved = false;

  private _saveApplyModalContext = '';

  private _saveApplyModalTitle = '';

  private _isShowModal = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _initialTargetedPro: TargetPros;

  private _errorMessageLaunch = '';

  // isEqual({ foo: 'bar' }, { foo: 'bar' });
  private _isEqual = (...objects: any[]) => objects.every(obj => JSON.stringify(obj) === JSON.stringify(objects[0]));

  constructor(
    @Inject(PLATFORM_ID) protected _platformId: Object,
    private _translateNotificationsService: TranslateNotificationsService,
    private _searchService: SearchService,
    private _rolesFrontService: RolesFrontService,
    private _authService: AuthService,
    private _campaignService: CampaignService,
    private _localStorageService: UmiusLocalStorageService,
    private _jobFrontService: JobsFrontService
  ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._getCountries();
      this._initParams();
    }
  }

  getTargetedProsFromService() {
    return new Promise((resolve, reject) => {
      this._campaignService.getTargetedPros(this._campaign._id).pipe(first())
        .subscribe(res => {
          let targetPros = CampaignFrontService.reformateTargetPro(res);
          this._jobFrontService.setTargetedProsToUpdate({targetPros: targetPros, isToggle: false, identifier: ''});
          this._initialTargetedPro = JSON.parse(JSON.stringify(res));
          resolve(true);
        }, error => {
          console.error(error);
          reject(error);
        });
    });
  }

  private _getCountries() {
    this._searchService
      .getCountriesSettings()
      .pipe(first())
      .subscribe(
        (countriesSettings: any) => {
          this._countriesSettings = countriesSettings.countries;
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(
      this.accessPath.concat(path)
    );
  }

  private _initParams() {
    this._getGoogleQuota();
    this._getCatQuota();

    this._params = {
      keywords: '',
      catKeywords: '',
      websites: {
        linkedin: true,
        viadeo: false,
        kompass: false,
        xing: false,
      },
      count: 10,
      starProfiles: 5,
      country: '',
      countries: [],
      options: {
        automated: false,
        smart: false,
        regions: false,
        indexSearch: false,
        rgpd: false,
        simulation: false,
      },
    };

    if (this.campaign && this.campaign._id) {
      this._params.options.automated = true;
      this._params.options.smart = true;
      this._params.options.regions = true;
      this._params.count = 100;
      this._params.campaign = this.campaign._id;
      this._params.innovation = this.campaign.innovation._id;
      if (
        this.campaign.innovation &&
        this.campaign.innovation.settings &&
        this.campaign.innovation.settings &&
        this.campaign.innovation.settings.geography
      ) {
        this._geography = this.campaign.innovation.settings.geography;
        if (this.campaign.innovation.settings.geography.include) {
          this._params.countries = this.campaign.innovation.settings.geography.include.map(
            (c) => c.code
          );
        }
      }
    }

    this._catResult = {duplicate_status: 'ok'};
    this.estimateNumberOfGoogleRequests();
    this._suggestions = [];
  }

  private _getGoogleQuota() {
    this._searchService
      .dailyStats()
      .pipe(first())
      .subscribe(
        (result: any) => {
          this._googleQuota = 100000;
          if (result.hours) {
            this._googleQuota -= result.hours
              .slice(7)
              .reduce((sum: number, hour: any) => sum + hour.googleQueries, 0);
          }
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public estimateNumberOfGoogleRequests(totalResultsArray?: Array<number>) {
    totalResultsArray =
      totalResultsArray ||
      this._params.keywords
        .split('\n')
        .filter((k: string) => k)
        .fill(1000000);
    this._estimatedNumberOfGoogleRequests = totalResultsArray.reduce(
      (acc: number, curr: number) => {
        return acc + this._estimateNumberOfGoogleRequestsForOneSearch(curr);
      },
      0
    );
  }

  private _estimateNumberOfGoogleRequestsForOneSearch(
    totalResults: number
  ): number {
    let numberOfRequests = 0;
    const selectedCountries = this._params.countries;
    let smartCountries = 0;

    if (this._params.options.smart || this._params.options.regions) {
      this._countriesSettings.forEach((country: any) => {
        if (selectedCountries.indexOf(country.code) > -1) {
          smartCountries++;
          if (!this._params.options.smart || country.threshold < totalResults) {
            if (this._params.options.regions && country.regions.length) {
              numberOfRequests += country.regions.length;
            } else {
              numberOfRequests++;
            }
          }
        }
      });
    }

    if (!this._params.options.smart) {
      numberOfRequests += (selectedCountries.length || 1) - smartCountries;
    }

    return ((numberOfRequests || 1) * this._params.count) / 10;
  }

  /***
   * delete the previous Computer Aided Targeting result
   */
  public onReset() {
    this._catResult = {duplicate_status: 'ok'};
    this._suggestions = [];
    this.estimateNumberOfGoogleRequests();
  }

  /***
   *
   * @param {Event} event: pressed button
   * > update Computer Aided Targeting statistics (SearchService)
   * > Trigger the CAT analysis (NLPService)
   * > format the result and store it in the catResult object
   */
  public onClickSearchCat(event: Event): void {
    event.preventDefault();
    this._displayLoader = true;

    this._searchService
      .updateCatStats(this._params.catKeywords.split('\n').length)
      .pipe(first())
      .subscribe((response: any) => {
      });

    this._searchService
      .computerAidedTargeting(this._params.catKeywords.split('\n'))
      .pipe(first())
      .subscribe(
        (response: any) => {
          this._displayLoader = false;
          this.onReset();
          this._catResult.total_result = [];

          Object.entries(response.total_result).forEach(([key, value]) => {
            this._catResult.total_result.push(value);
          });

          this.estimateNumberOfGoogleRequests(this._catResult.total_result);
          this._catResult.keywords_analysis = response.keywords_analysis.kw;
          let expected_result;
          let keywords;

          this._params.catKeywords.split('\n').forEach((request: string) => {
            expected_result = response.total_result[request];
            keywords = request;
            Object.entries(response.keywords_analysis.kw).forEach(
              ([key, value]) => {
                if (value < 0.5) {
                  request = request.replace(
                    `${key}`,
                    `<span class="text-error">${key}</span>`
                  );
                } else if (value < 0.8) {
                  request = request.replace(
                    `${key}`,
                    `<span class="text-warning">${key}</span>`
                  );
                } else {
                  request = request.replace(
                    `${key}`,
                    `<span class="text-success">${key}</span>`
                  );
                }
              }
            );
            this._suggestions.push({
              expected_result: expected_result,
              search_keywords: request,
              keywords: keywords,
            });
          });

          this._catResult.new_keywords = [];

          Object.entries(response.keywords_analysis.new).forEach(
            ([key, value]) => {
              this._catResult.new_keywords.push(key);
            }
          );

          this._catResult.duplicate_status = response.duplicate_status;
          this._catResult.profile = response.stars;
          this._getCatQuota();
        },
        (err: HttpErrorResponse) => {
          this._displayLoader = false;
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  private _getCatQuota() {
    this._searchService
      .dailyStats()
      .pipe(first())
      .subscribe(
        (result: any) => {
          this._catQuota = 100;
          if (result.hours) {
            this._catQuota -= result.hours
              .slice(7)
              .reduce(
                (sum: number, hour: any) => sum + hour.googleQueriesCat,
                0
              );
          }
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public onClickPlus(search_keywords: string) {
    this._params.keywords += `${search_keywords}\n`;
  }

  public checkKeywords(keywords: string): string {
    return this._params.keywords.indexOf(keywords) !== -1
      ? 'hidden'
      : 'visible';
  }

  public _checkProsTargetingValid() {
    this._errorMessageLaunch = '';

    const targetPros = this._targetedProsToUpdate || this._initialTargetedPro;

    const seniorityIncluded = [];
    const seniorityLevelsKeys = Object.keys(targetPros.seniorityLevels);
    seniorityLevelsKeys.forEach((key) => {
      const level = targetPros.seniorityLevels[key];
      if (level.state === 1) {
        seniorityIncluded.push(level);
      }
    });

    const jobs = [].concat(...Object.keys(targetPros.jobsTypologies).map(key => targetPros.jobsTypologies[key].jobs));
    const jobsIncluded = jobs.filter(j => j.state === 1).map(j => j._id);
    const jobsExcluded = jobs.filter(j => j.state === 0).map(j => j._id);
    const jobsNeutral = jobs.filter(j => j.state === 2).map(j => j._id);

    if (jobsExcluded.length === jobs.length && !seniorityIncluded.length) {
      // jt, sl, all excluded
      this._errorMessageLaunch = 'You must have at least one non-excluded tag on each box';
    } else if (!jobsIncluded.length && seniorityIncluded.length) {
      // sl included, jt all excluded
      this._errorMessageLaunch = 'You must include at least one TJ tag';
    } else if (!seniorityIncluded.length) {
      // jt included, sl all excluded
      this._errorMessageLaunch = 'You must include at least one SL tag';
    } else if ((jobsExcluded.length + jobsNeutral.length) === 1) {
      // heavy handle
      this._errorMessageLaunch = 'Too heavy to handle : only 1 tag is not included. Include all TJ tags or make a new config';
    } else {
      this._errorMessageLaunch = '';
    }
  }

  /**
   * launch all
   * @param event
   */
  public onClickSearch(event: Event): void {
    event.preventDefault();
    this._localStorageService.setItem('searchSettings', JSON.stringify(this._params));

    const searchParams = this._params;

    searchParams.metadata = {user: this._authService.getUserInfo()};

    searchParams.websites = Object.keys(searchParams.websites)
      .filter((key) => searchParams.websites[key])
      .join(' ');

    searchParams.targetPros = (!!this._targetedProsToUpdate) ? this._targetedProsToUpdate : this._campaign.targetPros;

    this._searchService
      .search(searchParams)
      .pipe(first())
      .subscribe(
        (res: any) => {
          this._initParams();
          this._translateNotificationsService.success(
            'Success',
            'The request has been added to the queue.'
          );
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public getCatCircleClass(): string {
    return this._catQuota > 50
      ? 'bg-success'
      : this._catQuota > 10 && this._catQuota <= 50
        ? 'bg-progress'
        : 'bg-alert';
  }

  public getCircleClass(): string {
    return this._googleQuota > 10000
      ? 'bg-success'
      : this._googleQuota < 10000 && this._googleQuota > 5000
        ? 'bg-progress'
        : 'bg-alert';
  }

  public updateSettings(value: any) {
    this._params = value;
  }

  public onGeographyChange(value: GeographySettings) {
    this._geography = value;
    this._params.countries = value.include.map((c) => c.code);
    console.log(this._params.countries);
  }

  /**
   * confirm: restore target pros
   */
  restoreTargetedPros() {
    this._campaignService.getTargetedPros(this._campaign._id).pipe(first())
      .subscribe(res => {
        let targetPros = CampaignFrontService.reformateTargetPro(res);
        this._jobFrontService.setTargetedProsToUpdate({targetPros: targetPros, isToggle: false, identifier: ''});
        this._initialTargetedPro = JSON.parse(JSON.stringify(res));
        this._isReset = false;
        this._toSave = false;
        this._translateNotificationsService.success('Success', 'The saved professional targeting has been applied.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        this._toSave = true;
        this._isReset = false;
        console.error(err);
      });
  }

  confirmSaveReset() {
    this._isShowModal = false;
    if (this._saveApplyModalTitle === 'Apply') {
      this.restoreTargetedPros();
    } else {
      this.saveTargetedPros();
    }
  }


  previewSearchConfig() {
    this._isPreview = true;
  }

  closePreview() {
    this._isPreview = false;
  }

  saveProTargeting() {
    this._saveApplyModalContext = 'Save this professional targeting?';
    this._saveApplyModalTitle = 'Save';
    this._isShowModal = true;
  }

  getUpdatedTargetedPros(targetPros: TargetPros) {
    this._targetedProsToUpdate = targetPros;
    this._toSave = true;
  }

  cancelSaveReset() {
    this._isShowModal = false;
  }

  resetTargetedPros() {
    this._saveApplyModalContext = 'Apply the saved professional targeting?';
    this._saveApplyModalTitle = 'Apply';
    this._isShowModal = true;
  }

  private _isSameDataToSave(): boolean {
    return this._isEqual(this._initialTargetedPro, this._targetedProsToUpdate);
  }

  /**
   * confirm: save targeted pros in the campaign
   */
  saveTargetedPros() {
    this._campaignService.saveTargetedPros(this._campaign._id, this._targetedProsToUpdate).pipe(first())
      .subscribe(() => {
        this._toSave = false;
        this._initialTargetedPro = JSON.parse(JSON.stringify(this._targetedProsToUpdate));
        this._translateNotificationsService.success('Success', 'The saved professional targeting has been saved.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Error', 'An error occurred');
        this._toSave = false;
        this._initialTargetedPro = JSON.parse(JSON.stringify(this._targetedProsToUpdate));
        console.error(err);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      });
  }

  get params(): any {
    return this._params;
  }

  get sidebarValue(): UmiusSidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: UmiusSidebarInterface) {
    this._sidebarValue = value;
  }

  get googleQuota(): number {
    return this._googleQuota;
  }

  get catQuota(): number {
    return this._catQuota;
  }

  get estimatedNumberOfGoogleRequests(): number {
    return this._estimatedNumberOfGoogleRequests;
  }

  get catProcessDone(): any {
    return this._catResult.keywords_analysis;
  }

  set params(value: any) {
    this._params = value;
  }

  get displayLoader(): boolean {
    return this._displayLoader;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get importRequestKeywords(): string {
    return this._importRequestKeywords;
  }

  set importRequestKeywords(value: string) {
    this._importRequestKeywords = value;
  }

  get catResult(): any {
    return this._catResult;
  }

  get geography(): GeographySettings {
    return this._geography;
  }


  set geography(value: GeographySettings) {
    this._geography = value;
    this.onGeographyChange(value);
  }

  get toSave(): boolean {
    return this._toSave && !this._isSameDataToSave();
  }

  get isReset(): boolean {
    return this._isReset;
  }

  set isReset(value: boolean) {
    this._isReset = value;
  }

  get campaign(): Campaign {
    return this._campaign;
  }


  get isPreview(): Boolean {
    return this._isPreview;
  }

  set isPreview(value: Boolean) {
    this._isPreview = value;
  }


  get isSaved(): boolean {
    return this._isSaved;
  }

  get saveApplyModalTitle(): string {
    return this._saveApplyModalTitle;
  }

  get isShowModal(): boolean {
    return this._isShowModal;
  }

  set isShowModal(value: boolean) {
    this._isShowModal = value;
  }

  get saveApplyModalContext(): string {
    return this._saveApplyModalContext;
  }


  get initialTargetedPro(): TargetPros {
    return this._initialTargetedPro;
  }

  get suggestions(): Array<{
    expected_result: number;
    search_keywords: string;
    keywords: string;
  }> {
    return this._suggestions;
  }

  get errorMessageLaunch(): string {
    return this._errorMessageLaunch;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}

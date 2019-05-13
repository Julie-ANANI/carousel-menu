import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { SearchService } from '../../../../services/search/search.service';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { SearchTool } from '../../../../models/demo/search-tool';
import { result_sample } from "../../../../models/static-data/result_sample";
import { SidebarInterface } from "../../../sidebar/interfaces/sidebar-interface";
import { AuthService } from "../../../../services/auth/auth.service";
import { DownloadService } from "../../../../services/download/download.service";
import { countries } from "../../../../models/static-data/country";

@Component({
  selector: 'app-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.scss']
})

export class SearchToolComponent implements OnInit{

  private _searchForm: FormGroup;

  private _slicedPros: Array<any> = [];

  private _searchResult: SearchTool = {};

  private _scale: Array<number> = [];

  private _searchStarted = false;

  private _searchStopped = false;

  private _professionalCount: number = 0;

  private _sidebarValue: SidebarInterface = {};

  private _requestId: string = null;

  private _selectedCountry: string = null;

  private _requestAlreadyLoaded: boolean = false;

  public names: any = countries;

  constructor(private _translateTitleService: TranslateTitleService,
              private _formBuilder: FormBuilder,
              private _searchService: SearchService,
              private _authService: AuthService,
              private _downloadService: DownloadService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._translateTitleService.setTitle('Search Tool | UMI');

  }

  ngOnInit(): void {
    this._buildForm();
  }


  private _buildForm() {
    this._searchForm = this._formBuilder.group({
      keywords: [''],
    });
  }


  public onClickSearch() {
    if (this._requestAlreadyLoaded) {
      this._searchStarted = true;
      this._updateResults();
      this._requestAlreadyLoaded = false;
    } else {

      const keywords = this._searchForm.get('keywords').value;

      if (keywords) {
        this._professionalCount = 0;
        this._slicedPros = [];
        this._searchResult = {};
        this._searchStarted = true;
        this._searchStopped = false;

        if (keywords == "TEST") {
          this._searchResult = result_sample;
          this._scale = [3, 50, 100];
          this._updateResults();
        } else {
          const user = this._authService.getUserInfo().name;
          this._searchService.metadataSearch(keywords, user).pipe(first()).subscribe((result: any) => {
            this._loadResults(result);
            this._updateResults();
          }, () => {
            this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
          });

        }
      }
    }
  }

  public loadRequest(requestId) {
    this._searchService.getMetadataRequest(requestId).pipe(first()).subscribe((request: any) => {
      this._searchForm.setValue({keywords: request.keywords});
      this._loadResults(request);
      this._requestAlreadyLoaded = true;
    });
  }

  private _loadResults(result) {
    this._requestId = result._id;
    this._professionalCount = 0;
    this._slicedPros = [];
    this._searchStopped = false;
    this._searchResult.metadata = result.metadata || {};
    this._searchResult.pros = result.pros;
    this._scale = result.scale || [50, 200, 1500];
  }

  private _updateResults() {
    if (this._searchResult.pros) {
      this._searchResult.pros = this._searchResult.pros.map(pro => {
        pro.isLoading = true;
        return pro;
      });

      setTimeout(() => {
        this._totalProfessional(this._searchResult.metadata.world);
      }, 2005);
    }
  }


  private _totalProfessional(total: number) {
    total = total > 20000 ? 20000 : total < 100 ? 50 : total;
    let duration = 1500 / total;
    let increment = 1;
    this._professionalCount = 0;

    if (duration < 1) {
      increment = Math.round(1/duration);
      duration = 1;
    }

    const self = this;

    const interval = setInterval(() => {
      if ( self._professionalCount >= total) {
        this._searchStopped = true;
        this._searchStarted = false;
        this._loadPros(12, 12);
        clearInterval(interval);
      }
      else  {
        self._professionalCount + increment > total ? self._professionalCount = total : self._professionalCount += increment;
      }
    }, duration);

  }


  private _loadPros(displayLimit: number, loadLimit: number) {
    this._slicedPros = this._selectedCountry ?
      this._searchResult.pros.filter(pro => pro.country === this._selectedCountry) :
      this._searchResult.pros.slice(0, displayLimit);

    this._slicedPros.forEach((professional, index) => {
      if (index >= (displayLimit - loadLimit)) {
        this._formatPro(professional, index);
      }
    });

  }


  public onClickSeeMore() {
    const currentNumberOfPros = this._slicedPros.length;

    const end = currentNumberOfPros + 12 > this._searchResult.pros.length ?
      this._searchResult.pros.length : currentNumberOfPros + 12;

    this._loadPros(end, 12);
  }


  private _formatPro(professional: any, index: number) {

      if (!professional.company) {
        professional.company = '';
      }

      if (!professional.email) {
        professional.email = `${professional.firstName.toLowerCase()}.${professional.lastName.toLowerCase()}@${professional.companyDomain || "unknown.com"}`;
      }

      if(professional.companyDomain) {
        professional.companyLogoUrl = `https://logo.clearbit.com/${professional.companyDomain}?size=240`;
      }

      setTimeout(() => {
        professional.isLoading = false;
        this._slicedPros[index] = professional;
      }, Math.floor(Math.random() * 2000) + 1000);

  }

  public onClickMenu() {
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'History',
      size: '730px'
    };
  }

  public downloadRequest() {
    const keywords = this._searchForm.get('keywords').value;
    if (keywords) {
      const jsonFile = JSON.stringify({
        keywords: keywords,
        pros: this._searchResult.pros,
        metadata: this._searchResult.metadata,
        scale: this._scale,
      });
      this._downloadService.saveJson(jsonFile, keywords);
    }
  }

  public uploadRequest(file: File) {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = evt => {
      const request = JSON.parse(evt.target['result']);
      this._searchForm.setValue({keywords: request.keywords});
      this._loadResults(request);
      this._requestAlreadyLoaded = true;
    };
    reader.onerror = evt => {
      console.log('error reading file');
    };
  }

  public saveRequest() {
    if (this._requestId) {
      this._searchService.saveMetadataRequest(this._requestId).pipe(first()).subscribe((result: any) => {
        this._translateNotificationsService.success("ERROR.SUCCESS", "ERROR.CAMPAIGN.SEARCH.REQUEST_SAVED");
      });
    } else {
      this._translateNotificationsService.error("ERROR.ERROR", "ERROR.CAMPAIGN.SEARCH.NO_REQUEST");
    }
  }

  public selectCountry(country: string) {
    this._selectedCountry = country;
    this._loadPros(12, 12);
  }

  public resetCountry() {
    this._selectedCountry = null;
    this._loadPros(12, 12);
  }

  public getCompanyUrl(domain: string): string {
    return `http://${domain}`;
  }


  get searchForm(): FormGroup {
    return this._searchForm;
  }

  get slicedPros(): Array<any> {
    return this._slicedPros;
  }

  get searchResult(): SearchTool {
    return this._searchResult;
  }

  get searchStarted(): boolean {
    return this._searchStarted;
  }

  get searchStopped(): boolean {
    return this._searchStopped;
  }

  get professionalCount(): number {
    return this._professionalCount;
  }

  get scale(): Array<number>{
    return this._scale;
  }

  get selectedCountry(): string{
    return this._selectedCountry;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

}

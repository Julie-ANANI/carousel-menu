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

  constructor(private _translateTitleService: TranslateTitleService,
              private _formBuilder: FormBuilder,
              private _searchService: SearchService,
              private _authService: AuthService,
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
          this._requestId = result._id;
          this._searchResult.metadata = result.metadata || {};
          this._searchResult.pros = result.pros;
          this._scale = result.scale || [50, 200, 1500];
          this._updateResults();
        }, () => {
          this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
        });

      }
    }

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
    let duration = 2000 / total;
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
        this._loadPros(12, 12);
        clearInterval(interval);
      }
      else  {
        self._professionalCount + increment > total ? self._professionalCount = total : self._professionalCount += increment;
      }
    }, duration);

  }


  private _loadPros(displayLimit: number, loadLimit: number) {
    this._slicedPros = this._searchResult.pros.slice(0, displayLimit);

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

    if (professional.person) {

      if (!professional.person.company) {
        professional.person.company = '';
      }

      if (!professional.person.email) {
        professional.person.email = `${professional.person.firstName.toLowerCase()}.${professional.person.lastName.toLowerCase()}@${professional.person.companyDomain || "unknown.com"}`;
      }

      if(professional.person.companyDomain) {
        professional.person.companyLogoUrl = `https://logo.clearbit.com/${professional.person.companyDomain}?size=240`;
      }

      setTimeout(() => {
        professional.isLoading = false;
        this._slicedPros[index] = professional;
      }, Math.floor(Math.random() * 2000) + 1000);

    }

  }

  public onClickMenu() {
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'Advanced Search',
      size: '300px'
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

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

}

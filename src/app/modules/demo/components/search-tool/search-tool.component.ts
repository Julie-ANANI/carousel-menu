import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { SearchService } from '../../../../services/search/search.service';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { SearchTool } from '../../../../models/search-tool';

@Component({
  selector: 'app-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.scss']
})

export class SearchToolComponent implements OnInit{

  private _searchForm: FormGroup;

  private _slicedPros: Array<any> = [];

  private _continentTarget = {
    "americaSud": true,
    "americaNord": true,
    "europe": true,
    "russia": true,
    "asia": true,
    "oceania": true,
    "africa": true
  };

  private _searchResult: SearchTool = {};

  private _noResult = true;

  private _searchStarted = false;

  private _searchContinue = false;

  private _searchStopped = false;

  private _professionalCount: number = 0;

  constructor(private _translateTitleService: TranslateTitleService,
              private _formBuilder: FormBuilder,
              private _searchService: SearchService,
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
      // this.actualPros = [];
      this._slicedPros = [];
      this._searchResult = {};

      this._searchService.metadataSearch(keywords).pipe(first()).subscribe((result: any) => {
        this._searchStarted = true;
        this._searchStopped = false;
        this._searchResult.metadata = result.metadata || {};
        this._searchResult.pros = result.pros;

        this._searchResult.pros = this._searchResult.pros.map(pro => {
          pro.isLoading = true;
          return pro;
        });

        setTimeout(() => {
          this._noResult = false;
          this._searchContinue = true;
          this._totalProfessional(this._searchResult.metadata.world);
        }, 2005);

      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });


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
        this._loadPros(0, 12);
        clearInterval(interval);
      }
      else  {
        self._professionalCount + increment > total ? self._professionalCount = total : self._professionalCount += increment;
      }
    }, duration);

  }


  private _loadPros(startLimit: number, endLimit: number) {
    this._searchResult.pros.slice(startLimit, endLimit).forEach((professional, index) => {
      this._slicedPros.push(professional);
      this._formatPro(professional, index);
    });
  }


  public onClickSeeMore() {
    if (this._slicedPros.length < this._searchResult.pros.length) {
      const dif = this._searchResult.pros.length - this._slicedPros.length;
      const start = this._slicedPros.length;
      let end = this._slicedPros.length;

      if (dif >= 12) {
        end += 12;
      } else {
        end += end;
      }

      this._loadPros(start, end);

    }
  }


  private _formatPro(professional: any, index: number) {

    if (!professional.person.company) {
      professional.person.company = '';
    }

    if (!professional.person.email) {

      if(!professional.person.companyDomain) {
        professional.person.companyDomain = "unknown.com";
      }

      professional.person.email = `${professional.person.firstName.toLowerCase()}.${professional.person.lastName.toLowerCase()}@${professional.person.companyDomain}`;

    }

    if(professional.person.companyDomain && professional.person.companyDomain != "unknown.com") {
      professional.person.company.logoUrl = `https://logo.clearbit.com/${professional.person.company.domain}?size=240`;
    }

    setTimeout(() => {
      professional.isLoading = false;
      this._slicedPros[index] = professional;
    }, Math.floor(Math.random() * 2000) + 1000);

  }

  get searchForm(): FormGroup {
    return this._searchForm;
  }

  get slicedPros(): Array<any> {
    return this._slicedPros;
  }

  get continentTarget(): { africa: boolean; russia: boolean; americaSud: boolean; oceania: boolean; asia: boolean; americaNord: boolean; europe: boolean } {
    return this._continentTarget;
  }

  get searchResult(): SearchTool {
    return this._searchResult;
  }

  get noResult(): boolean {
    return this._noResult;
  }

  get searchStarted(): boolean {
    return this._searchStarted;
  }

  get searchContinue(): boolean {
    return this._searchContinue;
  }

  get searchStopped(): boolean {
    return this._searchStopped;
  }

  get professionalCount(): number {
    return this._professionalCount;
  }

}

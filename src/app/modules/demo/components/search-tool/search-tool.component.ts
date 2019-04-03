import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { SearchService } from '../../../../services/search/search.service';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { SearchTool } from '../../../../models/search-tool';
import { pros_sample } from '../../../../models/static-data/pros_sample';

@Component({
  selector: 'app-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.scss']
})

export class SearchToolComponent implements OnInit{

  searchForm: FormGroup;

  // actualPros: Array<any> = pros_sample; // temp

  slicedPros: Array<any> = [];

  continentTarget = {
    "americaSud": true,
    "americaNord": true,
    "europe": true,
    "russia": true,
    "asia": true,
    "oceania": true,
    "africa": true
  };

  searchResult: SearchTool = {};

  noResult = true;

  searchStarted = false;

  searchContinue = false;

  searchStopped = false;

  professionalCount: number = 0;

  constructor(private _translateTitleService: TranslateTitleService,
              private _formBuilder: FormBuilder,
              private _searchService: SearchService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._translateTitleService.setTitle('Search Tool | UMI');

  }

  ngOnInit(): void {
    this._buildForm();

    // temp
    /*this.actualPros = this.actualPros.map(pro => {
      pro.isLoading = true;
      return pro;
    });*/

  }


  private _buildForm() {
    this.searchForm = this._formBuilder.group({
      keywords: [''],
    });
  }


  public onClickSearch() {
    const keywords = this.searchForm.get('keywords').value;

    if (keywords) {
      // this.actualPros = [];
      this.slicedPros = [];
      this.searchResult = {};

      this._searchService.metadataSearch(keywords).pipe(first()).subscribe((result: any) => {
        this.searchStarted = true;
        this.searchStopped = false;
        this.searchResult.metadata = result.metadata || {};
        this.searchResult.pros = pros_sample;
        // this.searchResult.pros = result.pros;

        this.searchResult.pros = this.searchResult.pros.map(pro => {
          pro.isLoading = true;
          return pro;
        });

        setTimeout(() => {
          this.noResult = false;
          this.searchContinue = true;
          this._totalProfessional(this.searchResult.metadata.world);
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
    this.professionalCount = 0;

    if (duration < 1) {
      increment = Math.round(1/duration);
      duration = 1;
    }

    const self = this;

    const interval = setInterval(() => {
      if ( self.professionalCount >= total) {
        this.searchStopped = true;
        this._loadPros(0, 12);
        clearInterval(interval);
      }
      else  {
        self.professionalCount + increment > total ? self.professionalCount = total : self.professionalCount += increment;
      }
    }, duration);

  }


  private _loadPros(startLimit: number, endLimit: number) {
    this.searchResult.pros.slice(startLimit, endLimit).forEach((professional, index) => {
      this.slicedPros.push(professional);
      this._formatPro(professional, index);
    });
  }


  public onClickSeeMore() {
    if (this.slicedPros.length < this.searchResult.pros.length) {
      const dif = this.searchResult.pros.length - this.slicedPros.length;
      const start = this.slicedPros.length;
      let end = this.slicedPros.length;

      if (dif >= 12) {
        end += 12;
      } else {
        end += end;
      }

      this._loadPros(start, end);

    }
  }


  // temp
  private _formatPro(professional: any, index: number) {

    if (!professional.person.company) {
      professional.person.company = {};
    }

    if (!professional.person.email) {

      if(!professional.person.company.domain) {
        professional.person.company.domain = "unknown.com";
      }

      professional.person.email = `${professional.person.firstName.toLowerCase()}.${professional.person.lastName.toLowerCase()}@${professional.person.company.domain}`;

    }

    if(professional.person.company.domain && professional.person.company.domain != "unknown.com") {
      professional.person.company.logoUrl = `https://logo.clearbit.com/${professional.person.company.domain}?size=240`;
    }

    setTimeout(() => {
      professional.isLoading = false;
      this.slicedPros[index] = professional;
    }, Math.floor(Math.random() * 2000) + 1000);

  }


/*  private _formatPro(professional: any, index: number) {

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
      professional.person.company.logoUrl = `https://logo.clearbit.com/${professional.person.companyDomain}`;
    }

    setTimeout(() => {
      professional.isLoading = false;
      this.slicedPros[index] = professional;
    }, Math.floor(Math.random() * 360));

  }*/


}

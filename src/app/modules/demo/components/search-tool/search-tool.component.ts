import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { SearchService } from '../../../../services/search/search.service';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { SearchTool } from '../../../../models/search-tool';
import { pros_sample } from '../../../../models/static-data/pros_sample';
import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('100ms', [
          animate('.10s ease-in-out', keyframes([
              style({ opacity: 0, transform: 'translateX(15%)', offset: 0 }),
              style({ opacity: 1, transform: 'translateX(0)',     offset: 1.0 }),
            ])
          )]
        ), { optional: true }),

      ])
    ])
  ]
})

export class SearchToolComponent implements OnInit{

  searchForm: FormGroup;

  professionals: Array<any> = [];

  continentTarget = {
    "americaSud": true,
    "americaNord": true,
    "europe": true,
    "russia": true,
    "asia": true,
    "oceania": true,
    "africa": true
  };

  metadata: SearchTool = {};

  noResult = true;

  searchStarted = false;

  searchContinue = false;

  searchStopped = false;

  professionalCount: number = 0;

  proLimit: number = 12;

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
    this.searchForm = this._formBuilder.group({
      keywords: [''],
    });
  }


  public onClickSearch() {
    const keywords = this.searchForm.get('keywords').value;

    if (keywords) {
      this.professionals = [];
      this.metadata = {};

      this._searchService.metadataSearch(keywords).pipe(first()).subscribe((result: any) => {
        this.searchStarted = true;
        this.searchStopped = false;
        this.metadata = result.metadata || {};
        this.metadata.person = result.pros;

        this.professionals = result.pros.map(pro => {
          pro.isLoading = true;
          return pro;
        });

        this.professionals = pros_sample;

        this.professionals = result.pros.map(pro => {
          pro.isLoading = true;
          return pro;
        });

        setTimeout(() => {
          this.noResult = false;
          this.searchContinue = true;
          this._totalProfessional(this.metadata.world);
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

        this.professionals = pros_sample.map(pro => {
          pro.isLoading = true;
          return pro;
        });

        this.professionals.forEach((professional, index) => {
          this._formatPro(professional, index);
        });

        clearInterval(interval);

      }
      else  {
        self.professionalCount + increment > total ? self.professionalCount = total : self.professionalCount += increment;
      }
    }, duration);

  }


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
      professional.person.company.logoUrl = `https://logo.clearbit.com/${professional.person.company.domain}?size=40`;
    }

    setTimeout(() => {
      professional.isLoading = false;
      this.professionals[index] = professional;
    }, index * 360);

  }


}

/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';


import { InnovationService } from './../../../../../services/innovation/innovation.service';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit {

  private _selectLangInput = 'en';
  private _infographics: any;
  private innoid = '599c0029719e572041aafe0d';

  private _configurations = {
    'relevantProblematic':{
      'fr': ['Non', 'Eventuellement', 'Oui', 'Cruciale'],
      'en': ['Non-existent', 'Possibly', 'Frequently', 'Critical']
    },
    'productAnsweringProblematic': {
      'en': ['No', 'Possibly', 'Likely', 'Yes'],
      'fr': ['Non', 'Partiellement', 'Bien', 'Très bien']
    },
    'productInterests': {
      'en': ['No – less relevant', 'Equivalent', 'Yes – A few advantages', 'Absolutely'],
      'fr': ['Non', 'Peut-être', 'Oui', 'Indiscutablement']
    },
    'interestOfProfessionals': {
      'en': ['They want to be a customer', 'They wish to participate in the development', 'They want to distribute the solution'],
      'fr': ['Ils souhaitent être client', 'Ils souhaitent participer au développement', 'Ils souhaitent distribuer la solution']
    }
  };

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      const innovationId = params['innovationId'] || this.innoid;
      this._selectLangInput = this._translateService.currentLang || this._translateService.getBrowserLang() || 'fr';
      this._innovationService.getInnovationSythesis(innovationId).subscribe(synthesis => {
        this._infographics = synthesis.infographics;
      });
    });
  }

  public getConfig(section:string): Array<any> {
    return this._configurations[section] || [];
  }

  public canShow(): boolean {
    return !!this._infographics;
  }

  get infographics(): any {
    return this._infographics;
  }
};

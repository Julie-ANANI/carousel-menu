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

  public canShow(): boolean {
    return !!this._infographics;
  }

  get infographics(): any {
    return this._infographics;
  }
};

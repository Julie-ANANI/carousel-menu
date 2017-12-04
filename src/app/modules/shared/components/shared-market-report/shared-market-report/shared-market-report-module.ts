/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../../../services/auth/auth.service';
import { InnovationService } from './../../../../../services/innovation/innovation.service';
import { PageScrollConfig } from 'ng2-page-scroll';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit {

  private _infographics: any;
  private _editionMode = true;
  private _showDetails = true;
  private _calculating = false;
  private _invention = null;
  private innoid = '599c0029719e572041aafe0d';
  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private modalAnswer: any;

  constructor(private _innovationService: InnovationService,
              private _route: ActivatedRoute,
              private _authService: AuthService
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.innoid = params['innovationId'] || this.innoid;
      this.modalAnswer = null;
      /*this._innovationService.getInnovationSythesis(this.innoid).subscribe(synthesis => {
        this._infographics = synthesis.infographics;
      });*/
      this._innovationService.get(this.innoid)
        .subscribe(invention => {
          this._invention = invention;
          this._infographics = invention.synthesis[0].infographics;
        }, error=>{
          //error => this._notificationsService.error('Error', error.message)
          console.log(error);
        });
    });
    PageScrollConfig.defaultDuration = 800;
  }

  public recalculateSynthesis(): any {
    this._calculating = true;
    this._innovationService.recalculateSynthesis(this.innoid).subscribe(synthesis => {
      this._calculating = false;
      this._infographics = synthesis.infographics;
    });
  }

  /**
   * Builds the data required to ask the API for a PDF
   * @returns {{projectId, innovationCardId}}
   */
  public dataBuilder(): any {
    return {
      projectId: this.innoid,
      title: `${this._invention.name}.pdf`
    }
  }

  public getModel (): any {
    return {
      lang: 'en',
      jobType: 'synthesis',
      labels: 'EXPORT.INNOVATION.SYNTHESIS',
      pdfDataseedFunction: this.dataBuilder()
    };
  }

  public toggleEditionMode(): any {
    this._editionMode = !this._editionMode;
  }

  public toggleDetails(): any {
    this._showDetails = !this._showDetails;
  }

  public seeAnswer(answer: any) {
    this.modalAnswer = answer;
  }

  public canShow(): boolean {
    return !!this._infographics;
  }

  get infographics(): any {
    return this._infographics;
  }

  get invention(): any {
    return this._invention;
  }

  set calculating (value: boolean) {
    this._calculating = value;
  }

  get calculating (): boolean {
    return this._calculating;
  }

  set showDetails (value: boolean) {
    this.showDetails = value;
  }

  get showDetails (): boolean {
    return this._showDetails;
  }

  set editionMode (value: boolean) {
    this._editionMode = value;
  }

  get editionMode (): boolean {
    return this._editionMode;
  }

  get authService (): AuthService {
    return this._authService;
  }
};

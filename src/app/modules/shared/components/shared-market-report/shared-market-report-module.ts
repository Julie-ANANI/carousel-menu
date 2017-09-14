/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { NgClass } from '@angular/common';
import * as _ from "lodash";


import { InnovationService } from "./../../../../services/innovation/innovation.service";

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.styl', './shared-market-report.component-popover.styl']
})

export class SharedMarketReportComponent implements OnInit {

  private _selectLangInput = 'en';
  private _detailsExpanded: boolean;

  private _infographics: any;
  private _showDetails: any;
  private _maxCountScore: number;

  private _configurations = {
    "relevantProblematic":{
      "fr": ['Non', 'Eventuellement', 'Oui', 'Cruciale'],
      "en": ['Non-existent', 'Possibly', 'Frequently', 'Critical']
    },
    "productAnsweringProblematic": {
      "en": ['No', 'Possibly', 'Likely', 'Yes'],
      "fr": ['Non', 'Partiellement', 'Bien', 'Très bien']
    },
    "productInterests": {
      "en": ['No – less relevant', 'Equivalent', 'Yes – A few advantages', 'Absolutely'],
      "fr": ['Non', 'Peut-être', 'Oui', 'Indiscutablement']
    },
    "interestOfProfessionals": {
      "en": ['They want to be a customer', 'They wish to participate in the development', 'They want to distribute the solution'],
      "fr": ['Ils souhaitent être client', 'Ils souhaitent participer au développement', 'Ils souhaitent distribuer la solution']
    }
  };

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              ) { }

  ngOnInit() {
    this._detailsExpanded = false;
    this._selectLangInput = this._translateService.currentLang || this._translateService.getBrowserLang() || 'fr';
    this._innovationService.getInnovationSythesis("59ae4e1ff560630254dac7b9").subscribe(synthesis => {
      this._infographics = synthesis.infographics;
      // Calcul du score max
      this._maxCountScore = _.max(_.map(this._infographics.scores, function(score){ return score['count']; } ));
    });
    this._showDetails = { //TODO change to the right default
      "professionals": true,
      "relevantProblematic": true,
      "productAnsweringProblematic": true,
      "productInterests": true,
      "interestOfProfessionals": true,
      "partners": true,
      "competitors": true,
      "prices": true,
      "commentsPositive": true,
      "commentsNegative": true,
      "applications": true
    }
  }

  public toggleSections(){
    let self = this;
    _.forEach(this._showDetails, function(detail, key){
      self[key] = !detail;
    })
  }

  public getProfessionals(personsList:Array<any>): Array<any> {
    if (this._infographics && this._infographics.professionals) {
      let pros = this._infographics.professionals;
      return _.map(personsList, function (person) {
        return _.find(pros, '_id', person.professionalId);
      });
    } else {
      return [];
    }
  }

  public getFillPerc(value: number): string {
    return `${Math.round(value / this._maxCountScore * 100)}%`;
  }

  public getLevels(section:string, lang:string): Array<any> {
    return this._configurations[section][lang] || [];
  }

  public seeAnswer(professional: any) { //TODO modal
    console.log("OKAY");
  }

  public getFlag(country: string): string {
    return `/assets/flags/${country}.png`;
  }

  public showDetails(param: string): boolean {
    return !!this._showDetails[param];
  }

  public toggleDetails(param: string) {
    this._showDetails[param] = !this._showDetails[param];
  }

  public canShow(): boolean {
    return !!this._infographics;
}

  get infographics(): any {
    return this._infographics;
  }

  get detailsExpanded(): boolean {
    return this._detailsExpanded;
  }

  set detailsExpanded(value: boolean) {
    this._detailsExpanded = value;
  }


};

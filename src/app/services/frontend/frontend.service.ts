import { Injectable } from '@angular/core';
import { Innovation } from '../../models/innovation';
import { Subject } from 'rxjs/Subject';

export interface Values {
  settingPercentage?: number;
  innovationCardsPercentage?: Array<{
    lang: string,
    percentage: number
  }>;
  totalPercentage?: number;
}

@Injectable()
export class FrontendService {
  calculatedPercentages = new Subject<Values>();

  totalFieldsPresent: number;
  totalFieldsRequired: number;

  settingsFieldsRequired: number;
  settingsFieldsPresent: number;

  projectFieldsRequired: number;

  innovCardFieldsRequired: number;
  innovCardFieldsPresent: number;

  calculatedValues: Values = {};

  constructor() {}

  completionCalculation(project: Innovation) {
    this.projectFieldsRequired = 0;
    this.settingsFieldsRequired = 0;
    this.settingsFieldsPresent = 0;
    this.innovCardFieldsRequired = 0;
    this.innovCardFieldsPresent = 0;
    this.totalFieldsPresent = 0;
    this.calculatedValues.innovationCardsPercentage = [];

    /*
      method to calculate the percentage at project level.
     */
    this.projectLevel(project);

    /*
      method to calculate the percentage in project settings.
     */
     this.settingLevel(project);

    /*
      method to calculate the percentage in innovationCard.
     */
    this.innovCardLevel(project);

    this.totalFieldsRequired = this.projectFieldsRequired + this.settingsFieldsRequired + this.innovCardFieldsRequired;

    /*
      now calculating the total project completion percentage.
     */
    this.calculatedValues.totalPercentage = (this.totalFieldsPresent * 100) / this.totalFieldsRequired;

    this.calculatedPercentages.next(this.calculatedValues);

  }


  /*
    Here we are calculating the values that we have at project level
    and we are checking that are field or not.
  */

  projectLevel(value: Innovation) {
    this.projectFieldsRequired = 3;

    if (value.external_diffusion !== null) {
      this.totalFieldsPresent++;
    }

    if (value.projectStatus !== null) {
      this.totalFieldsPresent++;
    }

    if (value.patented !== null) {
      this.totalFieldsPresent++;
    }

  }

  /*
    Here we are calculating the values that are in targeting page i.e. settings.
    For the moment two fields are required.
   */

  settingLevel(value: Innovation) {
    this.settingsFieldsRequired = 2;

    if (value.settings.market.comments.length) {
      this.totalFieldsPresent++;
      this.settingsFieldsPresent++;
    }

    if (value.settings.geography.exclude.length || value.settings.geography.comments.length || value.settings.geography.continentTarget.russia
      || value.settings.geography.continentTarget.oceania || value.settings.geography.continentTarget.europe || value.settings.geography.continentTarget.asia
      || value.settings.geography.continentTarget.americaSud || value.settings.geography.continentTarget.americaNord
      || value.settings.geography.continentTarget.africa) {
      this.totalFieldsPresent++;
      this.settingsFieldsPresent++;
    }

    /*
      calculating the percentage at setting level.
     */
    this.calculatedValues.settingPercentage = (this.settingsFieldsPresent * 100) / this.settingsFieldsRequired;

  }

  /*
    Here we are calculating the values that are present in different innovation card.
    For the moment 5 fields are required.
   */
  innovCardLevel(value: Innovation) {
    this.innovCardFieldsRequired = 5 * value.innovationCards.length;

    for (let i = 0; i < value.innovationCards.length; i++) {

      if (value.innovationCards[i].title.length) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].summary.length) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].problem.length) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].solution.length) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].advantages.length) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      this.calculatedValues.innovationCardsPercentage.push({
        lang: value.innovationCards[i].lang,
        percentage: (this.innovCardFieldsPresent * 100) / 5
      });

      this.innovCardFieldsPresent = 0;

    }

  }

    getProjectCompletedValues(): Subject<Values> {
      return this.calculatedPercentages;
    }


  }

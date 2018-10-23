import { Injectable } from '@angular/core';
import { Innovation } from '../../models/innovation';

export interface Values {
  settingPercentage?: number;
  innovationCardsPercentage?: Array<{
    lang: string,
    percentage: number
  }>;
  totalPercentage?: number;
}

export interface InnovationMetadataValues {
  preparation?: number;
  campaign?: number;
  delivery?: number;
}

@Injectable()
export class FrontendService {
  totalFieldsPresent: number;
  totalFieldsRequired: number;

  settingsFieldsRequired: number;
  settingsFieldsPresent: number;

  projectFieldsRequired: number;

  innovCardFieldsRequired: number;
  innovCardFieldsPresent: number;

  private _calculatedValues: Values = {};

  private _innovationMetadataCalculatedValues = {};

  constructor() {}

  /*
    We are calculating the percentage for the project.
   */
  completionCalculation(project: Innovation) {
    this.projectFieldsRequired = 0;
    this.settingsFieldsRequired = 0;
    this.settingsFieldsPresent = 0;
    this.innovCardFieldsRequired = 0;
    this.innovCardFieldsPresent = 0;
    this.totalFieldsPresent = 0;
    this._calculatedValues.innovationCardsPercentage = [];

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
    this._calculatedValues.totalPercentage = (this.totalFieldsPresent * 100) / this.totalFieldsRequired;

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
    this._calculatedValues.settingPercentage = (this.settingsFieldsPresent * 100) / this.settingsFieldsRequired;

  }

  /*
    Here we are calculating the values that are present in different innovation card.
    For the moment 5 fields are required.
   */
  innovCardLevel(value: Innovation) {
    this.innovCardFieldsRequired = 5 * value.innovationCards.length;

    for (let i = 0; i < value.innovationCards.length; i++) {

      if (value.innovationCards[i].title) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].summary) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].problem) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].solution) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].advantages) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      this._calculatedValues.innovationCardsPercentage.push({
        lang: value.innovationCards[i].lang,
        percentage: (this.innovCardFieldsPresent * 100) / 5
      });

      this.innovCardFieldsPresent = 0;

    }

  }

  /*
    Return the completion percentage of a project section (preparation, campaign or delivery)
   */
  calculateInnovationMetadataPercentages(project: Innovation, level: string) {
    if (project._metadata[level] !== undefined) {
      const keys = Object.keys(project._metadata[level]) || [];
      this._innovationMetadataCalculatedValues[level] = (((keys.filter(value => project._metadata[level][value] === true).length) * 100) / keys.length);
    } else {
      this._innovationMetadataCalculatedValues[level] = 0;
    }
  }

  get innovationMetadataCalculatedValues(): InnovationMetadataValues {
    return this._innovationMetadataCalculatedValues;
  }

  get calculatedPercentages(): Values {
    return this._calculatedValues;
  }



  /***
   * This function is to calculate the percentage of the analytics that has been used
   * in Exploration and Synthesis page.
   * @param {number} value1
   * @param {number} value2
   * @returns {number}
   */
  analyticPercentage(value1: number, value2: number) {
    if (value2 === 0 || value2 === undefined) {
      return 0;
    } else {
      const percentage = (value2 / value1) * 100;
      return percentage === Infinity ? 0 : Math.floor(percentage);
    }
  }

  /*

   */
  compareObject(object1: any, object2: any): boolean {

    if (typeof (object1) !== typeof (object2)) {
      return true;
    }

    if (Object.keys(object1).length !== Object.keys(object2).length) {
      return true;

    }

    for (const key of Object.keys(object1)) {

      for (const key2 of Object.keys(object2)) {

        if (key === key2) {

          if (typeof (object2[key]) !== typeof (object1[key])) {
            return true;
          }

          if (object1[key] instanceof Object && object2[key] instanceof Object) {
            this.compareObject(object1[key], object2[key]);
          } else if (object1[key] instanceof Array && object2[key] instanceof Array) {
            const changeValue = object1[key].filter((item: any) => {
              object2[key].indexOf(item < 0);
            });

            if (changeValue.length > 0) {
              return true;
            }

          } else {
            if (JSON.stringify(object1[key]) !== JSON.stringify(object2[key])) {
              return true;
            }
          }

        }

      }

    }

    return false;
  }

}

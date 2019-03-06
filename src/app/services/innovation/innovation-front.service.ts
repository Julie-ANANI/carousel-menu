/***
 * This service is used to perform all the innovation related
 * cross component communication in the app.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Innovation } from '../../models/innovation';

export interface Values {
  settingPercentage?: number;
  innovationCardsPercentage?: Array<{
    lang: string,
    percentage: number
  }>;
  totalPercentage?: number;
}

@Injectable()
export class InnovationFrontService {

  totalFieldsPresent: number;

  totalFieldsRequired: number;

  settingsFieldsRequired: number;

  settingsFieldsPresent: number;

  projectFieldsRequired: number;

  innovCardFieldsRequired: number;

  innovCardFieldsPresent: number;

  private _calculatedValues: Values = {};

  selectedInnovationIndex = new Subject<number>();

  saveNotifySubject = new Subject<boolean>();

  private _defaultInnovation = new BehaviorSubject({});

  getInnovation = this._defaultInnovation.asObservable();

  constructor() { }


  /***
   * these function is to set the innovation object.
   * @param innovation
   */
  setInnovation(innovation: Innovation) {
    this._defaultInnovation.next(innovation);
  }


  /***
   * these function is to set and get selected innovation index.
   * @param value
   */
  setSelectedInnovationIndex(value: number) {
    this.selectedInnovationIndex.next(value);
  }

  getSelectedInnovationIndex(): Subject<number> {
    return this.selectedInnovationIndex;
  }


  /***
   * this function is called when there are some changes and we want to notify
   * in the component that changes are to be saved or not.
   * @param value
   */
  setNotifyChanges(value: boolean) {
    this.saveNotifySubject.next(value);
  }

  getNotifyChanges(): Subject<boolean> {
    return this.saveNotifySubject;
  }


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


  /***
   * this function is to return the color based on the length and limit.
   * @param length
   */
  getColor(length: number, limit: number): string {
    if (length <= 0) {
      return '#EA5858';
    } else if (length > 0 && length < (limit/2)) {
      return '#F0AD4E';
    } else {
      return '#2ECC71';
    }
  }


  get defaultInnovation(): BehaviorSubject<{}> {
    return this._defaultInnovation;
  }

  get calculatedPercentages(): Values {
    return this._calculatedValues;
  }

}


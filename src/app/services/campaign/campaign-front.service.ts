import { Injectable } from '@angular/core';

@Injectable()
export class CampaignFrontService {

  constructor() { }


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

}

import { Injectable } from '@angular/core';
import { Answer } from '../../models/answer';
import { Campaign } from '../../models/campaign';
import { Subject}  from 'rxjs';

@Injectable()
export class CampaignFrontService {

  campaignSubject = new Subject<Campaign>();

  constructor() { }


  /***
   * this function is to called to set the campaign object
   * so that we can have same object in every child component.
   * @param campaign
   */
  setCampaign(campaign: Campaign) {
    this.campaignSubject.next(campaign);
  }


  /***
   * this function is to get the value of set campaign after setting
   * the campaign object.
   */
  getCampaign(): Subject<Campaign> {
    return this.campaignSubject;
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


  /***
   * this function is to calculate the campaign stat for the answers component in the
   * campaign component.
   * @param answers
   * @param requestFor
   * @param searchKey
   */
  getAnswerCampaignStat(answers: Array<Answer>, requestFor: string, searchKey: any): number  {
    let value = 0;

    if (answers.length > 0) {

      answers.forEach((answer: Answer) => {
        switch (requestFor) {

          case 'status':
            if (answer.status === searchKey) {
              value += 1;
            }
            break;

          case 'profile':
            if (answer.profileQuality === searchKey) {
              value += 1;
            }
            break;

          case 'quality':
            if (answer.time_elapsed) {
              value += Math.floor(answer.time_elapsed / 60);
            }
            break;

          default:
          // do nothing...

        }

      });

      if (searchKey === 'time_elapsed' ) {
        value = Math.floor(value / answers.length);
      }

    }

    return value
  }


  /***
   * this function is to calculate the campaign stat for the pros and quiz component in the
   * campaign component.
   * @param campaign
   * @param searchKey
   */
  getProsCampaignStat(campaign: Campaign, searchKey: any): number {
    let value = 0;

    if (campaign && campaign.stats) {
      switch (searchKey) {

        case 'professional':
          value = campaign.stats.nbPros;
          break;

        case 'notReached':
          value = Math.round(((campaign.stats.nbPros - campaign.stats.nbProsSent) / campaign.stats.nbPros) * 100);
          break;

        case 'good':
          value = Math.round((campaign.stats.campaign.nbFirstTierMails / campaign.stats.nbPros) * 100);
          break;

        case 'unsure':
          value = Math.round((campaign.stats.campaign.nbSecondTierMails / campaign.stats.nbPros) * 100);
          break;

        case 'bad':
          value = Math.round(((campaign.stats.nbPros - (campaign.stats.campaign.nbFirstTierMails + campaign.stats.campaign.nbSecondTierMails ))/ campaign.stats.nbPros) * 100);
          break;

        default:
        // do nothing...

      }
    }

    return isNaN(value) ? 0 : value;
  }


  /***
   * this function is to calculate the campaign stat for the workflows and batch component in the
   * campaign component.
   * @param campaign
   * @param searchKey
   */
  getBatchCampaignStat(campaign: Campaign, searchKey: any): number {
    let value = 0;

    if (campaign && campaign.stats) {
      switch (searchKey) {

        case 'good_emails':
          value = campaign.stats.campaign.nbFirstTierMails;
          break;

        case 'received':
          value = campaign.stats.nbProsSent;
          break;

        case 'bounces':
          value = campaign.stats.nbTotalMails - campaign.stats.nbProsSent;
          break;

        case 'opened':
          value = Math.round((campaign.stats.nbProsOpened / campaign.stats.nbProsSent) * 100);
          break;

        case 'clicked':
          value = Math.round((campaign.stats.nbProsClicked / campaign.stats.nbProsSent) * 100);
          break;

        case 'email':
          value = campaign.stats.nbProsOpened;
          break;

        case 'questionnaire':
          value = campaign.stats.nbProsClicked;
          break;

      }
    }

    return isNaN(value) ? 0 : value;
  }


}

import { Injectable } from '@angular/core';
import { Answer } from '../../models/answer';
import { Campaign } from '../../models/campaign';

@Injectable()
export class CampaignFrontService {

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
            if (Array.isArray(searchKey) && searchKey.indexOf(answer.status) !== -1) {
              value += 1;
            } else {
              if (answer.status === searchKey) {
                value += 1;
              }
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

    return value;
  }

  /***
   * this function is to calculate the campaign stat for the pros and quiz component in the
   * campaign component.
   * @param campaign
   * @param searchKey
   */
  static getProsCampaignStat(campaign: Campaign, searchKey: any): number {
    let value = 0;

    if(campaign && campaign.stats) {
      switch (searchKey) {

        case 'professional':
          value = campaign.stats.nbPros ? campaign.stats.nbPros : 0;
          break;

        case 'notReached':
          value = campaign.stats.nbPros && campaign.stats.nbProsSent ? Math.round(((campaign.stats.nbPros - campaign.stats.nbProsSent) / campaign.stats.nbPros) * 100) : 0;
          break;

        case 'good':
          value = campaign.stats.campaign && campaign.stats.campaign.nbFirstTierMails && campaign.stats.nbPros ? Math.round((campaign.stats.campaign.nbFirstTierMails / campaign.stats.nbPros) * 100) : 0;
          break;

        case 'unsure':
          value = campaign.stats.campaign && campaign.stats.campaign.nbSecondTierMails && campaign.stats.nbPros ? Math.round((campaign.stats.campaign.nbSecondTierMails / campaign.stats.nbPros) * 100): 0;
          break;

        case 'bad':
          value = campaign.stats.nbPros && campaign.stats.campaign && campaign.stats.campaign.nbFirstTierMails && campaign.stats.campaign.nbSecondTierMails ?
            Math.round(((campaign.stats.nbPros - (campaign.stats.campaign.nbFirstTierMails + campaign.stats.campaign.nbSecondTierMails ))/ campaign.stats.nbPros) * 100) : 0;
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
  static getBatchCampaignStat(campaign: Campaign, searchKey: any): number {
    let value = 0;

    if (campaign && campaign.stats) {
      switch (searchKey) {

        case 'good_emails':
          value = campaign.stats.campaign.nbFirstTierMails ? campaign.stats.campaign.nbFirstTierMails : 0;
          break;

        case 'received':
          value = campaign.stats.nbProsSent ? campaign.stats.nbProsSent : 0;
          break;

        case 'bounces':
          value = campaign.stats.nbTotalMails && campaign.stats.nbProsSent? campaign.stats.nbTotalMails - campaign.stats.nbProsSent : 0;
          break;

        case 'opened':
          value = campaign.stats.nbProsOpened  && campaign.stats.nbProsSent ? Math.round((campaign.stats.nbProsOpened / campaign.stats.nbProsSent) * 100) : 0;
          break;

        case 'clicked':
          value = campaign.stats.nbProsClicked  && campaign.stats.nbProsSent ? Math.round((campaign.stats.nbProsClicked / campaign.stats.nbProsSent) * 100) : 0;
          break;

        case 'email':
          value = campaign.stats.nbProsOpened ? campaign.stats.nbProsOpened : 0;
          break;

        case 'questionnaire':
          value = campaign.stats.nbProsClicked ?  campaign.stats.nbProsClicked : 0;
          break;

      }
    }

    return isNaN(value) ? 0 : value;
  }


}

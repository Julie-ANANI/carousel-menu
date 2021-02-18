import { Injectable } from '@angular/core';
import { Answer } from '../../models/answer';
import { Campaign } from '../../models/campaign';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CampaignFrontService {

  private _allCampaigns: Subject<Array<Campaign>> = new Subject<Array<Campaign>>();

  private _activeCampaign: Subject<Campaign> = new Subject<Campaign>();

  private _activeCampaignTab: Subject<string> = new Subject<string>();

  private _showCampaignTabs: Subject<boolean> = new Subject<boolean>();

  private _loadingCampaign: Subject<boolean> = new Subject<boolean>();

  /***
   * this function is to calculate the campaign stat for the answers component in the
   * campaign component.
   * @param answers
   * @param requestFor
   * @param searchKey string | number
   */
  public static answerStat(answers: Array<Answer>, requestFor: string, searchKey: any): number {
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
  static getBatchCampaignStat(campaign: Campaign, searchKey: string): number {
    let value = 0;

    if (campaign && campaign.stats && campaign.stats.campaign) {
      switch (searchKey) {

        case 'good_emails':
          value = campaign.stats.campaign.nbFirstTierMails || 0;
          break;

        case 'received':
          value = campaign.stats.nbProsReceived || 0;
          break;

        case 'bounces':
          value = campaign.stats.nbProsReceived && campaign.stats.nbProsSent
            ? campaign.stats.nbProsSent - campaign.stats.nbProsReceived : 0;
          break;

        case 'opened':
          value = campaign.stats.nbProsReceived  && campaign.stats.nbProsOpened
            ? Math.round((campaign.stats.nbProsOpened / campaign.stats.nbProsReceived) * 10000) / 100 : 0;
          break;

        case 'clicked':
          value = campaign.stats.nbProsClicked  && campaign.stats.nbProsOpened
            ? Math.round((campaign.stats.nbProsClicked / campaign.stats.nbProsOpened) * 10000) / 100 : 0;
          break;

        case 'answer_rate':
          value = campaign.stats.campaign.nbValidatedResp  && campaign.stats.nbProsReceived
            ? Math.round((campaign.stats.campaign.nbValidatedResp / campaign.stats.nbProsReceived) * 10000) / 100 : 0;
          break;

        case 'email':
          value = campaign.stats.nbProsOpened || 0;
          break;

        case 'questionnaire':
          value = campaign.stats.nbProsClicked || 0;
          break;

        default:
          console.log('Defaulting at campaign-front.service.ts')
      }
    }

    return isNaN(value) ? 0 : value;
  }

  /***
   * these function to set and get all the campaigns
   * @param value
   */
  public setAllCampaigns(value: Array<Campaign>) {
    this._allCampaigns.next(value);
  }

  public allCampaigns(): Subject<Campaign[]> {
    return this._allCampaigns;
  }

  /***
   * these function to set and get the active campaign
   * @param value
   */
  public setActiveCampaign(value: Campaign) {
    this._activeCampaign.next(value);
  }

  public activeCampaign(): Subject<Campaign> {
    return this._activeCampaign;
  }

  /***
   * these function to set and get the show campaign tabs
   * @param value
   */
  public setShowCampaignTabs(value: boolean) {
    this._showCampaignTabs.next(value);
  }

  public showCampaignTabs(): Subject<boolean> {
    return this._showCampaignTabs;
  }

  /***
   * these function to set and get the campaign active tab
   * @param value
   */
  public setActiveCampaignTab(value: string) {
    this._activeCampaignTab.next(value);
  }

  public activeCampaignTab(): Subject<string> {
    return this._activeCampaignTab;
  }

  /***
   * these function to set and get the campaign is loading
   * @param value
   */
  public setLoadingCampaign(value: boolean) {
    this._loadingCampaign.next(value);
  }

  public loadingCampaign(): Subject<boolean> {
    return this._loadingCampaign;
  }

}

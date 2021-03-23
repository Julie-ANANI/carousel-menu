import { Injectable } from '@angular/core';
import { Campaign } from '../../models/campaign';
import { environment } from '../../../environments/environment';

const proIdRegex = /^[a-f\d]{24}$/i;

@Injectable({providedIn: 'root'})
export class QuizService {

  constructor() { }

  /**
   * Builds the URL of a quiz given a campaign a lang and optionally a professional ID
   * @param campaign
   * @param lang
   * @param professionalId
   */
  public static getQuizUrl(campaign: Campaign, lang: string, professionalId?: string): string {
    if (campaign && campaign.innovation && campaign.innovation.quizId) {
      let url = `${environment.quizUrl}/quiz/${campaign.innovation.quizId}/${campaign._id}?lang=${lang}`;
      if (professionalId && professionalId.match(proIdRegex)) {
        url += `&pro=${professionalId}`;
      }
      return url;
    } else {
      return '';
    }
  }

  /***
   * build the quiz url based on the IDs.
   * @param campaignId
   * @param quizId
   * @param lang
   * @param professionalId
   */
  public static quizUrl(campaignId: string, quizId: string, lang: string, professionalId = ''): string {
    if (quizId && campaignId) {
      let url = `${environment.quizUrl}/quiz/${quizId}/${campaignId}?lang=${lang}`;
      if (professionalId && professionalId.match(proIdRegex)) {
        url += `&pro=${professionalId}`;
      }
      return url;
    }
    return '';
  }

}

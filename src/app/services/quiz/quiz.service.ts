import { Injectable } from '@angular/core';
import { Campaign } from '../../models/campaign';
import { environment } from '../../../environments/environment';

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
      if (professionalId && professionalId.match(/^[a-f\d]{24}$/i)) {
        url += `&pro=${professionalId}`;
      }
      return url;
    } else {
      return '';
    }
  }
}

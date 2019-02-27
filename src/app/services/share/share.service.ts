import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { InnovCard } from '../../models/innov-card';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ShareService {

  constructor(private _http: HttpClient) {}


  private _getShareUrl(innovationCard: InnovCard): string {
    return encodeURIComponent(`${environment.clientUrl}/discover/${innovationCard.innovation_reference}/${innovationCard.lang}`);
  }


  private _getTitle(innovationCard: InnovCard): string {
    return innovationCard.title || '';
  }


  private _getSummary(innovationCard: InnovCard): string {
    return innovationCard.summary || '';
  }


  shareSynthesis(projectId: string): Observable<any> {
    return this._http.post('/sharing', {id: projectId, type: 'synthesis'});
  }


  linkedinProjectShareLink(innovationCard: InnovCard): string {
    return 'https://www.linkedin.com/shareArticle' +
      '?mini=true' +
      '&url=' + this._getShareUrl(innovationCard) +
      '&title=' + this._getTitle(innovationCard) +
      '&summary=' + this._getSummary(innovationCard) +
      '&source=' + 'UMI';
  }


  twitterProjectShareLink(innovationCard: InnovCard): string {
    const twitterAccount = 'uMotionIdeas';
    return 'http://twitter.com/home' +
      '?status=' + this._getTitle(innovationCard) + '%20' + this._getShareUrl(innovationCard) + '%20%40' + twitterAccount;
  }


  facebookProjectShareLink(innovationCard: InnovCard): string {
    return 'https://www.facebook.com/dialog/feed' +
      '?app_id=' + '1172496952780763' +
      '&version=' + 'v2.12' +
      'display=popup' +
      '&link=' + this._getShareUrl(innovationCard);
  }

  /*public googleProjectShareLink (project: Innovation, lang: string): string {
    lang = lang || 'en';
    return 'https://plus.google.com/share?url=' + this._getShareUrl(project, lang) + '&text=' + this._getSummary(project, lang);
  }*/


  mailProjectShareLink(innovationCard: InnovCard): string {

    const message = encodeURI(`Please add your message here.\r\n\r\n-------------------------------------\r\nInnovation Details: \r\n\r\nURL - ${environment.clientUrl}/discover/${innovationCard.innovation_reference}/${innovationCard.lang}\r\n\r\nTitle - ${this._getTitle(innovationCard)}\r\n\r\nSummary - ${this._getSummary(innovationCard)}`);

    return `mailto:?subject=Interesting Innovation - ${this._getTitle(innovationCard)}&body=${message}`;

  }


  contactOperator(innovationCard: InnovCard, operatorEmail: string): string {

    const message = encodeURI(`Please add your message here.\r\n\r\n-------------------------------------\r\nInnovation Details: \r\n\r\nURL - ${environment.clientUrl}/discover/${innovationCard.innovation_reference}/${innovationCard.lang}\r\n\r\nTitle - ${this._getTitle(innovationCard)}\r\n\r\nSummary - ${this._getSummary(innovationCard)}`);

    return `mailto:${operatorEmail}?subject=Contacting us - ${this._getTitle(innovationCard)}&body=${message}`;

  }

}

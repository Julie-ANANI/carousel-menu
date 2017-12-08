import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';

@Injectable()
export class ShareService {

  constructor() {}

  private _getShareUrl (project: any): string {
    return encodeURIComponent(`${environment.innovationUrl}/#/projects/${project._id}`);
  }

  private _getTitle (project: any, lang: string): string {
    const innovationCard = _.find(project.innovationCards, card => card['lang'] == lang);
    if (innovationCard) {
      return encodeURIComponent(innovationCard['title']);
    }
    return '';
  }

  private _getSummary (project: any, lang: string): string {
    const innovationCard = _.find(project.innovationCards, card => card['lang'] == lang);
    if (innovationCard) {
      return encodeURIComponent(innovationCard['summary']);
    }
    return '';
  }

  public linkedinProjectShareLink (project: any, lang: string): string {
    lang = lang || 'en';
    return 'http://www.linkedin.com/shareArticle' +
      '?mini=true' +
      '&url=' + this._getShareUrl(project) +
      '&title=' + this._getTitle(project, lang) +
      '&summary=' + this._getSummary(project, lang) +
      '&source=' + 'UMI'; // En changeant, ne pas oublier de transformer en URL avec encodeURIComponent()
  }

  public twitterProjectShareLink (project: any, lang: string): string {
    lang = lang || 'en';
    const twitterAccount = 'uMotionIdeas';
    return 'http://twitter.com/home' +
      '?status=' + this._getTitle(project, lang) + '%20' + this._getShareUrl(project) + '%20%40' + twitterAccount;
  }

  public facebookProjectShareLink (project: any): string {
    return 'https://www.facebook.com/dialog/feed' +
      '?app_id=' + '1172496952780763' +
      '&version=' + 'v2.4' +
      'display=popup' +
      '&link=' + this._getShareUrl(project);
  }

  public mailProjectShareLink (project: any, lang: string) {
    lang = lang || 'en';
    return `mailto:?body=${this._getSummary(project, lang)}%0A${this._getShareUrl(project)}&subject=${this._getTitle(project, lang)}`
  }
}

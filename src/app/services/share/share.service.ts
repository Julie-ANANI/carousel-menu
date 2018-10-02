import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Innovation } from '../../models/innovation';
import { InnovCard } from '../../models/innov-card';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import {Http, Response} from '../http';

@Injectable()
export class ShareService {

  constructor(private _http: Http) {}

  private _getShareUrl (project: Innovation): string {
    return encodeURIComponent(`${environment.innovationUrl}/projects/${project._id}`);
  }

  private _getTitle (project: Innovation, lang: string): string {
    const innovationCard = _.find(project.innovationCards, (card: InnovCard) => card['lang'] === lang);
    if (innovationCard) {
      return encodeURIComponent(innovationCard['title'] || '');
    }
    return '';
  }

  private _getSummary (project: Innovation, lang: string): string {
    const innovationCard = _.find(project.innovationCards, (card: InnovCard) => card['lang'] === lang);
    if (innovationCard) {
      return encodeURIComponent(innovationCard['summary'] || '');
    }
    return '';
  }

  public shareSynthesis(projectId: string): Observable<any> {
    return this._http.post('/sharing', {id: projectId, type: 'synthesis'})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public linkedinProjectShareLink (project: Innovation, lang: string): string {
    lang = lang || 'en';
    return encodeURI('http://www.linkedin.com/shareArticle' +
      '?mini=true' +
      '&url=' + this._getShareUrl(project) +
      '&title=' + this._getTitle(project, lang) +
      '&summary=' + this._getSummary(project, lang) +
      '&source=' + 'UMI'); // En changeant, ne pas oublier de transformer en URL avec encodeURIComponent()
  }

  public twitterProjectShareLink (project: Innovation, lang: string): string {
    lang = lang || 'en';
    const twitterAccount = 'uMotionIdeas';
    return 'http://twitter.com/home' +
      '?status=' + this._getTitle(project, lang) + '%20' + this._getShareUrl(project) + '%20%40' + twitterAccount;
  }

  public facebookProjectShareLink (project: Innovation): string {
    return 'https://www.facebook.com/dialog/feed' +
      '?app_id=' + '1172496952780763' +
      '&version=' + 'v2.12' +
      'display=popup' +
      '&link=' + this._getShareUrl(project);
  }

  public googleProjectShareLink (project: Innovation, lang: string): string {
    lang = lang || 'en';
    return encodeURI('https://plus.google.com/share?url=' + this._getShareUrl(project) + '&text=' + this._getSummary(project, lang));
  }

  public mailProjectShareLink (project: Innovation, lang: string): string {
    lang = lang || 'en';
    return `mailto:?body=${this._getSummary(project, lang)}%0A${this._getShareUrl(project)}&subject=${this._getTitle(project, lang)}`
  }
}

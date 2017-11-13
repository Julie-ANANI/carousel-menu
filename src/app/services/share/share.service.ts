import { Injectable } from '@angular/core';

@Injectable()
export class ShareService {

  private _newLine = '%0D%0A';

  constructor() {}

  private _getShareUrl (project: any): string {
    return encodeURIComponent('http://www.umi.us'); // TODO
  }

  private _getTitle (project: any): string {
    return 'Aidez ce projet en donnant votre avis'; // TODO translate
  }

  private _getSummary (project: any): string {
    return 'summaryOfShare' + this._newLine + 'descriptionShare' + this._newLine + this._getShareUrl(project); // TODO
  }

  public linkedinProjectShareLink (project: any): string { // TODO
    return 'http://www.linkedin.com/shareArticle' +
      '?mini=true' +
      '&url=' + this._getShareUrl(project) +
      '&title=' + this._getTitle(project) +
      '&summary=' + this._getSummary(project) +
      '&source=' + 'UMI'; // En changeant, ne pas oublier de transformer en URL avec encodeURIComponent()
  }

  public twitterProjectShareLink (project: any): string { // TODO
    const twitterAccount = 'uMotionIdeas';
    const projectName = encodeURIComponent('<project name>');
    return 'http://twitter.com/home' +
      '?status=' + this._getTitle(project) + '%20%3A%20' + projectName + '%20' + this._getShareUrl(project) + '%20%40' + twitterAccount;
  }

  public facebookProjectShareLink (project: any): string { // TODO
    return 'https://www.facebook.com/dialog/feed' +
      '?app_id=' + '1172496952780763' +
      '&version=' + 'v2.4' +
      'display=popup' +
      '&caption=' + encodeURIComponent('Caption.') +
      '&link=' + encodeURIComponent('https://www.umi.us');
  }

}

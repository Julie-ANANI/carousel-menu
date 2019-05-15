import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { InnovCard } from '../../models/innov-card';
import { ScrapeHTMLTags } from '../../pipe/pipes/ScrapeHTMLTags';
import { Innovation } from '../../models/innovation';

@Injectable()
export class ShareService {

  constructor() {}


  private static _getShareUrl(innovationCard: InnovCard): string {
    return encodeURIComponent(`${environment.clientUrl}/discover/${innovationCard.innovation_reference}/${innovationCard.lang}`);
  }


  private static _getTitle(innovationCard: InnovCard): string {
    return innovationCard.title || '';
  }


  private static _getSummary(innovationCard: InnovCard): string {
    return  new ScrapeHTMLTags().transform(innovationCard.summary) || '';
  }


  linkedinProjectShareLink(innovationCard: InnovCard): string {
    return 'https://www.linkedin.com/shareArticle' +
      '?mini=true' +
      '&url=' + ShareService._getShareUrl(innovationCard) +
      '&title=' + ShareService._getTitle(innovationCard) +
      '&summary=' + ShareService._getSummary(innovationCard) +
      '&source=' + 'UMI';
  }


  twitterProjectShareLink(innovationCard: InnovCard): string {
    const twitterAccount = 'uMotionIdeas';
    return 'http://twitter.com/home' +
      '?status=' + ShareService._getTitle(innovationCard) + '%20' + ShareService._getShareUrl(innovationCard) + '%20%40' + twitterAccount;
  }


  facebookProjectShareLink(innovationCard: InnovCard): string {
    return 'https://www.facebook.com/dialog/feed' +
      '?app_id=' + '1172496952780763' +
      '&version=' + 'v2.12' +
      'display=popup' +
      '&link=' + ShareService._getShareUrl(innovationCard);
  }

  /*public googleProjectShareLink (project: Innovation, lang: string): string {
    lang = lang || 'en';
    return 'https://plus.google.com/share?url=' + this._getShareUrl(project, lang) + '&text=' + this._getSummary(project, lang);
  }*/


  mailProjectShareLink(innovationCard: InnovCard): string {

    const message = encodeURI(`Please add your message here.\r\n\r\n-------------------------------------\r\nInnovation Details: \r\n\r\nURL - ${environment.clientUrl}/discover/${innovationCard.innovation_reference}/${innovationCard.lang}\r\n\r\nTitle - ${ShareService._getTitle(innovationCard)}\r\n\r\nSummary - ${ShareService._getSummary(innovationCard)}`);

    return `mailto:?subject=Interesting Innovation - ${ShareService._getTitle(innovationCard)}&body=${message}`;

  }


  contactOperator(innovationCard: InnovCard, operatorEmail: string): string {

    operatorEmail = operatorEmail || 'contact@umi.us';

    const message = encodeURI(`Please add your message here.\r\n\r\n-------------------------------------\r\nInnovation Details: \r\n\r\nURL - ${environment.clientUrl}/discover/${innovationCard.innovation_reference}/${innovationCard.lang}\r\n\r\nTitle - ${ShareService._getTitle(innovationCard)}\r\n\r\nSummary - ${ShareService._getSummary(innovationCard)}`);

    return `mailto:${operatorEmail}?subject=Contacting us - ${ShareService._getTitle(innovationCard)}&body=${message}`;

  }


  /***
   * this is to get the share mail to share the synthesis.
   * @param innovation
   * @param lang
   * @param url
   */
  public static reportShareMail(innovation: Innovation, lang: string, url :string): string {
    let subject: string;
    let message: string;
    let innovCard: InnovCard = innovation.innovationCards[0];
    const ownerName = innovation.owner ? innovation.owner.name : '';

    if (innovation.innovationCards.length > 1) {
      const cardIndex = innovation.innovationCards.findIndex((card) => card.lang === lang);

      if (cardIndex !== -1) {
        innovCard = innovation.innovationCards[cardIndex];
      }

    }

    if (lang === 'fr') {
      subject = 'Résultat du rapport - ' + ShareService._getTitle(innovCard);

      message = encodeURI(`Bonjour,\r\n\r\nJe vous invite à découvrir les résultats du test marché réalisé par ${environment.companyShortName} pour l\\'innovation ${ShareService._getTitle(innovCard)} : ${url}\r\n\r\nVous pouvez afficher les résultats en filtrant par domaine,  emplacement géographique, personne etc.\r\n\r\nCordialement,\r\n\r\n${ownerName}`);

    } else {
      subject = 'Report result - ' + ShareService._getTitle(innovCard);

      message = encodeURI(`Hello,\r\n\r\nI invite you to discover the results of the market test carried out by ${environment.companyShortName} for the innovation ${ShareService._getTitle(innovCard)}: ${url}\r\n\r\nYou can view the results by filtering by domain, geographical location, person etc.\r\n\r\nCordially,\r\n\r\n${ownerName}`);

    }

    return `mailto:?subject=${subject}&body=${message}`;

  }

}

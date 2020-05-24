import {Injectable} from '@angular/core';
import {Innovation} from '../../models/innovation';
import {InnovationFrontService} from '../innovation/innovation-front.service';
import {environment} from '../../../environments/environment';
import {InnovCard} from '../../models/innov-card';
import {ScrapeHTMLTags} from '../../pipe/pipes/ScrapeHTMLTags';

@Injectable({providedIn: 'root'})
export class ContactFrontService {

  /***
   * this is to contact commercial to for the synthesis video.
   * @param innovation
   * @param commercialEmail
   * @param userLang
   */
  public static commercialVideo(innovation: Innovation, commercialEmail: string = 'achampagne@umi.us', userLang: string = 'en'): string {
    let subject = '';
    let message = '';
    const title = InnovationFrontService.currentLangInnovationCard(innovation, userLang, 'title');
    const summary = InnovationFrontService.currentLangInnovationCard(innovation, userLang, 'summary');
    const lang = InnovationFrontService.currentLangInnovationCard(innovation, userLang, 'lang');
    const url = `${environment.clientUrl}/discover/${innovation._id}/${lang}`;

    if (userLang === 'fr') {
      subject = `Contactez-nous pour la vidéo de synthèse de - ${title}`;
      message = encodeURIComponent(`Veuillez ajouter votre message ici.\r\n\r\n-------------------------------------\r\n\r\nDétails de l'innovation : \r\nURL - ${url}\r\nTitre - ${title}\r\nSommaire - ${summary}`);
    } else {
      subject = `Contacting us for the Synthesis Video of - ${title}`;
      message = encodeURIComponent(`Please add your message here.\r\n\r\n-------------------------------------\r\n\r\nInnovation Details: \r\nURL - ${url}/${lang}\r\nTitle - ${title}\r\nSummary - ${summary}`);
    }

    return `mailto:${commercialEmail}?subject=${subject}&body=${message}`;

  }

  /***
   * this is to get the url to contact operator, if any.
   * @param innovationCard
   * @param operatorEmail
   * @param userLang
   */
  public static operator(innovationCard: InnovCard, operatorEmail: string = 'contact@umi.us', userLang: string = 'en'): string {
    let subject = '';
    let message = '';
    const title = innovationCard.title || '';
    const summary = new ScrapeHTMLTags().transform(innovationCard.summary) || '';
    const url = `${environment.clientUrl}/discover/${innovationCard.innovation_reference}/${innovationCard.lang}`;

    if (userLang === 'fr' ) {
      subject = `Contactez-nous - ${title}`;
      message = encodeURIComponent(`Veuillez ajouter votre message ici.\r\n\r\n-------------------------------------\r\n\r\nDétails de l'innovation :
      \r\nURL - ${url}\r\nTitre - ${title}\r\nSommaire - ${summary}`);
    } else {
      subject = `Contacting us - ${title}`;
      message = encodeURIComponent(`Please add your message here.\r\n\r\n-------------------------------------\r\n\r\nInnovation Details: \r\nURL -
      ${url}\r\nTitle - ${title}\r\nSummary - ${summary}`);
    }

    return `mailto:${operatorEmail}?subject=${subject}&body=${message}`;

  }

}

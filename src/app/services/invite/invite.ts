import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class Invite {

  constructor() {}

  /***
   * this is to invite the collaborator for a project.
   * @param innovationTitle
   * @param email
   * @param lang
   */
  public static collaborator(innovationTitle: string, email: string, lang = 'en'): string {
    let subject: string;
    let message: string;

    if (lang === 'en') {
      subject = `Invitation to collaborate on the project: ${innovationTitle}`;
      message = encodeURI(`Please follow this invitation url: ${environment.clientUrl}/register?invitation=true\r\n\r\n-------------------------------------\r\n\r\nPlease add your message here.`);
    } else if (lang === 'fr') {
      subject = `Invitation à collaborer au projet : ${innovationTitle}`;
      message = encodeURI(`Veuillez suivre cette invitation url : ${environment.clientUrl}/register?invitation=true\r\n\r\n-------------------------------------\r\n\r\nVeuillez ajouter votre message ici.`);
    }

    return `mailto:${email}?subject=${subject}&body=${message}`;

  }

}

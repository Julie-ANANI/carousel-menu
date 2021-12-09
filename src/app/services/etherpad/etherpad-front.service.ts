import {Injectable} from '@angular/core';
import {Session} from '../../models/session';
import * as moment from 'moment';
import {PadType} from '../../models/etherpad';
import {TranslateNotificationsService} from '../translate-notifications/translate-notifications.service';
import {CardSectionTypes} from '../../models/innov-card';

@Injectable({providedIn: 'root'})
export class EtherpadFrontService {

  constructor(private _translateNotificationsService: TranslateNotificationsService) {}

  /***
   * sort the sessions by the authors name.
   * @param sessions
   */
  public static sortSessions(sessions: Array<Session> = []): Array<Session> {
    if (sessions.length) {
      return sessions.sort((a, b) => {
        return a.author.name.localeCompare(b.author.name);
      });
    }
    return sessions;
  }

  public static getGroupPadId(groupID: string, padID: string): string {
    return `${groupID}$${padID}`;
  }

  /**
   * Note: the length <= 50,
   * because etherpad doesn't allow pad id > 50.
   *
   * returns the pad id for the specific element. ex: pad-pitch-issue-03
   * @param type : editor type, ex : synthesis, workflow, pitch... - length (should be <= 10)
   * @param elementId : editor element id, ex : title, issue, conclusion ... - length (should be <= 24)
   */
  public buildPadID(type: PadType, elementId: string): string {
    const _padId = `pad-${type && type.toLowerCase()}-${elementId && elementId.toLowerCase()}`;

    if (_padId.length > 50) {
      let _errorMessage = '';

      if (elementId.length > 24) {
        _errorMessage = 'The pad element id should be <= 24. Please correct it or contact tech team.';
      } else if (type.length > 10) {
        _errorMessage = 'The pad type should be <= 10. Please correct it or contact tech team.';
      } else {
        _errorMessage = 'The pad id should be <= 50. Please correct it or contact tech team.';
      }

      this._translateNotificationsService.error('Error', _errorMessage);
      throw new Error(_errorMessage);
    }

    return _padId;
  }

  /**
   * we are using it to generate the padId for the old innovation card section.
   * No need to use it with the new innovation card section.
   *
   * @param sectionType
   * @param index
   * @param lang
   */
  public buildPadIdOldInnovation(sectionType: CardSectionTypes, index: number, lang: string): string {
    if (sectionType && lang && index >= 0) {
      if (index) {
        return `${sectionType.toLowerCase()}-${index}3-${lang}`;
      } else {
        return `${sectionType.toLowerCase()}-${lang}`;
      }
    }
    return '';
  }

  /**
   * this is used when we add new Section at the admin side.
   * Note: the length <= 24
   *
   * @param sectionType
   * @param lang - card language
   */
  public generateElementId(sectionType: CardSectionTypes, lang: string): string {
    let _elementId = '';

    if (sectionType && lang) {
      _elementId = `${sectionType.toLowerCase()}-${moment().unix()}-${lang.toLowerCase()}`;

      if (_elementId.length > 24) {
        let _errorMessage = '';

        if (sectionType.length > 10) {
          _errorMessage = 'The section type length should be <= 10. Please correct it or contact tech team.';
        }

        this._translateNotificationsService.error('Error', _errorMessage);
        throw new Error(_errorMessage);
      }
    }

    return _elementId;
  }

}

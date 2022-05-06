/***
 * This service is used to perform all the innovation related
 * cross component communication and also other functions that
 * are used more than once for the innovation in the app.
 */

import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Innovation, InnovationFollowUpEmailsTemplate} from '../../models/innovation';
import {CardComment, CardSectionTypes, InnovCard, InnovCardSection} from '../../models/innov-card';
import {ScrapeHTMLTags} from '../../pipe/pipes/ScrapeHTMLTags';
import {Question} from '../../models/question';
import {Section} from '../../models/section';
import {DomSanitizer} from '@angular/platform-browser';
import {PublicationType} from '../../models/community';
import {MediaFrontService} from '../media/media-front.service';
import {Mission, MissionQuestion, MissionTemplate} from '../../models/mission';
import {MissionFrontService} from '../mission/mission-front.service';
import {UmiusMediaInterface} from '@umius/umi-common-component';
import {environment} from '../../../environments/environment';

export interface Values {
  settingPercentage?: number;
  innovationCardsPercentage?: Array<{
    lang: string,
    percentage: number
  }>;
  totalPercentage?: number;
}

@Injectable({providedIn: 'root'})
export class InnovationFrontService {

  constructor(private _domSanitizer: DomSanitizer) { }

  get calculatedPercentages(): Values {
    return this._calculatedValues;
  }

  totalFieldsPresent: number;

  totalFieldsRequired: number;

  settingsFieldsRequired: number;

  settingsFieldsPresent: number;

  innovCardFieldsRequired: number;

  innovCardFieldsPresent: number;

  private _calculatedValues: Values = {};

  private _selectedInnovationIndex: Subject<number> = new Subject<number>();

  private _saveNotifySubject: Subject<{key: string, state: boolean}> = new Subject<{key: string, state: boolean}>();

  private _saveCommentSubject: Subject<boolean> = new Subject<boolean>();

  private _innovationObj: BehaviorSubject<Innovation> = new BehaviorSubject<Innovation>(<Innovation>{});

  private _activeCardIndex: Subject<number> = new Subject<number>();

  /***
   * this function is to return the color based on the length and limit.
   * @param length
   * @param limit
   */
  // todo remove this
  public static getColor(length: number, limit: number): string {
    if (length <= 0) {
      return '#EA5858';
    } else if (length > 0 && length < (limit / 2)) {
      return '#F0AD4E';
    } else {
      return '#2ECC71';
    }
  }


  /*** Todo to remove this function
   * this function is to get the src with defined height and width to restrict the size of image.
   * @param width
   * @param height
   * @param requestFor
   * @param source => innovationCard || Media.
   */
  public static getMediaSrc(source: any, requestFor = 'default', width = '240', height = '159'): string {
    const defaultSrc = `https://res.cloudinary.com/umi/image/upload/c_fill,f_auto,g_auto,h_${height},q_auto,w_${width}/v1542811700/app/default-images/icons/no-image.png`;
    const prefix = `https://res.cloudinary.com/umi/image/upload/c_fill,f_auto,g_center,h_${height},q_auto,w_${width}/`;
    const suffix = '.jpg';
    let src = '';

    if (source) {

      switch (requestFor) {

        case 'mediaSrc':
          if (source && source.cloudinary && source.cloudinary.public_id) {
            src = prefix + source.cloudinary.public_id + suffix;
          }
          break;

        // it can be used to get the related src for an innovation.
        case 'default':
          if (source.principalMedia && source.principalMedia.type === 'PHOTO' && source.principalMedia.cloudinary
            && source.principalMedia.cloudinary.public_id) {
            src = prefix + source.principalMedia.cloudinary.public_id + suffix;
          } else if (source.media.length > 0) {
            const index = source.media.findIndex((media: UmiusMediaInterface) => media.type === 'PHOTO');
            if (index !== -1 && source.media[index].cloudinary && source.media[index].cloudinary.public_id) {
              src = prefix + source.media[index].cloudinary.public_id + suffix;
            }
          }
          break;

        default:
          // Do nothing...

      }

    }

    return src === '' ? defaultSrc : src;

  }

  /**
   * return true or false to show answers anonymously.
   * @param innovation
   */
  public static hasAnonymousAnswers(innovation: Innovation): boolean {
    return !!(innovation && innovation._metadata && innovation._metadata.campaign
      && innovation._metadata.campaign.anonymous_answers);
  }

  /**
   * generates the quiz link for the innovation
   * @param innovation
   */
  public static quizLink(innovation: Innovation): string {
    if (!innovation || !innovation.quizId || !innovation.campaigns.length) return '';
    return `${environment.quizUrl}/quiz/${innovation.quizId}/${innovation.campaigns[0]._id}`
  }

  /**
   * return the template from the project follow-up object.
   * @param templates
   * @param templateName
   */
  public static getFollowUpTemplate(templates: Array<InnovationFollowUpEmailsTemplate> = [], templateName: string)
    : InnovationFollowUpEmailsTemplate {
    if (!templates.length || !templateName) return <InnovationFollowUpEmailsTemplate>{};
    return templates.find((_template) => _template.name === templateName);
  }

  /**
   * if the mission template has the question with the identifier 'Recontact'
   * then at the client side we show the Follow-Up module.
   * @returns {string}
   * @param template
   */
  public static getFollowUpStatus(template: MissionTemplate) {
    const questions = MissionFrontService.totalTemplateQuestions(template);
    return questions.length && !!questions.some((_question) => _question.identifier === 'Recontact')
      ? 'ACTIVE' : 'INACTIVE';
  }

  /**
   * return the list of the question if the innovation has mission template then will return the list form the
   * mission template sections otherwise we check the innovation preset sections.
   * @param innovation
   */
  public static questionsList(innovation: Innovation = <Innovation>{}): Array<Question | MissionQuestion> {
    let questions: Array<Question | MissionQuestion> = [];

    if (innovation.mission && MissionFrontService.hasMissionTemplate(<Mission>innovation.mission)) {
      (<Mission>innovation.mission).template.sections.forEach((_section) => {
        questions = questions.concat(_section.questions || []);
      });
    } else if (innovation.preset && innovation.preset.sections && innovation.preset.sections.length) {
      innovation.preset.sections.forEach((section: Section) => {
        questions = questions.concat(section.questions || []);
      });
    }

    return questions;
  }

  /**
   * update to work with the new template mission
   * on 8th June 2021
   * @param objective
   */
  public static publicationType(objective: string): PublicationType {
    if (objective) {
      switch (objective) {

        case 'Detecting needs / trends':
        case 'Detecting market needs':
        case 'Validating market needs':
          return 'pain_point';

        case 'Sourcing innovative solutions / partners':
        case 'Sourcing solutions / suppliers':
          return 'sourcing';

        default:
          return 'innovation';
      }
    }
  }

  /***
   * this function returns the demanded field from the innovation
   * based on the current lang provided.
   * @param innovation
   * @param currentLang
   * @param required
   */
  public static currentLangInnovationCard(innovation: Innovation, currentLang = 'en', required: string): any {
    if (innovation && innovation.innovationCards && required) {
      const _cardIndex = innovation.innovationCards.findIndex((card: InnovCard) => card.lang === currentLang);
      const _card: InnovCard = _cardIndex !== -1 ? innovation.innovationCards[_cardIndex] : innovation.innovationCards[0];

      switch (required) {

        case 'CARD':
          _card.title = InnovationFrontService.scrapeHtmlTags(_card.title);
          return <InnovCard>_card;

        case 'TITLE':
          return InnovationFrontService.scrapeHtmlTags(_card.title);

        case 'SUMMARY':
          return InnovationFrontService.scrapeHtmlTags(_card.summary) || '';

        case 'ISSUE':
          return InnovationFrontService.cardDynamicSection(_card, 'ISSUE').content || '';

        case 'SOLUTION':
          return InnovationFrontService.cardDynamicSection(_card, 'SOLUTION').content || '';

        case 'CONTEXT':
          return InnovationFrontService.cardDynamicSection(_card, 'CONTEXT').content || '';

        case 'LANG':
          return _card.lang;

        case 'INDEX':
          return _cardIndex;

      }

    }
  }

  /**
   * first we search by demanded lang if not found then find the card in lang 'en' if not found
   * then the card at index 0.
   *
   * @param innovCards
   * @param lang
   */
  public static currentLangCard(innovCards: Array<InnovCard>, lang = 'en'): InnovCard {
    let card = <InnovCard>{};

    if (innovCards.length) {
      const _cardIndex = InnovationFrontService.cardIndexByLang(innovCards, lang);
      if (_cardIndex !== -1) {
        card = innovCards[_cardIndex];
      }

      const _cardIndexEn = InnovationFrontService.cardIndexByLang(innovCards);
      if (_cardIndexEn !== -1) {
        card = innovCards[_cardIndex];
      }

      card = innovCards[0];

    }

    return card;
  }

  private static cardIndexByLang(innovCards: Array<InnovCard>, lang = 'en'): number {
    return innovCards.findIndex((card: InnovCard) => card.lang === lang);
  }

  /***
   * returns the section info of the 'ISSUE' | 'SOLUTION' | 'CONTEXT'.
   * @param innovCard
   * @param field
   */
  public static cardDynamicSection(innovCard: InnovCard, field: 'SOLUTION' | 'ISSUE' | 'CONTEXT'): InnovCardSection {
    if (innovCard && innovCard.sections && innovCard.sections.length) {
      const _index = InnovationFrontService.cardDynamicSectionIndex(innovCard, field);
      if (_index !== -1) {
        return innovCard.sections[_index];
      }
    }
    return <InnovCardSection>{};
  }

  /**
   * look for the section based on the sectionId.
   * @param innovCard
   * @param sectionId
   */
  public static cardDynamicSectionById(innovCard: InnovCard, sectionId = ''): InnovCardSection {
    if (innovCard && innovCard.sections && innovCard.sections.length) {
      const index = innovCard.sections.findIndex((section) => section._id === sectionId);
      if (index !== -1) {
        return innovCard.sections[index];
      }
    }
    return <InnovCardSection>{};
  }

  /***
   * return the index of the section 'ISSUE' | 'SOLUTION' | 'OTHER' | 'CONTEXT'
   * if we have searchKey then we search bby it otherwise with the type.
   * Please note that case won't work if we have more then one section of same type.
   *
   * @param innovCard
   * @param field
   * @param searchKey - in case of OTHER send the etherpadElementId
   */
  public static cardDynamicSectionIndex(
    innovCard: InnovCard, field: 'SOLUTION' | 'ISSUE' | 'OTHER' | 'CONTEXT', searchKey = ''): number {
    if (searchKey) {
      return innovCard.sections.findIndex((section) => section.type === field && section.etherpadElementId === searchKey);
    }
    return innovCard.sections.findIndex((section) => section.type === field);
  }

  /***
   * returns the operator comment of the card based on the required
   * @param innovCard
   * @param field
   * @param etherpadElementId
   */
  public static cardOperatorComment(innovCard: InnovCard, field: CardSectionTypes, etherpadElementId = ''): CardComment {
    if (innovCard && innovCard.operatorComment && field) {
      switch (field) {

        case 'TITLE':
          return innovCard.operatorComment.title;

        case 'SUMMARY':
          return innovCard.operatorComment.summary;

        case 'ISSUE':
          return InnovationFrontService.cardDynamicOperatorComment(innovCard, 'ISSUE');

        case 'SOLUTION':
          return InnovationFrontService.cardDynamicOperatorComment(innovCard, 'SOLUTION');

        case 'CONTEXT':
          return InnovationFrontService.cardDynamicOperatorComment(innovCard, 'CONTEXT');

        case 'OTHER':
          if (etherpadElementId) {
            return innovCard.operatorComment.sections.find(s => s.sectionId === etherpadElementId) || <CardComment>{};
          } else {
            return <CardComment>{};
          }
      }
    }
    return <CardComment>{};
  }

  /***
   * returns the dynamic comment section info of the 'ISSUE' | 'SOLUTION' | 'CONTEXT'
   * @param innovCard
   * @param field
   */
  public static cardDynamicOperatorComment(innovCard: InnovCard, field: 'SOLUTION' | 'ISSUE' | 'CONTEXT'): CardComment {
    if (innovCard && innovCard.operatorComment && innovCard.operatorComment.sections && innovCard.operatorComment.sections.length) {
      const _index = innovCard.operatorComment.sections.findIndex((section) => section.type === field);
      if (_index !== -1) {
        return innovCard.operatorComment.sections[_index];
      }
    }
    return <CardComment>{};
  }

  public static scrapeHtmlTags(text: string): string {
    return new ScrapeHTMLTags().transform(text);
  }

  /***
   * first it checks the principal media at the innovation level, if not found then check at the
   * card level based on the lang and return the url..
   * @param innovation
   * @param lang
   * @param width
   * @param height
   */
  public static principalMedia(innovation: Innovation, lang = 'en', width = '240', height = '159'): string {
    if (innovation && innovation.principalMedia) {
      return MediaFrontService.getMedia(innovation.principalMedia, width, height);
    } else if (innovation && innovation.innovationCards && innovation.innovationCards.length > 0) {
      const _card = InnovationFrontService.currentLangInnovationCard(innovation, lang, 'CARD');
      return InnovationFrontService.innovCardPrincipalMedia(_card, width, height);
    }
  }

  /***
   * this function return the principal media url at the level of the innovation card.
   * @param innovCard
   * @param width
   * @param height
   */
  public static innovCardPrincipalMedia(innovCard: InnovCard, width = '240', height = '159'): string {
    if (innovCard && innovCard.principalMedia) {
      return MediaFrontService.getMedia(innovCard.principalMedia, width, height);
    } else if (innovCard && innovCard.media && innovCard.media.length > 0) {
      const _imageIndex = innovCard.media.findIndex((media: UmiusMediaInterface) => media.type === 'PHOTO');
      const _media: UmiusMediaInterface = _imageIndex !== -1 ? innovCard.media[_imageIndex] : innovCard.media[0];
      return MediaFrontService.getMedia(_media, width, height);
    } else {
      return MediaFrontService.defaultMedia(width, height);
    }
  }

  /***
   * This function is to get and returns the questions from the innovation.
   */
  public static presets(innovation: Innovation): Array<Question> {

    let questions: Array<Question> = [];

    if (innovation && innovation.preset && innovation.preset.sections) {
      questions = innovation.preset.sections.reduce((questionArray: Array<Question>, section: Section) => {
        return questionArray.concat(section.questions);
      }, []);
    }

    return questions;

  }

  public static activeCard(innovation: Innovation, index = 0): InnovCard {
    return innovation && innovation.innovationCards && innovation.innovationCards.length
      ? innovation.innovationCards[index] : <InnovCard>{};
  }

  /*
    We are calculating the percentage for the project.
   */
  completionCalculation(project: Innovation) {
    this.settingsFieldsRequired = 0;
    this.settingsFieldsPresent = 0;
    this.innovCardFieldsRequired = 0;
    this.innovCardFieldsPresent = 0;
    this.totalFieldsPresent = 0;
    this._calculatedValues.innovationCardsPercentage = [];

    /*
      method to calculate the percentage in project settings.
     */
    this.settingLevel(project);

    /*
      method to calculate the percentage in innovationCard.
     */
    this.innovCardLevel(project);

    this.totalFieldsRequired = this.settingsFieldsRequired + this.innovCardFieldsRequired;

    /*
      now calculating the total project completion percentage.
     */
    this._calculatedValues.totalPercentage = (this.totalFieldsPresent * 100) / this.totalFieldsRequired;

  }

  /*
    Here we are calculating the values that are in targeting page i.e. settings.
    For the moment two fields are required.
   */

  settingLevel(value: Innovation) {
    this.settingsFieldsRequired = 2;

    if (value.settings.market.comments.length) {
      this.totalFieldsPresent++;
      this.settingsFieldsPresent++;
    }

    if (value.settings.geography.exclude.length || value.settings.geography.comments.length
      || value.settings.geography.continentTarget.oceania || value.settings.geography.continentTarget.europe
      || value.settings.geography.continentTarget.asia  || value.settings.geography.continentTarget.americaSud
      || value.settings.geography.continentTarget.americaNord || value.settings.geography.continentTarget.africa) {
      this.totalFieldsPresent++;
      this.settingsFieldsPresent++;
    }

    /*
      calculating the percentage at setting level.
     */
    this._calculatedValues.settingPercentage = (this.settingsFieldsPresent * 100) / this.settingsFieldsRequired;

  }

  /*
    Here we are calculating the values that are present in different innovation card.
    For the moment 5 fields are required.
   */
  innovCardLevel(value: Innovation) {
    this.innovCardFieldsRequired = 5 * value.innovationCards.length;

    for (let i = 0; i < value.innovationCards.length; i++) {

      if (value.innovationCards[i].title) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].summary) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      /*if (value.innovationCards[i].problem) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].solution) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }*/

      if (value.innovationCards[i].advantages) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      this._calculatedValues.innovationCardsPercentage.push({
        lang: value.innovationCards[i].lang,
        percentage: (this.innovCardFieldsPresent * 100) / 5
      });

      this.innovCardFieldsPresent = 0;

    }

  }

  public videoSrc(media: UmiusMediaInterface): any {
    return media && media.video && media.video.embeddableUrl
      ? this._domSanitizer.bypassSecurityTrustResourceUrl(media.video.embeddableUrl) : '';
  }

  getSelectedInnovationIndex(): Subject<number> {
    return this._selectedInnovationIndex;
  }

  /***
   * these function is to set and get active innovation card index.
   * @param value
   */
  setActiveCardIndex(value: number) {
    this._activeCardIndex.next(value);
  }

  activeCardIndex(): Subject<number> {
    return this._activeCardIndex;
  }

  /***
   * this function is called when there are some changes and we want to notify
   * in the component that changes are to be saved or not for the innovation.
   * @param value
   */
  public setNotifyChanges(value: {key: string, state: boolean, autoSave?: boolean}) {
    this._saveNotifySubject.next(value);
  }

  public getNotifyChanges(): Subject<{key: string, state: boolean, autoSave?: boolean}> {
    return this._saveNotifySubject;
  }

  /***
   * this function is called when there are some changes in the card comment
   * and we want to notify in the component that changes are to be saved.
   * @param value
   */
  public setCardCommentNotifyChanges(value: boolean) {
    this._saveCommentSubject.next(value);
  }

  public getCardCommentNotifyChanges(): Subject<boolean> {
    return this._saveCommentSubject;
  }

  /***
   * set the innovation value using this function.
   * @param value
   */
  public setInnovation(value: Innovation) {
    this._innovationObj.next(value);
  }

  /***
   * use this to listen the value in the components that
   * we set.
   */
  public innovation(): BehaviorSubject<Innovation> {
    return this._innovationObj;
  }

}


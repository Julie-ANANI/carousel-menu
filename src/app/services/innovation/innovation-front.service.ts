/***
 * This service is used to perform all the innovation related
 * cross component communication and also other functions that
 * are used more than once for the innovation in the app.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Innovation } from '../../models/innovation';
import { Media } from '../../models/media';
import { CardSectionTypes, InnovCard } from '../../models/innov-card';
import { ScrapeHTMLTags } from '../../pipe/pipes/ScrapeHTMLTags';
import { Question } from '../../models/question';
import { Section } from '../../models/section';
import { DomSanitizer } from '@angular/platform-browser';
import { CardComment } from '../../models/innov-card-comment';

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

  totalFieldsPresent: number;

  totalFieldsRequired: number;

  settingsFieldsRequired: number;

  settingsFieldsPresent: number;

  innovCardFieldsRequired: number;

  innovCardFieldsPresent: number;

  private _calculatedValues: Values = {};

  private _selectedInnovationIndex: Subject<number> = new Subject<number>();

  private _saveNotifySubject: Subject<boolean> = new Subject<boolean>();

  private _saveCommentSubject: Subject<boolean> = new Subject<boolean>();

  private _innovationObj: BehaviorSubject<Innovation> = new BehaviorSubject<Innovation>(<Innovation>{});

  private _activeCardIndex: Subject<number> = new Subject<number>();

  constructor(private _domSanitizer: DomSanitizer) { }

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

      if (value.innovationCards[i].problem) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

      if (value.innovationCards[i].solution) {
        this.totalFieldsPresent++;
        this.innovCardFieldsPresent++;
      }

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

  /***
   * this function is to return the color based on the length and limit.
   * @param length
   * @param limit
   */
  // todo remove this
  public static getColor(length: number, limit: number): string {
    if (length <= 0) {
      return '#EA5858';
    } else if (length > 0 && length < (limit/2)) {
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
    const defaultSrc = `https://res.cloudinary.com/umi/image/upload/c_fill,h_${height},w_${width}/v1542811700/app/default-images/icons/no-image.png`;
    const prefix = `https://res.cloudinary.com/umi/image/upload/c_fill,h_${height},w_${width}/`;
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
            const index = source.media.findIndex((media: Media) => media.type === 'PHOTO');
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

  /***
   * this function returns the demanded field from the innovation
   * based on the current lang provided.
   * @param innovation
   * @param currentLang
   * @param required
   */
  public static currentLangInnovationCard(innovation: Innovation, currentLang = 'en', required: string): any {
    if (innovation && innovation.innovationCards && required) {
      let _cardIndex = innovation.innovationCards.findIndex((card: InnovCard) => card.lang === currentLang);
      const _card: InnovCard = _cardIndex !== -1 ? innovation.innovationCards[_cardIndex] : innovation.innovationCards[0];

      switch (required) {

        case 'CARD':
          return <InnovCard>_card;

        case 'TITLE':
          return _card.title;

        case 'SUMMARY':
          return InnovationFrontService.scrapeHtmlTags(_card.summary) || '';

        case 'ISSUE':
          return InnovationFrontService.scrapeHtmlTags(_card.problem) || '';

        case 'SOLUTION':
          return InnovationFrontService.scrapeHtmlTags(_card.solution) || '';

        case 'LANG':
          return _card.lang;

      }

    }
  }

  /***
   * returns the operator comment of the card based on the required
   * @param innovCard
   * @param required
   */
  public static cardOperatorComment(innovCard: InnovCard, required: CardSectionTypes): CardComment {
    if (innovCard && innovCard.operatorComment && required) {
      switch (required) {

        case 'TITLE':
          return innovCard.operatorComment.title;

        case 'SUMMARY':
          return innovCard.operatorComment.summary;

      }
    }
    return <CardComment>{};
  }

  public static scrapeHtmlTags(text: string): string {
    return new ScrapeHTMLTags().transform(text);
  }

  public static defaultMedia(width = '240', height = '159'): string {
    return `https://res.cloudinary.com/umi/image/upload/c_fill,h_${height},w_${width}/v1542811700/app/default-images/icons/no-image.png`;
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
      return InnovationFrontService.getMedia(innovation.principalMedia, width, height);
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
      return InnovationFrontService.getMedia(innovCard.principalMedia, width, height);
    } else if (innovCard && innovCard.media && innovCard.media.length > 0) {
      const _imageIndex = innovCard.media.findIndex((media: Media) => media.type === 'PHOTO');
      const _media: Media = _imageIndex !== -1 ? innovCard.media[_imageIndex] : innovCard.media[0];
      return InnovationFrontService.getMedia(_media, width, height);
    } else {
      return InnovationFrontService.defaultMedia(width, height);
    }
  }

  public static getMedia(media: Media, width = '240', height = '159'): string {
    let _src = '';

    if (media && media.type && media.type === 'PHOTO') {
      _src = InnovationFrontService.imageSrc(media, width, height);
    } else if (media && media.type && media.type === 'VIDEO') {
      _src = this._videoThumbnail(media);
    }

    return _src === '' ? InnovationFrontService.defaultMedia(width, height) : _src;
  }

  private static _videoThumbnail(media: Media): string {
    return media && media.video && media.video.thumbnail || '';
  }

  public static imageSrc(media: Media, width = '240', height = '159'): string {
    const _prefix = `https://res.cloudinary.com/umi/image/upload/c_fill,h_${height},w_${width}/`;
    const _suffix = '.jpg';
    return media && media.cloudinary && media.cloudinary.public_id ? _prefix + media.cloudinary.public_id + _suffix : '';
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

  public videoSrc(media: Media): any {
    return media && media.video && media.video.embeddableUrl
      ? this._domSanitizer.bypassSecurityTrustResourceUrl(media.video.embeddableUrl) : '';
  }

  /*** Todo remove this
   * these function is to set and get selected innovation index.
   * @param value
   */
  setSelectedInnovationIndex(value: number) {
    this._selectedInnovationIndex.next(value);
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
  setNotifyChanges(value: boolean) {
    this._saveNotifySubject.next(value);
  }

  getNotifyChanges(): Subject<boolean> {
    return this._saveNotifySubject;
  }

  /***
   * this function is called when there are some changes in the card comment
   * and we want to notify in the component that changes are to be saved.
   * @param value
   */
  setCardCommentNotifyChanges(value: boolean) {
    this._saveCommentSubject.next(value);
  }

  getCardCommentNotifyChanges(): Subject<boolean> {
    return this._saveCommentSubject;
  }

  get calculatedPercentages(): Values {
    return this._calculatedValues;
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


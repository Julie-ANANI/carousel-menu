import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, Meta} from '@angular/platform-browser';
import { InnovCard } from '../../../../../models/innov-card';
import { Innovation } from '../../../../../models/innovation';
import { ShareService } from '../../../../../services/share/share.service';
import { Tag } from '../../../../../models/tag';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { first } from 'rxjs/operators';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ContactFrontService } from '../../../../../services/contact/contact-front.service';
import {QuizService} from '../../../../../services/quiz/quiz.service';
import {LangEntryService} from '../../../../../services/lang-entry/lang-entry.service';
import {htmlTagsRegex} from '../../../../../utils/regex';
import {environment} from '../../../../../../environments/environment';
import {UmiusMediaInterface, UmiusModalMedia} from '@umius/umi-common-component';

@Component({
  templateUrl: './discover-description.component.html',
  styleUrls: ['./discover-description.component.scss']
})

export class DiscoverDescriptionComponent implements OnInit {

  private _relatedInnovationConfig = {
    fields: 'innovationCards tags principalMedia',
    limit: '3',
    offset: '',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  private _innovationCard: InnovCard;

  private _innovation: Innovation;

  private _quizUrl: string;

  private _linkedInUrl: string;

  private _twitterUrl: string;

  private _mailUrl: string;

  private _contactUsUrl: string;

  private _quizButtonDisplay: string;

  private _selectedMedia: UmiusModalMedia = <UmiusModalMedia>{};

  private _lang: string;

  private _id: string;

  private _operatorEmail: string;

  private _tags: Array<string> = [];

  private _modalMedia: boolean;

  private _innovationsRelated: Array<{ innovationCard: InnovCard, tags: Array<Tag> }> = [];

  private _pageTitle = 'COMMON.PAGE_TITLE.DISCOVER_DESCRIPTION';

  private _fetchingError: boolean;

  constructor(private _activatedRoute: ActivatedRoute,
              private _langEntryService: LangEntryService,
              private _domSanitizer1: DomSanitizer,
              private _translateTitleService: TranslateTitleService,
              private _innovationService: InnovationService,
              private _metaService: Meta,
              private _router: Router) {

    this._setPageTitle();

    this._activatedRoute.params.subscribe(params => {
      this._id = params['projectId'];
      this._lang = params['lang'];
    });

  }

  ngOnInit() {

    if (this._activatedRoute.snapshot.data.innovation && typeof this._activatedRoute.snapshot.data.innovation !== undefined) {
      this._innovation = this._activatedRoute.snapshot.data.innovation;
      this._innovationCard = InnovationFrontService.currentLangInnovationCard(this._innovation, this._lang, 'CARD');
      this._pageTitle = this._innovationCard.title;
      /**
       * Remove old meta tags. This don't add anything for SEO
       */
      this._metaService.removeTag('name="title"');
      this._metaService.removeTag('name="description"');
      this._metaService.removeTag('name="description"'); // There are two descriptions??
      this._metaService.removeTag('name="image"');
      this._metaService.removeTag('name="url"');
      this._metaService.removeTag('property="og:title"');
      /**
       * Add the following meta tags here...
       */
      const metaTags = [
        {name:'title', content: this._innovationCard.title, property:'og:title'},
        {name:'description', content: this._innovationCard.summary.replace(htmlTagsRegex, ''), property:'og:description'},
        {name:'image', content: this._innovationCard.principalMedia.url, property:'og:image'},
        {name:'image_alt', content: this._innovationCard.title, property:'og:image:alt'},
        {name:'url', content: `${environment.clientUrl}${this._router.url}`, property:'og:url'}];
      this._metaService.addTags(metaTags);

      this._setPageTitle();
      this._getAllTags();
      this._getRelatedInnovations();
      this._getOperatorDetails();
      this._getAllShareLinks();

      if ((this._innovation.quizId && this._innovation.quizId === '') || this._innovation.status === 'DONE' ) {
        this._quizButtonDisplay = 'none';
      }

    } else {
      this._fetchingError = true;
      this._router.navigate(['/discover']);
    }

  }

  private _setPageTitle() {
    this._translateTitleService.setTitle(this._pageTitle);
  }

  private _getAllTags() {
    this._innovation.tags.forEach((tag: Tag) => {
      if (tag.type === 'SECTOR') {
        this._tags.push(this._langEntryService.tagEntry(tag, 'label', this._lang));
        this._tags = this._tags.sort();
      }
    });
  }

  private _getRelatedInnovations() {
    if (this._innovation.similar) {
      this._innovation.similar.forEach((item) => {
        this._innovationService.get(item.matched_inno_id , this._relatedInnovationConfig).pipe(first()).subscribe((response: Innovation) => {
          const index = response.innovationCards.findIndex((innovCard: InnovCard) => innovCard.lang === this._lang);
          if (index !== -1) {
            this._innovationsRelated.push({innovationCard: response.innovationCards[index], tags: response.tags});
          } else {
            this._innovationsRelated.push({innovationCard: response.innovationCards[0], tags: response.tags});
          }
        });
      });
    }
  }

  private _getOperatorDetails() {
    this._operatorEmail = this._innovation.operator ? this._innovation.operator.email : 'contact@umi.us';
  }

  private _getAllShareLinks() {

    if (this._innovation.quizId && this._innovation.campaigns && this._innovation.campaigns.length > 0) {
      this._quizUrl = QuizService.quizUrl(this._innovation.campaigns[0]._id, this._innovation.quizId, this._lang);
    }

    this._linkedInUrl = ShareService.linkedinProjectShareLink(this._innovationCard);
    this._twitterUrl = ShareService.twitterProjectShareLink(this._innovationCard);
    this._mailUrl = ShareService.mailProjectShareLink(this._innovationCard, this._lang);
    this._contactUsUrl = ContactFrontService.operator(this._innovationCard, this._operatorEmail, this._lang);

  }

  public getSrc(media: UmiusMediaInterface): string {
    return InnovationFrontService.getMediaSrc(media, 'mediaSrc', '280', '177');
  }

  public mediaToShow(src: string) {
    this._modalMedia = true;
    this._selectedMedia = {
      src: src,
      active: true
    }
  }

  public getRelatedSrc(innovCard: InnovCard): string {
    return InnovationFrontService.getMediaSrc(innovCard, 'default', '280', '177');
  }

  public getLink(innovCard: InnovCard): string {
    return `/discover/${innovCard.innovation_reference}/${innovCard.lang}`;
  }

  public sectionInfo(field: 'ISSUE' | 'SOLUTION'): string {
    return <string>InnovationFrontService.cardDynamicSection(this._innovationCard, field).content;
  }

  get lang(): string {
    return this._lang;
  }

  get id(): string {
    return this._id;
  }

  get innovationCard(): InnovCard {
    return this._innovationCard;
  }

  get domSanitizer() {
    return this._domSanitizer1;
  }

  get selectedMedia(): UmiusModalMedia {
    return this._selectedMedia;
  }

  get operatorEmail(): string {
    return this._operatorEmail;
  }

  get quizButtonDisplay(): string {
    return this._quizButtonDisplay;
  }

  get quizUrl() {
    return this._quizUrl;
  }

  get linkedInUrl() {
    return this._linkedInUrl;
  }

  get twitterUrl() {
    return this._twitterUrl;
  }

  get mailUrl() {
    return this._mailUrl;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get tags(): Array<string> {
    return this._tags;
  }

  get modalMedia(): boolean {
    return this._modalMedia;
  }

  set modalMedia(value: boolean) {
    this._modalMedia = value;
  }

  get contactUsUrl(): string {
    return this._contactUsUrl;
  }

  get innovationsRelated(): Array<{ innovationCard: InnovCard; tags: Array<Tag> }> {
    return this._innovationsRelated;
  }

  get pageTitle(): string {
    return this._pageTitle;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

}

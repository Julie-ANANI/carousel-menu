import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { InnovCard } from '../../../../../models/innov-card';
import { Innovation } from '../../../../../models/innovation';
import { ShareService } from '../../../../../services/share/share.service';
import { Tag } from '../../../../../models/tag';
import { MultilingPipe } from '../../../../../pipe/pipes/multiling.pipe';
import { environment } from '../../../../../../environments/environment';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { first } from 'rxjs/operators';
import { Media } from '../../../../../models/media';
import { isPlatformBrowser, Location } from '@angular/common';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { Config } from '../../../../../models/config';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ContactFrontService } from '../../../../../services/contact/contact-front.service';

@Component({
  selector: 'app-discover-description',
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

  private _lang: string;

  private _id: string;

  private _operatorEmail: string;

  private _tags: Array<string> = [];

  private _innovationsRelated: Array<{ innovationCard: InnovCard, tags: Array<Tag> }> = [];

  private _pageTitle = 'COMMON.PAGE_TITLE.DISCOVER_DESCRIPTION';

  private _fetchingError: boolean;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _multiling: MultilingPipe,
              private _domSanitizer1: DomSanitizer,
              private _translateTitleService: TranslateTitleService,
              private _location: Location,
              public _router: Router,
              private _innovationService: InnovationService) {

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
    }

  }

  private _setPageTitle() {
    this._translateTitleService.setTitle(this._pageTitle);
  }

  private _getAllTags() {
    this._innovation.tags.forEach((tag: Tag) => {
      if (tag.type === 'SECTOR') {
        this._tags.push(this._multiling.transform(tag.label, this._lang));
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
      this._quizUrl = environment.quizUrl + '/quiz/' + this._innovation.quizId + '/' + this._innovation.campaigns[0].id + '?lang=' + this._lang;
    }

    this._linkedInUrl = ShareService.linkedinProjectShareLink(this._innovationCard);
    this._twitterUrl = ShareService.twitterProjectShareLink(this._innovationCard);
    this._mailUrl = ShareService.mailProjectShareLink(this._innovationCard, this._lang);
    this._contactUsUrl = ContactFrontService.operator(this._innovationCard, this._operatorEmail, this._lang);

  }

  public getSrc(media: Media): string {
    return InnovationFrontService.getMediaSrc(media, 'mediaSrc', '280', '177');
  }

  public getRelatedSrc(innovCard: InnovCard): string {
    return InnovationFrontService.getMediaSrc(innovCard, 'default', '280', '177');
  }

  public getLink(innovCard: InnovCard): string {
    return `wordpress/discover/${innovCard.innovation_reference}/${innovCard.lang}`;
  }

  public onClickBack() {
    if (isPlatformBrowser(this._platformId)) {
      this._location.back();
    } else {
      this._router.navigate(['/wordpress/discover/en']);
    }
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

  get contactUsUrl(): string {
    return this._contactUsUrl;
  }

  get innovationsRelated(): Array<{ innovationCard: InnovCard; tags: Array<Tag> }> {
    return this._innovationsRelated;
  }

  get relatedInnovationConfig(): Config {
    return this._relatedInnovationConfig;
  }

  get pageTitle(): string {
    return this._pageTitle;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

}

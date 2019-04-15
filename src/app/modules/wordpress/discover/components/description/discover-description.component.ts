import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { InnovCard } from '../../../../../models/innov-card';
import { Innovation } from '../../../../../models/innovation';
import { ShareService } from '../../../../../services/share/share.service';
import { Tag } from '../../../../../models/tag';
import { MultilingPipe } from '../../../../../pipe/pipes/multiling.pipe';
import { environment } from '../../../../../../environments/environment';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { first } from 'rxjs/operators';
import { Media } from '../../../../../models/media';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-discover-description',
  templateUrl: './discover-description.component.html',
  styleUrls: ['./discover-description.component.scss']
})

export class DiscoverDescriptionComponent implements OnInit {

  private _innovationCard: InnovCard[] = [];

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

  private _innovationConfig = {
    fields: 'innovationCards tags principalMedia',
    limit: '3',
    offset: '0',
    sort: '{ "created": -1 }'
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _shareService: ShareService,
              private _domSanitizer1: DomSanitizer,
              private _translateService: TranslateService,
              private _innovationService: InnovationService) {

    this._activatedRoute.params.subscribe(params => {
      this._id = params['projectId'];
      this._lang = params['lang'];
    });

    this._innovation = this._activatedRoute.snapshot.data.innovation;

  }

  ngOnInit() {
    this._loadInnovation();
  }


  private _loadInnovation() {

    if ((this._innovation.quizId && this._innovation.quizId === '') || this._innovation.status === 'DONE') {
      this._quizButtonDisplay = 'none';
    }

    this._getInnovationCard();
    this._getRelatedInnovations();
    this._getAllTags();
    this._getAllShareLinks();
    this._getOperatorDetails();
  }


  private _getAllTags() {
    this._innovation.tags.forEach((tag: Tag) => {
      if (tag.type === 'SECTOR') {
        this._tags.push(MultilingPipe.prototype.transform(tag.label, this.browserLang()));
      }
    });
  }


  public browserLang(): string {
    return this._translateService.getBrowserLang() || 'en';
  }


  private _getRelatedInnovations() {
    if (this._innovation.similar) {
      this._innovation.similar.forEach((item) => {
        this._innovationService.get(item.matched_inno_id , this._innovationConfig).pipe(first()).subscribe((response: Innovation) => {
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


  private _getAllShareLinks() {

    if (this._innovation.campaigns.length !== 0) {
      this._quizUrl = environment.quizUrl + '/quiz/' + this._innovation.quizId + '/' + this._innovation.campaigns[0].id + '?lang=' + this._lang;
    }

    this._linkedInUrl = this._shareService.linkedinProjectShareLink(this._innovationCard[0]);
    this._twitterUrl = this._shareService.twitterProjectShareLink(this._innovationCard[0]);
    this._mailUrl = this._shareService.mailProjectShareLink(this._innovationCard[0]);
    this._contactUsUrl = this._shareService.contactOperator(this.innovationCard[0], this._operatorEmail);

  }


  private _getOperatorDetails() {
    this._operatorEmail = this._innovation.operator ? this._innovation.operator.email : 'contact@umi.us';
  }


  private _getInnovationCard() {
    const innovationCardIndex = this._innovation.innovationCards.findIndex( (card: InnovCard) => card.lang === this._lang);
    this._innovationCard.push(this._innovation.innovationCards[innovationCardIndex]);
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


  get lang(): string {
    return this._lang;
  }

  get id(): string {
    return this._id;
  }

  get innovationCard(): InnovCard[] {
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

  get innovationConfig(): { offset: string; limit: string; sort: string; fields: string } {
    return this._innovationConfig;
  }

}

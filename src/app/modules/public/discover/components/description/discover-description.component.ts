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

  private _selectedMedia: string;

  private _lang: string;

  private _id: string;

  private _operatorEmail: string;

  private _tags: Array<string> = [];

  private _modalMedia = false;

  private _innovationsRelated: Array<{ innovationCard: InnovCard, tags: Array<Tag> }> = [];

  private _innovationConfig = {
    fields: 'innovationCards tags principalMedia',
    limit: '3',
    offset: '0',
    sort: '{ "created": -1 }'
  };

  constructor(private activatedRoute: ActivatedRoute,
              private shareService: ShareService,
              private domSanitizer1: DomSanitizer,
              private translateService: TranslateService,
              private innovationService: InnovationService) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this._id = params['projectId'];
      this._lang = params['lang'];

    });

    this.loadInnovation();

  }

  private loadInnovation() {
    this._innovation = this.activatedRoute.snapshot.data.innovation;

    if ((this._innovation.quizId && this._innovation.quizId === '') || this._innovation.status === 'DONE') {
      this._quizButtonDisplay = 'none';
    }

    this.getInnovationCard();
    this.getRelatedInnovations();
    this.getAllTags();
    this.getAllShareLinks();
    this.getOperatorDetails();
  }


  private getAllTags() {
    this._innovation.tags.forEach((tag: Tag) => {
      if (tag.type === 'SECTOR') {
        this._tags.push(MultilingPipe.prototype.transform(tag.label, this.browserLang()));
      }
    });
  }


  browserLang(): string {
    return this.translateService.getBrowserLang() || 'en';
  }


  private getRelatedInnovations() {
    if (this._innovation.similar) {
      this._innovation.similar.forEach((item) => {
        this.innovationService.get(item.matched_inno_id , this._innovationConfig).pipe(first()).subscribe((response: Innovation) => {
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


  private getAllShareLinks() {

    if (this._innovation.campaigns.length !== 0) {
      this._quizUrl = environment.quizUrl + '/quiz/' + this._innovation.quizId + '/' + this._innovation.campaigns[0].id + '?lang=' + this._lang;
    }

    this._linkedInUrl = this.shareService.linkedinProjectShareLink(this._innovationCard[0]);
    this._twitterUrl = this.shareService.twitterProjectShareLink(this._innovationCard[0]);
    this._mailUrl = this.shareService.mailProjectShareLink(this._innovationCard[0]);
    this._contactUsUrl = this.shareService.contactOperator(this.innovationCard[0], this._operatorEmail);
  }


  private getOperatorDetails() {
    this._operatorEmail = this._innovation.operator ? this._innovation.operator.email : 'contact@umi.us';
  }


  private getInnovationCard() {
    const innovationCardIndex = this._innovation.innovationCards.findIndex( (card: InnovCard) => card.lang === this._lang);
    this._innovationCard.push(this._innovation.innovationCards[innovationCardIndex]);
  }


  getSrc(media: Media): string {
    const defaultSrc = 'https://res.cloudinary.com/umi/image/upload/c_fill,h_177,w_280/app/default-images/image-not-available.png';
    const prefix = 'https://res.cloudinary.com/umi/image/upload/c_fill,h_177,w_280/';
    const suffix = '.jpg';
    return media.url === '' ? defaultSrc :  prefix + media.cloudinary.public_id + suffix;
  }


  mediaToShow(event: Event, src: string) {
    event.preventDefault();
    this._modalMedia = true;
    this._selectedMedia = src;
  }


  getRelatedSrc(innovCard: InnovCard): string {
    const defaultSrc = 'https://res.cloudinary.com/umi/image/upload/c_fill,h_177,w_280/app/default-images/image-not-available.png';
    const prefix = 'https://res.cloudinary.com/umi/image/upload/c_fill,h_177,w_280/';
    const suffix = '.jpg';
    let src = '';

    if (innovCard.principalMedia && innovCard.principalMedia.type === 'PHOTO' && innovCard.principalMedia.cloudinary.public_id) {
      src = prefix + innovCard.principalMedia.cloudinary.public_id + suffix;
    } else if (innovCard.media.length > 0) {
      const index = innovCard.media.findIndex((media: Media) => media.type === 'PHOTO');
      if (index !== -1) {
        src = prefix + innovCard.media[index].cloudinary.public_id + suffix;
      }
    }

    return src === '' ? defaultSrc : src;

  }


  getLink(innovCard: InnovCard): string {
    return `/discover/${innovCard.innovation_reference}/${innovCard.lang}`;
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
    return this.domSanitizer1;
  }

  get selectedMedia(): string {
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

  get innovationConfig(): { offset: string; limit: string; sort: string; fields: string } {
    return this._innovationConfig;
  }

}

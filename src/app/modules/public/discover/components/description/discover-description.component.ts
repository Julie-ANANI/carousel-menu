import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  private _facebookUrl: string;

  private _googlePlusUrl: string;

  private _mailUrl: string;

  private _quizButtonDisplay: string;

  private _selectedMedia: string;

  private _lang: string;

  private _id: string;

  private _operatorEmail: string;

  private _tags: Array<string> = [];

  private _modalMedia = false;

  innovationsRelated: Array<InnovCard> = [];

  constructor(private activatedRoute: ActivatedRoute,
              private shareService: ShareService,
              private domSanitizer1: DomSanitizer,
              private router: Router,
              private translateService: TranslateService,
              private innovationService: InnovationService) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this._id = params['id'];
      this._lang = params['lang'];
    });

    this.loadInnovation();

  }

  private loadInnovation() {
    this._innovation = this.activatedRoute.snapshot.data.innovation;

    if (this._innovation.quizId === '' || this._innovation.status === 'DONE') {
      this._quizButtonDisplay = 'none';
    }

    console.log(this._innovation);

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
    this.innovationService.getRecommendedInnovations(this._innovation._id).pipe(first()).subscribe((response) => {
      console.log(response);
    })
  }


  private getAllShareLinks() {

    if (this._innovation.campaigns.length !== 0) {
      this._quizUrl = environment.quizUrl + '/quiz/' + this._innovation.quizId + '/' + this._innovation.campaigns[0].id + '?lang=' + this._lang;
    }

    this._linkedInUrl = this.shareService.linkedinProjectShareLink(this._innovation, this._lang);
    this._twitterUrl = this.shareService.twitterProjectShareLink(this._innovation, this._lang);
    this._facebookUrl = this.shareService.facebookProjectShareLink(this._innovation);
    this._googlePlusUrl = this.shareService.googleProjectShareLink(this._innovation, this._lang);
    this._mailUrl = this.shareService.mailProjectShareLink(this._innovation, this._lang);

  }


  private getOperatorDetails() {
    this._operatorEmail = this._innovation.operator ? this._innovation.operator.email : 'contact@umi.us';
  }


  private getInnovationCard() {
    const innovationCardIndex = this._innovation.innovationCards.findIndex( (card: InnovCard) => card.lang === this._lang);
    this._innovationCard.push(this._innovation.innovationCards[innovationCardIndex]);
  }


  contactUs() {

    const url = encodeURI(this.router.url);

    const message = encodeURI('Please add your message here.' + '\r\n' + '\r\n' + '-------------------------------------' + '\r\n' + '\r\n'
      + 'Innovation Details: ' + '\r\n' + '\r\n' + 'URL - ' + environment.clientUrl + url + '\r\n' + '\r\n' + 'Title - ' + this._innovationCard[0].title + '\r\n' + '\r\n'
      + 'Summary - ' + this._innovationCard[0].summary);

    return ('mailto:' + this._operatorEmail + '?subject=' + 'Contacting us - ' + this._innovationCard[0].title  + '&body=' + message);

  }


  getSrc(src: string): string {
    if (src === '' ) {
      return 'https://res.cloudinary.com/umi/image/upload/v1535383716/app/default-images/image-not-available.png';
    }

    return src;
  }


  mediaToShow(event: Event, src: string) {
    event.preventDefault();
    this._modalMedia = true;
    this._selectedMedia = this.getSrc(src);
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

  get facebookUrl() {
    return this._facebookUrl;
  }

  get googlePlusUrl() {
    return this._googlePlusUrl;
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

}

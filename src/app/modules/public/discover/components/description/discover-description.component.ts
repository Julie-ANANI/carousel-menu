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

@Component({
  selector: 'app-discover-description',
  templateUrl: './discover-description.component.html',
  styleUrls: ['./discover-description.component.scss']
})

export class DiscoverDescriptionComponent implements OnInit {

  private _innovationCard: InnovCard[] = [];

  private innovation: Innovation;

  private _quizUrl: string;

  private _linkedInUrl: string;

  private _twitterUrl: string;

  private _facebookUrl: string;

  private _googlePlusUrl: string;

  private _mailUrl: string;

  private _quizButtonDisplay: string;

  private _mediaModal: boolean;

  private _mediaURL: string;

  private _lang: string;

  private _id: string;

  private _patent = false;

  private _operatorEmail: string;

  tags: Array<string> = [];

  constructor(private activatedRoute: ActivatedRoute,
              private shareService: ShareService,
              private domSanitizer1: DomSanitizer,
              private router: Router,
              private translateService: TranslateService) {}

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this._id = params['id'];
      this._lang = params['lang'];
    });

    this.loadInnovation();

  }

  private loadInnovation() {
    this.innovation = this.activatedRoute.snapshot.data.innovation;

    if (this.innovation.quizId === '' || this.innovation.status === 'DONE') {
      this._quizButtonDisplay = 'none';
    }

    this.getAllTags();
    this.getPatent();
    this.getAllShareLinks();
    this.getOperatorDetails();
    this.getInnovationCard();

  }


  private getAllTags() {
    this.innovation.tags.forEach((tag: Tag) => {
      if (tag.type === 'SECTOR') {
        this.tags.push(MultilingPipe.prototype.transform(tag.label, this.browserLang()));
      }
    });
  }


  browserLang(): string {
    return this.translateService.getBrowserLang() || 'en';
  }



  private getPatent() {
    this._patent = this.innovation.patented;
  }


  private getAllShareLinks() {

    if (this.innovation.campaigns.length !== 0) {
      this._quizUrl = environment.quizUrl + '/quiz/' + this.innovation.quizId + '/' + this.innovation.campaigns[0].id + '?lang=' + this._lang;
    }

    this._linkedInUrl = this.shareService.linkedinProjectShareLink(this.innovation, this._lang);
    this._twitterUrl = this.shareService.twitterProjectShareLink(this.innovation, this._lang);
    this._facebookUrl = this.shareService.facebookProjectShareLink(this.innovation);
    this._googlePlusUrl = this.shareService.googleProjectShareLink(this.innovation, this._lang);
    this._mailUrl = this.shareService.mailProjectShareLink(this.innovation, this._lang);

  }


  private getOperatorDetails() {
    this._operatorEmail = this.innovation.operator ? this.innovation.operator.email : 'contact@umi.us';
  }


  private getInnovationCard() {
    const innovationCardIndex = this.innovation.innovationCards.findIndex( (card: InnovCard) => card.lang === this._lang);
    this._innovationCard.push(this.innovation.innovationCards[innovationCardIndex]);
  }


  contactUs(event: Event) {
    event.preventDefault();

    const url = encodeURI(this.router.url);

    const message = encodeURI('Please add your message here.' + '\r\n' + '\r\n' + '-------------------------------------' + '\r\n' + '\r\n'
      + 'Innovation Details: ' + '\r\n' + '\r\n' + 'URL - ' + environment.clientUrl + url + '\r\n' + '\r\n' + 'Title - ' + this._innovationCard[0].title + '\r\n' + '\r\n'
      + 'Summary - ' + this._innovationCard[0].summary);

    window.location.href = 'mailto:' + this._operatorEmail + '?subject=' + 'Contacting us - ' + this._innovationCard[0].title  + '&body=' + message;

  }


  getSrc(src: string): string {
    if (src === '' ) {
      return 'https://res.cloudinary.com/umi/image/upload/v1535383716/app/default-images/image-not-available.png';
    }

    return src;
  }


  mediaToShow(event: Event, src: string) {
    event.preventDefault();
    this._mediaModal = true;
    this._mediaURL = this.getSrc(src);
  }


  closeModal(event: Event) {
    event.preventDefault();
    this._mediaModal = false;
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

  get mediaModal(): boolean {
    return this._mediaModal;
  }

  get mediaURL(): string {
    return this._mediaURL;
  }

  get patent(): boolean {
    return this._patent;
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

}

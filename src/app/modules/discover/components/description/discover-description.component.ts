import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { InnovCard } from '../../../../models/innov-card';
import { Innovation } from '../../../../models/innovation';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { ShareService } from '../../../../services/share/share.service';
import { environment } from '../../../../../environments/environment';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

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
  private _projectState: number;

  private _displaySpinner = true;

  private _operatorEmail: string;

  constructor(private innovationService: InnovationService,
              private activatedRoute: ActivatedRoute,
              private shareService: ShareService,
              private domSanitizer1: DomSanitizer,
              private translateNotificationsService: TranslateNotificationsService,
              private router: Router) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this._id = params['id'];
      this._lang = params['lang'];
    });

    this.loadInnovation(this._id, this._lang);

  }

  loadInnovation(id: string, lang: string) {
    this.innovationService.get(id).subscribe((response: any) => {

      if (response.quizId === '' || response.status === 'DONE') {
        this._quizButtonDisplay = 'none';
      }

      if (response.campaigns.length !== 0) {
        this._quizUrl = environment.quizUrl + '/quiz/' + response.quizId + '/' + response.campaigns[0].id + '?lang=' + lang;
      }

      this.innovation = response;

      this._patent = response.patented;

      this._operatorEmail = response.operator ? response.operator.email : 'contact@umi.us';

      this._projectState = response.projectStatus;

      this._linkedInUrl = this.shareService.linkedinProjectShareLink(this.innovation, lang);

      this._linkedInUrl = this.shareService.linkedinProjectShareLink(this.innovation, lang);

      this._twitterUrl = this.shareService.twitterProjectShareLink(this.innovation, lang);

      this._facebookUrl = this.shareService.facebookProjectShareLink(this.innovation);

      this._googlePlusUrl = this.shareService.googleProjectShareLink(this.innovation, lang);

      this._mailUrl = this.shareService.mailProjectShareLink(this.innovation, lang);

      const innovationCardIndex = response.innovationCards.findIndex( (card: any) => card.lang === lang);

      this._innovationCard.push(response.innovationCards[innovationCardIndex]);

    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'DISCOVERDESCRIPTION.ERROR');
      this._displaySpinner = false;
    }, () => {
      this._displaySpinner = false;
    });

  }


  contactUs(event: Event) {
    event.preventDefault();

    const url = encodeURI(this.router.url);

    const message = encodeURI('Please add your message here.' + '\r\n' + '\r\n' + '-------------------------------------' + '\r\n' + '\r\n'
      + 'Innovation Details: ' + '\r\n' + '\r\n' + 'URL - ' + environment.innovationUrl + url + '\r\n' + '\r\n' + 'Title - ' + this._innovationCard[0].title + '\r\n' + '\r\n'
      + 'Summary - ' + this._innovationCard[0].summary);

    window.location.href = 'mailto:' + this._operatorEmail + '?subject=' + 'Contacting us - ' + this._innovationCard[0].title  + '&body=' + message;

  }

  getProjectState(value: number) {
    if (value === 0) {
      return 'DISCOVERDESCRIPTION.STAGE.A'
    }

    if (value === 1) {
      return 'DISCOVERDESCRIPTION.STAGE.B'
    }

    if (value === 2) {
      return 'DISCOVERDESCRIPTION.STAGE.C'
    }

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

  get projectState(): number {
    return this._projectState;
  }

  get displaySpinner(): boolean {
    return this._displaySpinner;
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

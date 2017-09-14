import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {
  langSelectOptions,
  projectStatusSelectOptions,
  timeToMarketSelectOptions
} from '../../../../data/innovation.data';
import {initTranslation, TranslateService} from './i18n/i18n';
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {MediaService} from '../../../../services/media/media.service';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import * as flat from 'flat-angular';
import * as _ from 'lodash';


@Component({
  selector: 'app-client-innovation',
  templateUrl: './client-innovation.component.html',
  styleUrls: ['./client-innovation.component.styl']
})
export class ClientInnovationComponent implements OnInit {

  public translationsCardLang: {};

  private _dataLoaded = false;
  private _isSaving = false;

  private _innovation: any;
  private _innovationCards: [any];
  private _actualInnovationCard: any;
  private _deltaInnovation = [];

  private _langOfCard: string;

  private _advantageInput = '';
  private _selectLangInput = '';
  private _langStartIndex = 0;

  private _memPrimaryMedium = {};

  private _filteredLangOptions = [];

  // For modal
  private _wantToCreateNewCard = false;
  private _wantToModifyLang = false;


  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _innovationService: InnovationService,
              private _notificationsService: NotificationsService,
              private _translateService: TranslateService,
              private _mediaService: MediaService) { }


  ngOnInit() {
    // Translations and double lang
    initTranslation(this._translateService);
    this._langOfCard = this._translateService.currentLang;

    this._route.params.subscribe(params => {

      this.loadData(params['innovationId']);

      const timer = TimerObservable.create(6000, 4000); // start in 6s, and repeat every 4s
      timer.subscribe(t => {
        this.save();
      });

    });
  }

  // CREATE & REMOVE
  addAdvantage() {
    if (this._advantageInput) {
      this.innovationCard.advantages.push(this._advantageInput);
      this._advantageInput = '';
      this.addModification('innovationCard.advantages');
    }
  }
  removeAdvantage(advantageToRemove: string) {
    this._actualInnovationCard.advantages.splice(this._actualInnovationCard.advantages.indexOf(advantageToRemove), 1);
    this.addModification('innovationCard.advantages');
  }

  createInnovationCard() {
    const innovationCardObj = {lang: this._selectLangInput};
    this._innovationService.createInnovationCard(this._innovation._id, innovationCardObj).subscribe(data => {
      this.loadData(this._innovation._id, innovationCardObj.lang);
    });
  }
  removeInnovationCard() {
    this._innovationService.removeInnovationCard(this._innovation._id, this._actualInnovationCard._id).subscribe(data => {
      this.loadData(this._innovation._id);
      this.innovationCard = this._innovationCards[0];
    });
  }




  // MEDIA ACTIONS
  addMedia(mediaId: any): void {
    const innocardMedias = this.innovationCard.media;
    const primary = innocardMedias.length === 0;
    innocardMedias.push({id: mediaId['id'], type: 'PHOTO', isPrimary: primary});
    this.addModification('innovationCard.media');
    if (primary) {
      this.innovation.media = {id: mediaId['id'], type: 'PHOTO', isPrimary: primary};
      this.addModification('media');
    }
  }

  getMediaUrl(id): string {
    return this._mediaService.buildUrl(id);
  }

  definePrimary(mediumId) {
    const index = _.findIndex(this._innovationCards, {'lang': this._langOfCard});
    if (index > -1) {
      _.forEach(this._innovationCards[index].media, medium => {
        medium['isPrimary'] = (medium['id'] === mediumId);
      });
      this._memPrimaryMedium = {};
    }
  }

  getPrimary(): any {
    if (_.isEmpty(this._memPrimaryMedium)) {
      if (this._actualInnovationCard.media) {
        const primMedium = _.filter(this._actualInnovationCard.media, {'isPrimary': true});
        this._memPrimaryMedium = primMedium[0] || {};
      }
    }
    return this._memPrimaryMedium;
  }


  useCardWithLang(lang: string) {
    for (const card of this._innovationCards) {
      if (card.lang === lang) {
        this.innovationCard = card; // change card & lang btw
        this.save();
      }
    }
  }

  filterLangsOptions() {
    const langArray = [];
    for (const innovation of this._innovationCards) {
      langArray.push(innovation.lang);
    }
    this._filteredLangOptions = [];
    for (const lang of langSelectOptions) {
      if (langArray.indexOf(lang.key) === -1) {
        this._filteredLangOptions.push(lang);
      }
    }
  }

  ifIsAValidLangOption(lang: string) {
    for (const opt of this._filteredLangOptions) {
      if (opt.key === lang) {
        return lang;
      }
    }
  }



  // SERVER INTERACTIONS
  loadData(innovationId: string, langToUse?: string) {
    this._innovationService.get(innovationId).subscribe(
      innovation => {
        this._innovation = innovation;
        this._innovationCards = innovation.innovationCards;

        if (!this._innovationCards.length) {
          this.createInnovationCard();
          // this._router.navigate(['/projects']);
        }
        else if (this._innovationCards.length > 1) {
          let cardInCurrentLang;
          for (const card of this._innovationCards) {
            if (!cardInCurrentLang) { cardInCurrentLang = this._innovationCards[0]; } // On sauvegarde la premiere version par défaut
            // Si il existe une version dans la langue envoyée en parametre ou sinon dans la langue du site : on enregistre
            else if (langToUse && langToUse === card.lang || !langToUse && card.lang === this._translateService.currentLang) {
              cardInCurrentLang = card;
            }
          }
          this.innovationCard = cardInCurrentLang;
        }
        else {
          this.innovationCard = this._innovationCards[0];
        }

        this._dataLoaded = true;

        const indexOfActual = this._innovationCards.indexOf(this.innovationCard);
        if (indexOfActual !== -1
          && !(this._langStartIndex < indexOfActual && this._langStartIndex + 3 > indexOfActual)) {
          this._langStartIndex = Math.floor(indexOfActual / 3) * 3;
        }
        this.filterLangsOptions();
        this._selectLangInput = this.ifIsAValidLangOption(this._langOfCard)
          || this.ifIsAValidLangOption(this._translateService.getBrowserLang())
          || (this._filteredLangOptions[0] ? this._filteredLangOptions[0].key : 'no-more-langs');

      },
      error => this._notificationsService.error('Erreur', error.message)
    );
  }


  addModification(key: string) {
    this._deltaInnovation.push(key);
  }

  save() {
    if (!this._isSaving) {
      if (this._deltaInnovation.length) {
        this._isSaving = true;
        if (this._deltaInnovation.indexOf('innovationCard.title') !== -1 && !this._innovation.name) {
          this._innovation.name = this._actualInnovationCard.title;
          this._deltaInnovation.push('name');
        }

        let delta = {};
        for (const modification of this._deltaInnovation) {
          delta[modification] = this._innovation[modification] || /^innovationCard\.(\w*)/.exec(modification) && this._actualInnovationCard[/^innovationCard\.(\w*)/.exec(modification)[1]];
        }
        delta = flat.unflatten(delta);
        this._innovationService.save(this._innovation._id, delta, this._actualInnovationCard._id).subscribe(data => {
          this._deltaInnovation = [];
          this._isSaving = false;
        });
      }
    }
  }




  // GETTERs & SETTERs
  get dataLoaded(): boolean {
    return this._dataLoaded;
  }

  get innovationCard(): any {
    return this._actualInnovationCard;
  }

  set innovationCard(card: any) {
    this._actualInnovationCard = card;
    this._langOfCard = card.lang;
  }


  get innovation(): any {
    return this._innovation;
  }

  get langOfCard(): string {
    return this._langOfCard;
  }

  set langOfCard(lang: string) {
    this._actualInnovationCard.lang = lang;
    this._langOfCard = lang;
    console.log(this._langOfCard);
  }

  get translateService(): TranslateService {
    return this._translateService;
  }

  get innovationCardsLangs(): any[] {
    const langs = [];
    if (this._innovationCards) {
      for (const card of this._innovationCards) {
        langs.push(card.lang);
      }
    }
    return langs;
  }

  get threeCardsLangFromIndex(): any[] {
    let tmp = this.innovationCardsLangs;
    tmp = tmp.splice(this._langStartIndex, 3);
    return tmp;
  }


  get wantToCreateNewCard(): boolean {
    return this._wantToCreateNewCard;
  }
  set wantToCreateNewCard(value: boolean) {
    this._wantToCreateNewCard = value;
  }
  get wantToModifyLang(): boolean {
    return this._wantToModifyLang;
  }
  set wantToModifyLang(value: boolean) {
    this._wantToModifyLang = value;
  }

  get langStartIndex(): number { // on les affiche 3 par 3 pour éviter la surcharge visuelle
    return this._langStartIndex;
  }
  set langStartIndex(value: number) {
    this._langStartIndex = value % this._innovationCards.length;
  }

  get advantageInput(): string {
    return this._advantageInput;
  }
  set advantageInput(newVal: string) {
    this._advantageInput = newVal;
  }

  get projectStatusOptions(): any {
    return projectStatusSelectOptions;
  }
  get timeToMarketOptions(): any {
    return timeToMarketSelectOptions;
  }


  get selectLangInput(): string {
    return this._selectLangInput;
  }
  set selectLangInput(value: string) {
    this._selectLangInput = value;
  }

  get langOptions(): any {
    return this._filteredLangOptions;
  }

}

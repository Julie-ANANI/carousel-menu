import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { initTranslation, TranslateService } from './i18n/i18n';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { MediaService } from '../../../../services/media/media.service';

@Component({
  selector: 'app-client-project',
  templateUrl: './client-project.component.html',
  styleUrls: ['./client-project.component.scss']
})
export class ClientProjectComponent implements OnInit {

  private _innovation: any;
  private _innovationCards: [any];
  private _actualInnovationCard: any;
  private _langOfCard: string;

  constructor(private _route: ActivatedRoute,
              private _innovationService: InnovationService,
              private _notificationsService: NotificationsService,
              private _translateService: TranslateService,
              private _mediaService: MediaService) { }


  ngOnInit() {
    // Translations and double lang
    initTranslation(this._translateService);
    // this._langOfCard = this._translateService.currentLang;

    this._route.params.subscribe(params => {
      this.loadData(params['innovationId']);
    });
  }

  // SERVER INTERACTIONS
  loadData(innovationId: string, langToUse?: string) {
    this._innovationService.get(innovationId).subscribe(
      innovation => {
        this._innovation = innovation;
        this._innovationCards = innovation.innovationCards;
      },
      error => this._notificationsService.error('Erreur', error.message)
    );
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
}

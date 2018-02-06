/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from './../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { AnswerService } from '../../../../services/answer/answer.service';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'shared-answer-modal',
  templateUrl: 'shared-answer-modal.component.html',
  styleUrls: ['shared-answer-modal.component.scss']
})

export class SharedAnswerModalComponent implements OnInit {

  private _modalAnswer: any;
  public editMode = false;
  public floor: any;

  @Input() set modalAnswer(value: any) {
    this._modalAnswer = value;
  }
  @Input() public innoid: string;
  @Input() public questions: any[];
  @Input() public adminMode: boolean;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _authService: AuthService,
              private _notificationsService: TranslateNotificationsService,
              private _answerService: AnswerService) { }

  ngOnInit() {
    this.adminMode = this.adminMode && this._authService.adminLevel > 2;
    this.floor = Math.floor;
    
    // On regarde si on a une question 'étoiles'
    const starQuestions = this.questions.filter(q => q.controlType === 'stars');
    if (starQuestions.length) {
      // Si question 'étoiles', on récupère les advantages
      this._innovationService.getInnovationCardByLanguage(this.innoid, 'en').subscribe(cardEn => {
        this._innovationService.getInnovationCardByLanguage(this.innoid, 'fr').subscribe(cardFr => {
          // puis on les assigne aux questions stars
          starQuestions.forEach(question => {
            question.options = [];
            let i = 0;
            let advantagesLeft = true;
            while (advantagesLeft) {
              if ((cardFr && cardFr.advantages && cardFr.advantages[i]) || (cardEn && cardEn.advantages && cardEn.advantages[i])) {
                question.options.push({
                  identifier: i,
                  label: {
                    fr: cardFr && cardFr.advantages && cardFr.advantages[i] ? cardFr.advantages[i]: '',
                    en: cardEn && cardEn.advantages && cardEn.advantages[i] ? cardEn.advantages[i]: ''
                  }
                });
                i++;
              } else {
                advantagesLeft = false;
              }
            }
          })
        });
      });
      
      
    }
  }

  public updateCountry(event) {
    this._modalAnswer.country = event.value[0];
  }

  public changeStatus(status) {
    this._answerService.changeStatus(this._modalAnswer._id, status).subscribe(data => {
      this._notificationsService.success('Mis à jour', 'Statut de la réponse bien mis à jour');
    }), err => {
      this._notificationsService.success('ERROR.ERROR', err);
    }
  }

  updateProfileQuality(object) {
    this._modalAnswer.profileQuality = object.value;
  }

  updateAnswer(answer) {
    this._modalAnswer = answer;
  }

  updateTags(object) {
    this._modalAnswer.tags = object;
  }

  public save() {
    if (this._modalAnswer.professional.email) {
      //Hack : les réponses anciennes n'ont pas de champ quizReference,
      //mais il faut forcément une valeur pour sauvegarder la réponse
      this._modalAnswer.originalAnswerReference = this._modalAnswer.originalAnswerReference || "oldQuiz";
      this._modalAnswer.quizReference = this._modalAnswer.quizReference || "oldQuiz";
      this._modalAnswer.id = this._modalAnswer._id;
      const saveSubs = this._answerService
        .save(this._modalAnswer.id, this._modalAnswer)
        .subscribe(data => {
          this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ANSWER.UPDATED');
        }, err => {
          this._notificationsService.error('ERROR.ERROR', err);
        });
    }
  }

  public buildImageUrl(country: any): string {
    if (country && country.flag) return `https://res.cloudinary.com/umi/image/upload/app/${country.flag}.png`;
    return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
  }

  public close() {
    this.modalAnswerChange.emit(null);
  }

  get lang(): any { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
  get modalAnswer(): any { return this._modalAnswer; }
}

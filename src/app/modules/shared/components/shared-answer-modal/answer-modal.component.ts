/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { AnswerService } from '../../../../services/answer/answer.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Answer } from '../../../../models/answer';
import { Question } from '../../../../models/question';

@Component({
  selector: 'shared-answer-modal',
  templateUrl: 'answer-modal.component.html',
  styleUrls: ['answer-modal.component.scss']
})

export class AnswerModalComponent implements OnInit {

  private _modalAnswer: Answer;
  public editMode = false;
  public floor: any;

  @Input() set modalAnswer(value: Answer) {
    this._modalAnswer = value;
    if (this._modalAnswer && !this._modalAnswer.company) {
      this._modalAnswer.company = {};
    }
  }
  @Input() public innoid: string;
  @Input() public questions: Array<Question>;
  @Input() public adminMode: boolean;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _authService: AuthService,
              private _notificationsService: TranslateNotificationsService,
              private _answerService: AnswerService) { }

  ngOnInit() {

    this.adminMode = this.adminMode && this._authService.adminLevel > 2;
    this.adminMode = true;
    this.floor = Math.floor;

    // On regarde si on a une question 'étoiles'
    const starQuestions = this.questions.filter(q => q && q.controlType === 'stars');
    if (starQuestions.length) {
      // Si question 'étoiles', on récupère les advantages
      // TODO: merge the 2 following subscribers in only one
      this._innovationService.getInnovationCardByLanguage(this.innoid, 'en').first().subscribe(cardEn => {
        this._innovationService.getInnovationCardByLanguage(this.innoid, 'fr').first().subscribe(cardFr => {
          // puis on les assigne aux questions stars
          starQuestions.forEach(question => {
            question.options = [];
            let i = 0;
            let advantagesLeft = true;
            while (advantagesLeft) {
              if ((cardFr && cardFr.advantages && cardFr.advantages[i] && cardFr.advantages[i].text)
                || (cardEn && cardEn.advantages && cardEn.advantages[i] && cardEn.advantages[i].text)) {
                question.options.push({
                  identifier: i.toString(),
                  label: {
                    fr: cardFr && cardFr.advantages && cardFr.advantages[i] ? cardFr.advantages[i].text : '',
                    en: cardEn && cardEn.advantages && cardEn.advantages[i] ? cardEn.advantages[i].text : ''
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

  public updateCountry(event: {value: Array<any>}) {
    this._modalAnswer.country = event.value[0];
  }

  public changeStatus(event: Event, status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED') {
    event.preventDefault();
    this._answerService.changeStatus(this._modalAnswer._id, status)
      .first()
      .subscribe((_: void) => {
        this._notificationsService.success('Mis à jour', 'Statut de la réponse bien mis à jour');
      }, (err: string) => {
        this._notificationsService.success('ERROR.ERROR', err);
      });
  }

  updateProfileQuality(object: {value: number}) {
    this._modalAnswer.profileQuality = object.value;
  }

  updateAnswer(answer: Answer) {
    this._modalAnswer = answer;
  }

  updateTags(object: Array<string>) {
    this._modalAnswer.tags = object;
  }

  public save(event: Event) {
    event.preventDefault();
    if (this._modalAnswer.professional.email) {
      // Hack : les réponses anciennes n'ont pas de champ quizReference,
      // mais il faut forcément une valeur pour sauvegarder la réponse
      // TODO: remove this hack
      this._modalAnswer.originalAnswerReference = this._modalAnswer.originalAnswerReference || 'oldQuiz';
      this._modalAnswer.quizReference = this._modalAnswer.quizReference || 'oldQuiz';
      this._answerService
        .save(this._modalAnswer._id, this._modalAnswer)
        .first()
        .subscribe(_ => {
          this._notificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ANSWER.UPDATED');
        }, err => {
          this._notificationsService.error('ERROR.ERROR', err);
        });
    }
  }

  public close(event: Event): void {

    event.preventDefault();
    //this.editMode = !this.editMode;
    this.modalAnswerChange.emit(null);
  }

  get lang(): string { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
  get modalAnswer() { return this._modalAnswer; }
}

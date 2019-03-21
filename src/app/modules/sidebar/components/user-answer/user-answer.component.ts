import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { first } from 'rxjs/operators';
import { Question } from '../../../../models/question';
import { Answer } from '../../../../models/answer';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Tag } from '../../../../models/tag';
import { InnovCard } from '../../../../models/innov-card';
import { SidebarInterface } from '../../interfaces/sidebar-interface';

@Component({
  selector: 'app-user-answer',
  templateUrl: './user-answer.component.html',
  styleUrls: ['./user-answer.component.scss']
})

export class UserAnswerComponent implements OnInit {

  @Input() set sidebarState(value: SidebarInterface) {
    if (value === undefined || value === 'active') {
      this.reinitializeVariables();
    }
  }

  @Input() set projectId(value: string) {
    this._innovationId = value;
  }

  @Input() questions: Array<Question>;

  @Input() adminMode: boolean;

  @Input() set userAnswer(value: Answer) {
    this._modalAnswer = value;
    if (this._modalAnswer && !this._modalAnswer.company) {
      this._modalAnswer.company = {};
    }
  }

  @Output() answerUpdated = new EventEmitter<boolean>();

  private _modalAnswer: Answer;

  private _floor: any;

  private _displayEmail = false;

  private _editJob = false;

  private _editCompany = false;

  private _editCountry = false;

  private _editMode = false;

  private _innovationId = '';

  constructor(private translateService: TranslateService,
              private answerService: AnswerService,
              private translateNotificationsService: TranslateNotificationsService,
              private innovationService: InnovationService) { }

  ngOnInit() {
    // this.adminMode = this.adminMode && this.authService.adminLevel > 2;

    this._floor = Math.floor;

    // On regarde si on a une question 'étoiles'
    const starQuestions = this.questions.filter(q => q && q.controlType === 'stars');

    if (starQuestions.length) {
      // Si question 'étoiles', on récupère les advantages
      // TODO: merge the 2 following subscribers in only one
      this.innovationService.getInnovationCardByLanguage(this._innovationId, 'en').pipe(first()).subscribe((cardEn: InnovCard) => {
        this.innovationService.getInnovationCardByLanguage(this._innovationId, 'fr').pipe(first()).subscribe((cardFr: InnovCard) => {
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


  private reinitializeVariables() {
    this._editMode = false;
  }


  resetEdit() {
    this._editJob = false;
    this._editCompany = false;
    this._editCountry = false;
  }


  changeMode(event: Event) {
    if (event.target['checked']) {
      this._editMode = true;
    } else {
      this._editMode = false;
      this.resetEdit();
    }
  }


  onClickEdit(activate: string) {

    switch (activate) {

      case 'country':
        this._editCountry = true;
        break;

      case 'job':
        this._editJob = true;
        break;

      case 'company':
        this._editCompany = true;
        break;

      default:
        //do nothing...

    }

  }


  save(event: Event) {
    event.preventDefault();

    this.resetEdit();

    if (this._modalAnswer.professional.email) {
      // Hack : les réponses anciennes n'ont pas de champ quizReference,
      // mais il faut forcément une valeur pour sauvegarder la réponse
      // TODO: remove this hack
      this._modalAnswer.originalAnswerReference = this._modalAnswer.originalAnswerReference || 'oldQuiz';
      this._modalAnswer.quizReference = this._modalAnswer.quizReference || 'oldQuiz';

      this.answerService.save(this._modalAnswer._id, this._modalAnswer).pipe(first()).subscribe(() => {
        this.translateNotificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ANSWER.UPDATED');
        this.answerUpdated.emit(true);
        }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });
    }

  }


  updateProfileQuality(object: {value: number}) {
    this._modalAnswer.profileQuality = object.value;
  }


  updateCountry(event: {value: Array<any>}) {
    this._modalAnswer.country = event.value[0];
  }


  updateStatus(event: Event, status: any) {
    event.preventDefault();

    if (this._editMode) {
      this._modalAnswer.status = status;
      this._displayEmail = (status === 'VALIDATED' || status === 'VALIDATED_NO_MAIL');
    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.NOT_MODIFIED.USER_ANSWER');
    }

  }


  sendEmail(event: Event, status: any) {
    if (event.target['checked']) {
      this.updateStatus(event, status);
    } else {
      this.updateStatus(event, 'VALIDATED_NO_MAIL');
    }
  }


  addTag(tag: Tag): void {
    this.answerService.addTag(this._modalAnswer._id, tag._id).pipe(first()).subscribe(() => {
      this.translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.ADDED');
      this._modalAnswer.tags.push(tag);
      this.answerUpdated.emit(true);
      }, (err: any) => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
    });
  }


  createTag(tag: Tag): void {
    this.answerService.createTag(this._modalAnswer._id, tag).pipe(first()).subscribe(() => {
      this.translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.ADDED');
      this._modalAnswer.tags.push(tag);
      this.answerUpdated.emit(true);
      }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
    });
  }


  removeTag(tag: Tag): void {
    this.answerService.removeTag(this._modalAnswer._id, tag._id).pipe(first()).subscribe((a: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.REMOVED');
      this._modalAnswer.tags = this._modalAnswer.tags.filter(t => t._id !== tag._id);
      this.answerUpdated.emit(true);
      }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  importAnswer(event: Event): void {
    event.preventDefault();

    this.answerService.importFromQuiz(this._modalAnswer).pipe(first()).subscribe((_res: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.ANSWER.IMPORTED');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }

  public meta2Question(): any {
    /*
    readonly label: Multiling;
  readonly title: Multiling;
  readonly _id?: string;
  readonly subtitle: Multiling;
  identifier: string;
  controlType: 'checkbox' | 'clearbit' | 'list' | 'radio' | 'scale' | 'stars' | 'textarea' | 'toggle';
  canComment: boolean;
  readonly parameters?: {
    type: 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'tel' | 'text' | 'time' | 'url' | 'week';
    addon: string;
    min: number;
    max: number;
    step: number;
  }
     */
    let question = {
      label: "Reply message",
      title: "Reply message",
      subtitle: "-",
      identifier: "randomstring",
      controlType: 'textarea',
      canComment: false
    };
    return question;
  }

  get meta(): any {
    return this._modalAnswer['meta'] || {};
  }

  get lang(): string {
    return this.translateService.currentLang || this.translateService.getBrowserLang() || 'en';
  }

  get modalAnswer(): Answer {
    return this._modalAnswer;
  }

  get floor(): any {
    return this._floor;
  }

  get displayEmail(): boolean {
    return this._displayEmail;
  }

  get editJob(): boolean {
    return this._editJob;
  }

  get editCompany(): boolean {
    return this._editCompany;
  }

  get editCountry(): boolean {
    return this._editCountry;
  }

  get editMode(): boolean {
    return this._editMode;
  }

  get innovationId(): string {
    return this._innovationId;
  }

}

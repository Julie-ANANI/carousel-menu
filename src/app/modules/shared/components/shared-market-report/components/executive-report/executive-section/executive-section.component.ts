import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Answer } from '../../../../../../../models/answer';
import { Question } from '../../../../../../../models/question';
import { Subject } from 'rxjs/Subject';
import { ResponseService } from '../../../services/response.service';
import { Innovation } from '../../../../../../../models/innovation';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { InnovationCommonService } from '../../../../../../../services/innovation/innovation-common.service';

@Component({
  selector: 'app-executive-section',
  templateUrl: './executive-section.component.html',
  styleUrls: ['./executive-section.component.scss']
})

export class ExecutiveSectionComponent implements OnInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this.innovation = value;
    this.getQuestions(value);
  }

  @Input() set section(value: number) {
    this.sectionNumber = value;
  }

  ngUnsubscribe: Subject<any> = new Subject();

  answers: Array<Answer> = [];

  answersToShow: Array<Answer> = [];

  innovation: Innovation;

  sectionMenuOptions: Array<Question> = [];

  questions: Array<Question> = [];

  sectionNumber: number;

  selectedQuestion: Question;

  abstract = '';

  adminSide: boolean;

  stats: { nbAnswers?: number, percentage?: number };

  constructor(private responseService: ResponseService,
              private location: Location,
              private translateService: TranslateService,
              private innovationCommonService: InnovationCommonService) { }

  ngOnInit() {
    this.isAdminSide();
    this.getAnswers();

    /***
     * this is when we update the innovation in any component,
     * we are listening that update and will update the innovation attribute.
     */
    this.innovationCommonService.getInnovation().takeUntil(this.ngUnsubscribe).subscribe((response: Innovation) => {
      if (response) {
        this.innovation = response;
      }
    });

  }


  /***
   * here we are getting the answers that was set on Market report ts file.
   */
  private getAnswers() {
    this.responseService.getExecutiveAnswers().takeUntil(this.ngUnsubscribe).subscribe((response) => {
      if (response !== null) {
        this.answers = response;
        this.getSectionInformation(this.sectionNumber);
      }
    });
  }


  /***
   * This function is to get the questions from the service, and then push it into the
   * respective arrays.
   * @param {Innovation} value
   */
  private getQuestions(value: Innovation) {
    if (value.preset && value.preset.sections) {
      this.responseService.getPresets(value).forEach((questions) => {
        const index = this.questions.findIndex((question) => question._id === questions._id);
        if (index === -1) {
          this.questions.push(questions);
          this.sectionMenuOptions.push(questions);
        }
      });
    }
  }


  /**
   * This function is checking the are we on the admin side.
   */
  private isAdminSide() {
    this.adminSide = this.location.path().slice(0, 6) === '/admin';
  }


  /***
   * This function is called when the operator clicked on anyone title
   * then we select that question and save that question id.
   * @param {Event} event
   * @param {Question} option
   */
  onTitleClicked(event: Event, option: Question) {
    this.innovation.executiveReport.sections[this.sectionNumber].quesId = option._id;
    this.innovationCommonService.saveInnovation(this.innovation);
    this.getSectionInformation(this.sectionNumber);
  }


  /***
   * Based on the sectionNumber we get the question id from the executiveReport.sections array and fill that section
   * with all the details.
   * @param {number} sectionNumber
   */
  private getSectionInformation(sectionNumber: number) {
    this.selectedQuestion = this.questions.find((ques) => ques._id === this.innovation.executiveReport.sections[sectionNumber].quesId);

    if (this.selectedQuestion) {
      this.answersToShow = this.responseService.getAnswersToShow(this.answers, this.selectedQuestion);
      this.stats = {
        nbAnswers: this.answersToShow.length,
        percentage: Math.round((this.answersToShow.length * 100) / this.answers.length)
      };
    }

  }

  get lang(): string {
    return this.translateService.currentLang;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.unsubscribe();
  }

}

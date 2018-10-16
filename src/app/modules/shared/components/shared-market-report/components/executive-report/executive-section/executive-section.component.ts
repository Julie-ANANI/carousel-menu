import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Answer } from '../../../../../../../models/answer';
import { Question } from '../../../../../../../models/question';
import { Subject } from 'rxjs/Subject';
import { ResponseService } from '../../../services/response.service';
import { Innovation } from '../../../../../../../models/innovation';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
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
    this.sectionNumberReceived = value;
  }

  ngUnsubscribe: Subject<any> = new Subject();

  answersReceived: Array<Answer> = [];

  answersToShow: Array<Answer> = [];

  innovation: Innovation;

  sectionMenuOptions: Array<Question> = [];

  questionReceived: Array<Question> = [];

  sectionNumberReceived: number;

  selectedQuestion: Question;

  abstract = '';

  adminSide: boolean;

  stats: { nbAnswers?: number, percentage?: number };

  constructor(private responseService: ResponseService,
              private location: Location,
              private translateService: TranslateService,
              private innovationService: InnovationService,
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
        this.answersReceived = response;
        this.getSectionInformation(this.sectionNumberReceived);
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
        const index = this.questionReceived.findIndex((question) => question._id === questions._id);
        if (index === -1) {
          this.questionReceived.push(questions);
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
    this.innovation.executiveReport.sections[this.sectionNumberReceived].quesId = option._id;
    this.update(event);
    this.getSectionInformation(this.sectionNumberReceived);
  }


  /***
   * This function is to update the project.
   */
  update(event: Event) {
    // TODO: add project status DONE
    if (this.innovation.status) {
      this.innovationService.save(this.innovation._id, this.innovation).first().subscribe((response: Innovation) => {
        this.innovation = response;
        this.innovationCommonService.setInnovation(response);
      });
    }
  }


  /***
   * Based on the sectionNumber we get the question id from the executiveReport.sections array and fill that section
   * with all the details.
   * @param {number} sectionNumber
   */
  private getSectionInformation(sectionNumber: number) {
    this.selectedQuestion = this.questionReceived.find((ques) => ques._id === this.innovation.executiveReport.sections[sectionNumber].quesId);

    if (this.selectedQuestion) {
      this.answersToShow = this.responseService.getAnswersToShow(this.answersReceived, this.selectedQuestion);
      this.stats = {
        nbAnswers: this.answersToShow.length,
        percentage: Math.round((this.answersToShow.length * 100) / this.answersReceived.length)
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

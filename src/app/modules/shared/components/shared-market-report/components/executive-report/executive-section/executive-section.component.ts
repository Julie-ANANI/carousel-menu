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
    this.getSectionInformation(value);
  }

  ngUnsubscribe: Subject<any> = new Subject();

  answerReceived: Array<Answer> = [];

  innovation: Innovation;

  sectionMenuOptions: Array<Question> = [];

  questionReceived: Array<Question> = [];

  sectionNumberReceived: number;

  selectedQuestion: Question;

  abstract = '';

  adminSide: boolean;

  constructor(private responseService: ResponseService,
              private location: Location,
              private translateService: TranslateService,
              private innovationService: InnovationService,
              private innovationCommonService: InnovationCommonService) { }

  ngOnInit() {
    this.getAnswers();
    this.isAdminSide();

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

  private getAnswers() {
    this.responseService.getExecutiveAnswers().takeUntil(this.ngUnsubscribe).subscribe((response) => {
      if (response !== null) {
        this.answerReceived = response;
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
   * This function is checking the are we on the admin side, and if yes than also
   * checking the admin level.
   */
  private isAdminSide() {
    this.adminSide = this.location.path().slice(0, 6) === '/admin';
    // this.adminMode = this.authService.adminLevel > 2;
  }

  /***
   * This function is called when the operator clicked on anyone title
   * then we select that question and save that question id.
   * @param {Event} event
   * @param {Question} option
   */
  onTitleClicked(event: Event, option: Question) {
    event.preventDefault();

    this.innovation.executiveReport.sections[this.sectionNumberReceived].quesId = option._id;

    this.selectedQuestion = option;

    /*const index = this.innovation.executiveReport.sections.findIndex((item: { sectionPlace: number, quesId: string }) => item.sectionPlace === this.sectionNumberReceived);

    let value: { sectionPlace: number, quesId: string };
    value = { sectionPlace: this.sectionNumberReceived, quesId: option._id };

    if (index === -1) {
      this.innovation.executiveReport.sections.push(value);
    } else {
      this.innovation.executiveReport.sections[index] = value;
    }*/

    // this.getSectionInformation(this.sectionNumberReceived);

    this.update(event);

  }

  /***
   * This function is to update the project.
   * @param {Event} event
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

  private getSectionInformation(sectionNumber: number) {
    const ques = this.questionReceived.findIndex((ques) => ques._id === this.innovation.executiveReport.sections[sectionNumber].quesId);
    if (ques !== -1) {
      this.selectedQuestion = this.questionReceived[ques];
    }
  }

  get lang(): string {
    return this.translateService.currentLang;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.unsubscribe();
  }

}

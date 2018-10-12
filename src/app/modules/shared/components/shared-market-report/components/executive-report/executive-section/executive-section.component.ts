import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Answer } from '../../../../../../../models/answer';
import { Question } from '../../../../../../../models/question';
import { Subject } from 'rxjs/Subject';
import { ResponseService } from '../../../services/response.service';
import { Innovation } from '../../../../../../../models/innovation';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';

@Component({
  selector: 'app-executive-section',
  templateUrl: './executive-section.component.html',
  styleUrls: ['./executive-section.component.scss']
})

export class ExecutiveSectionComponent implements OnInit, OnDestroy {

  @Input() set innovation(value: Innovation) {
    this.innovationReceived = value;
    this.executiveReport = value.executiveReport;
    this.getQuestions(value);
  }

  @Input() set section(value: number) {
    this.sectionNumberReceived = value;
    this.getSectionInformation();
    console.log(this.executiveReport);
  }

  ngUnsubscribe: Subject<any> = new Subject();

  answerReceived: Array<Answer> = [];

  innovationReceived: Innovation;

  sectionMenuOptions: Array<Question> = [];

  executiveReport: any = {};

  sectionValue: [{ question: Question, sectionPlace: number }] = null;

  questionReceived: Array<Question> = [];

  sectionNumberReceived: number;

  adminSide: boolean;

  constructor(private responseService: ResponseService,
              private location: Location,
              private translateService: TranslateService,
              private innovationService: InnovationService) { }

  ngOnInit() {
    this.getAnswers();
    this.isAdminSide();
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
   * then we select that question and pass that question to the parent component
   * to update the question menu options array.
   * @param {Event} event
   * @param {Question} option
   */
  onTitleClicked(event: Event, option: Question) {
    event.preventDefault();
    this.executiveReport.sections = [{
      question: {
        identifier: option.identifier,
        title: option.title,
        id: option._id,
        controlType: option.controlType
      },
      sectionPlace: this.sectionNumberReceived
    }];
    this.update(event);
  }

  /***
   * This function is to update the project.
   * @param {Event} event
   */
  update(event: Event) {
    // TODO: add project status DONE
    if (this.innovationReceived.status) {
      this.innovationService.save(this.innovationReceived._id, this.innovationReceived).first().subscribe((response) => {
        this.innovationReceived = response;
        console.log(response);
      });
    }
  }

  private getSectionInformation() {
    if (this.sectionNumberReceived && this.executiveReport && this.executiveReport.sections) {

    }
  }

  get lang(): string {
    return this.translateService.currentLang;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}

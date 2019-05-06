import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from '../../services/filters.service';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Tag } from '../../../../../../models/tag';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseService } from '../../services/response.service';
import { BarData } from '../../models/bar-data';
import { first } from 'rxjs/operators';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: 'bar-chart.component.html',
  styleUrls: ['bar-chart.component.scss']
})

export class BarChartComponent implements OnInit {

  @Input() innovation: Innovation;

  @Input() set executiveReport(value: boolean) {
    this._executiveReportView = value;
  }

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this._updateAnswersData();
  }

  @Input() tags: Array<Tag>;

  @Input() question: Question;

  @Input() readonly: boolean;

  @Input() stats: any;

  @Input() toggleAnswers: boolean = false;

  @Output() modalAnswerChange = new EventEmitter<any>();

  @Output() answerButtonClicked = new EventEmitter<boolean>();

  private _adminSide: boolean;

  private _formBarChart: FormGroup;

  private _executiveReportView = false;

  private _answers: Array<Answer>;

  private _barsData: Array<BarData> = [];

  private _pieChart: { data: Array<number>, colors: Array<string>, labels: {[prop: string]: Array<string>}, percentage?: number, labelPercentage?: Array<string> };

  private _showAnswers: {[index: string]: string} = {};

  constructor(private _translateService: TranslateService,
              private _filterService: FilterService,
              private _location: Location,
              private _formBuilder: FormBuilder,
              private _innovationService: InnovationService,
              private _translateNotificationService: TranslateNotificationsService,
              private _responseService: ResponseService) { }

  ngOnInit() {

    /***
     * this is to make visible abstract textarea.
     * @type {boolean}
     */
    this._adminSide = this._location.path().slice(5, 11) === '/admin';

    this._updateAnswersData();

    this._buildForm();

    this._patchForm();

  }


  /***
   * Build the form using quesId.
   */
  private _buildForm() {
    this._formBarChart = this._formBuilder.group({
      [this.question._id]: ['']
    });
  }


  /***
   * Patch the abstract value for each question.
   */
  private _patchForm() {
    const value = this._responseService.getInnovationAbstract(this.innovation, this.question._id);
    this._formBarChart.get(this.question._id).setValue(value);
  }


  private _updateAnswersData(): void {
    if (this.question && this.question.identifier && Array.isArray(this.question.options)) {

      // Calcul bar Data
      this._barsData = this.question.options.map((q) => {
        let answers: Array<Answer> = [];
        if (this.question.controlType === 'checkbox') {
          answers = this._answers.filter((a) =>
            a.answers[this.question.identifier]
            && a.answers[this.question.identifier][q.identifier]
            && a.answers[this.question.identifier + 'Quality'] !== 0);

        } else if (this.question.controlType === 'radio')  {
          answers = this._answers.filter((a) =>
            a.answers[this.question.identifier] === q.identifier
            && a.answers[this.question.identifier + 'Quality'] !== 0 );

        }
        answers = answers.sort((a, b) => {
          if ((b.answers[this.question.identifier + 'Quality'] || 1) - (a.answers[this.question.identifier + 'Quality'] || 1) === 0) {
            const a_length = a.answers[this.question.identifier + 'Comment'] ? a.answers[this.question.identifier + 'Comment'].length : 0;
            const b_length = b.answers[this.question.identifier + 'Comment'] ? b.answers[this.question.identifier + 'Comment'].length : 0;
            return b_length - a_length;
          } else {
            return (b.answers[this.question.identifier + 'Quality'] || 1) - (a.answers[this.question.identifier + 'Quality'] || 1);
          }
        });
        return {
          label: q.label,
          answers: answers,
          absolutePercentage: '0%',
          relativePercentage: '0%',
          color: q.color,
          count: answers.length,
          positive: q.positive,
          identifier: q.identifier
        }
      });

      // Then calcul percentages
      const maxAnswersCount = this._barsData.reduce((acc, bd) => {
        return (acc < bd.count) ? bd.count : acc;
      }, 0);
      this._barsData.forEach((bd) => {
        bd.absolutePercentage = `${((bd.count * 100) / this._answers.length) >> 0}%`;
        bd.relativePercentage = `${((bd.count * 100) / maxAnswersCount) >> 0}%`;
      });

      // If we have a radio question, we should also calculate the pieChart data.
      if (this.question.controlType === 'radio') {
        let positiveAnswersCount = 0;
        const pieChartData: {data: Array<number>, colors: Array<string>, labels: {fr: Array<string>, en: Array<string>}, percentage?: number, labelPercentage?: Array<string>} = {
          data: [],
          colors: [],
          labels: {fr: [], en: []},
          labelPercentage: []
        };
        this._barsData.forEach((barData) => {
          if (barData.positive) {
            positiveAnswersCount += barData.count;
          }
          pieChartData.data.push(barData.count);
          pieChartData.colors.push(barData.color);
          pieChartData.labels.fr.push(barData.label.fr);
          pieChartData.labels.en.push(barData.label.en);
          pieChartData.labelPercentage.push(barData.absolutePercentage);
        });
        pieChartData.percentage = Math.round((positiveAnswersCount * 100) / this._answers.length);
        this._pieChart = pieChartData;
      }

    }

  }


  public filterAnswer(data: BarData, event: Event) {
    event.preventDefault();
    let filterValue;
    if (this._filterService.filters[this.question.identifier]) {
      filterValue = this._filterService.filters[this.question.identifier].value;
    } else {
      filterValue = this.question.options.reduce((acc, opt) => { acc[opt.identifier] = true; return acc; }, {});
    }
    filterValue[data.identifier] = !filterValue[data.identifier];
    const removeFilter = Object.keys(filterValue).every((k) => filterValue[k] === true);
    if (removeFilter) {
      this._filterService.deleteFilter(this.question.identifier);
    } else {
      this._filterService.addFilter({
        status: <'CHECKBOX'|'RADIO'> this.question.controlType.toUpperCase(),
        questionId: this.question.identifier,
        value: filterValue
      });
    }
  }


  public seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }


  public toggleAnswer(event: Event) {
    event.preventDefault();
    this.toggleAnswers = !this.toggleAnswers;
    this.answerButtonClicked.emit(this.toggleAnswers);
  }

  /***
   * This function is to save the abstract in the innovation object.
   * @param {Event} event
   * @param {string} formControlName
   */
  public saveAbstract(event: Event, formControlName: string) {
    const abstract = this._formBarChart.get(formControlName).value;
    this.innovation = this._responseService.saveInnovationAbstract(this.innovation, abstract, formControlName);

    this._innovationService.save(this.innovation._id, this.innovation).pipe(first()).subscribe(() => { }, () => {
      this._translateNotificationService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  /***
   * This function returns the color according to the length of the input data.
   * @param {number} length
   * @param {number} limit
   * @returns {string}
   */
  public getColor(length: number, limit: number) {
    return this._responseService.getColor(length, limit);
  }

  get filter() {
    return this._filterService.filters[this.question.identifier];
  }

  get barsData(): Array<BarData> {
    return this._barsData;
  }

  get lang(): string {
    return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
  }

  get pieChart() {
    return this._pieChart;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

  get formBarChart(): FormGroup {
    return this._formBarChart;
  }

  get executiveReportView(): boolean {
    return this._executiveReportView;
  }

  get showAnswers(): { [p: string]: string } {
    return this._showAnswers;
  }

}

import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from '../../services/filters.service';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseService } from '../../services/response.service';
import { BarData } from '../../models/bar-data';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { PieChart } from '../../../../../../models/pie-chart';
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-bar-chart',
  templateUrl: 'bar-chart.component.html',
  styleUrls: ['bar-chart.component.scss']
})

export class BarChartComponent implements OnInit {

  @Input() innovation: Innovation;

  @Input() question: Question;

  @Input() readonly: boolean;

  @Input() stats: any;

  @Input() toggleAnswers: boolean = false;

  @Output() modalAnswerChange = new EventEmitter<any>();

  @Output() answerButtonClicked = new EventEmitter<boolean>();

  private _adminSide: boolean = false;

  private _formBarChart: FormGroup;

  private _barsData: Array<BarData> = [];

  private _pieChart: PieChart;

  private _showAnswers: {[index: string]: boolean} = {};

  private _toggleFilterIcon: {[index: string]: boolean} = {};

  constructor(private _translateService: TranslateService,
              private _dataService: DataService,
              private _filterService: FilterService,
              private _location: Location,
              private _formBuilder: FormBuilder,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _responseService: ResponseService) {

    this._adminSide = this._location.path().slice(5, 11) === '/admin';

  }

  ngOnInit() {
    /* Build Form */
    this._formBarChart = this._formBuilder.group({
      [this.question._id]: ['']
    });

    /* Patch form */
    const value = this._responseService.getInnovationAbstract(this.innovation, this.question._id);
    this._formBarChart.get(this.question._id).setValue(value);

    /* Update Answers Data */
    this._dataService.getAnswers(this.question._id).subscribe((answers: Array<Answer>) => {
      this._barsData = ResponseService.getBarsData(this.question, answers);
      if (this.question.controlType === 'radio') {
        this._pieChart = ResponseService.getPieChartData(this._barsData, answers);
      }
    });
  }

  public filterAnswer(data: BarData, event: Event) {
    event.preventDefault();
    let filterValue: any;
    if (this._filterService.filters[this.question.identifier]) {
      filterValue = this._filterService.filters[this.question.identifier].value;
    } else {
      filterValue = this.question.options.reduce((acc, opt) => { acc[opt.identifier] = true; return acc; }, {} as any);
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

    this._innovationService.save(this.innovation._id, this.innovation).subscribe(() => {
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });

  }


  public color(length: number, limit: number) {
    return InnovationFrontService.getColor(length, limit);
  }

  get filter() {
    return this._filterService.filters[this.question.identifier];
  }

  get barsData(): Array<BarData> {
    return this._barsData;
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get pieChart(): PieChart {
    return this._pieChart;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

  get formBarChart(): FormGroup {
    return this._formBarChart;
  }

  get showAnswers(): { [p: string]: boolean } {
    return this._showAnswers;
  }

  get toggleFilterIcon(): { [p: string]: boolean } {
    return this._toggleFilterIcon;
  }

}

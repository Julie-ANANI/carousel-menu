import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {ExecutiveProfessional} from '../../../../../../models/executive-report';
import {CommonService} from '../../../../../../services/common/common.service';
import {SnippetService} from '../../../../../../services/snippet/snippet.service';
import {ExecutiveReportFrontService} from '../../../../../../services/executive-report/executive-report-front.service';
import {Answer} from '../../../../../../models/answer';
import {Professional} from '../../../../../../models/professional';


@Component({
  selector: 'app-admin-executive-professional',
  templateUrl: './executive-professional.component.html',
  styleUrls: ['./executive-professional.component.scss']
})

export class ExecutiveProfessionalComponent implements OnInit {

  @Input() isEditable = false;

  @Input() lang = 'en';

  @Input() set allAnswers(value: Array<Answer>) {
    this._allAnswers = value;
    this._sortAnswers();
  }

  @Input() set config(value: ExecutiveProfessional) {
    this._config = value;
    this._sortAnswers();
  }

  @Input() set anonymous(value: boolean) {
    this._anonymous = !!value;
  }

  @Output() configChange: EventEmitter<ExecutiveProfessional> = new EventEmitter<ExecutiveProfessional>();

  private _config: ExecutiveProfessional = <ExecutiveProfessional>{
    abstract: '',
    list: []
  };

  private _professionalAbstractColor = '';

  private _top4Pros: Array<Professional> = [<Professional>{}, <Professional>{}, <Professional>{}, <Professional>{}];

  private _allAnswers: Array<Answer> = [];

  private _anonymous = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _executiveReportFrontService: ExecutiveReportFrontService) { }

  ngOnInit(): void {
    this.textColor();
  }

  private _sortAnswers() {
    if (this._allAnswers && this._allAnswers.length) {
      for (let i = 0; i < this._config.list.length; i++) {
        const proId = this._config.list[i];
        const topAnswer = this._allAnswers.find(answer => answer.professional._id === proId);
        if (topAnswer) {
          this._top4Pros[i] = topAnswer.professional;
        }
      }

      this._allAnswers.sort((a, b) => {
        const nameA = (a.professional.firstName + a.professional.lastName).toLowerCase();
        const nameB = (b.professional.firstName + b.professional.lastName).toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }
  }
  public textColor() {
    this._professionalAbstractColor = CommonService.getLimitColor(this._config.abstract, 258);
  }

  public onClickPlay(event: Event) {
    event.preventDefault();
    this._executiveReportFrontService.audio(this._config.abstract, this.lang);
  }

  public onClickSnippet(event: Event) {
    event.preventDefault();
    this._config.abstract = SnippetService.storyboard('PROFESSIONAL', this.lang);
    this.textColor();
    this.emitChanges();
  }

  public emitChanges() {
    if (this.isEditable) {
      this.configChange.emit(this._config);
    }
  }

  public selectAnswer(event: Event, index: number) {
    const answerId = event && event.target && (event.target as HTMLSelectElement).value;
    this._top4Pros[index] = this._allAnswers.find(answer => answer._id === answerId).professional;
    this._top4Pros.forEach((professional, i) => {
      if (professional) {
        this.config.list[i] = professional._id;
      }
    });
    this.emitChanges();
  }

  get config(): ExecutiveProfessional {
    return this._config;
  }

  get professionalAbstractColor(): string {
    return this._professionalAbstractColor;
  }

  get top4Pros(): Array<Professional> {
    return this._top4Pros;
  }

  get allAnswers(): Array<Answer> {
    return this._allAnswers;
  }

  get anonymous(): boolean {
    return this._anonymous;
  }
}

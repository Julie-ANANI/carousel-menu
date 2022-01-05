import { Component, Inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { OldExecutiveReport } from '../../../../../models/innovation';
import { ExecutiveReport } from '../../../../../models/executive-report';
import { Professional } from '../../../../../models/professional';
import { AnswerService } from '../../../../../services/answer/answer.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Clearbit } from '../../../../../models/clearbit';
import { TranslateNotificationsService } from "../../../../../services/translate-notifications/translate-notifications.service";
import { ErrorFrontService } from "../../../../../services/error/error-front.service";

interface ProfessionalColumn {
  countries: Array<string>;
  targetAbstract: string;
  profileAbstract: string;
  answers: string;
}

@Component({
  selector: 'app-print-report-professional',
  templateUrl: './report-professional.component.html',
  styleUrls: ['./report-professional.component.scss']
})

export class ReportProfessionalComponent implements OnChanges {

  @Input() report: OldExecutiveReport | ExecutiveReport = <OldExecutiveReport | ExecutiveReport>{};

  @Input() answers: Array<Answer> = [];

  @Input() set anonymous(value: boolean) {
    this._anonymous = !!value;
  }

  private _pros: Array<{ company: Clearbit; jobTitle: string; country: {flag: string}; }> = [];

  private _professional: ProfessionalColumn = <ProfessionalColumn>{};

  private _anonymous = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateNotificationsService: TranslateNotificationsService,
              private _answerService: AnswerService) { }

  ngOnChanges(): void {
    if (this.report['totalSections'] && this.answers.length > 0 && !this.report['_id']) {
      this._typeInnovation();
    } else if (this.answers.length === 0 && this.report['professionals'] && this.report['targeting'] && this.report['_id']) {
      this._typeExecutive();
    }
  }

  /***
   * it the object type is Innovation.
   * @private
   */
  private _typeInnovation() {
    const data: OldExecutiveReport = <OldExecutiveReport>this.report;
    this._pros = this._topProfessionals();
    this._professional = {
      targetAbstract: data.professionalAbstract,
      profileAbstract: '',
      countries: this._targetCountries(),
      answers: data.lang === 'fr' ? `${this.answers.length.toString(10)} réponses` : `${this.answers.length.toString(10)} answers`
    };
  }

  /***
   * if the object type is Executive report
   * @private
   */
  private _typeExecutive() {
    const data: ExecutiveReport = <ExecutiveReport>this.report;

    if (data.professionals.list.length > 0) {
      this._getAnswers(data.professionals.list);
    }

    this._professional = {
      targetAbstract: data.targeting.abstract,
      profileAbstract: data.professionals.abstract,
      countries: data.targeting.countries,
      answers: data.lang === 'fr' ? `${data.answers} réponses` : `${data.answers} answers`
    };
  }

  /***
   * getting the flag of the countries.
   * @private
   */
  private _targetCountries(): Array<string> {
    return this.answers.reduce((acc, answer) => {
      if (!!answer.country &&
        !!answer.country.flag &&
        acc.indexOf(answer.country.flag) === -1) {
        acc.push(answer.country.flag);
      }
      return acc;
    }, []);
  }

  /***
   * getting the top professionals
   */
  private _topProfessionals(): Array<any> {
    let professionals: Array<any> = [];

    this.answers.forEach((items) => {
      if (items.profileQuality === 2) {
        professionals.push(items);
      }
    });

    if (professionals.length < 4) {
      this.answers.forEach((items) => {
        const find = professionals.find((professional) => professional._id === items._id);
        if (!find) {
          professionals.push(items);
        }
      });
    }

    if (professionals.length > 0) {
      professionals = professionals.slice(0, 4).map((value: Professional) => {
        return {
          country: value.country && value.country['flag'],
          jobTitle: value['job'] || value.jobTitle,
          company: value.company && value.company['name']
        };
      });
    }

    return professionals;

  }

  /***
   * when the type of object is Executive report we get the list of the pros and
   * based on that we get the pros from the back.
   * @private
   */
  private _getAnswers(list: Array<string>) {
    if (isPlatformBrowser(this._platformId)) {
      const config = {
        fields: '_id job company country',
        _id: JSON.stringify({ $in: list.slice(0, 4) })
      };

      this._answerService.getAll(config).pipe(first()).subscribe((answers) => {
        if (answers && answers.result) {
          this._pros = list.slice(0, 4).map((answerId: string) => {
            const answer = answers.result.find((value: Answer) => value._id === answerId);
            return {
              country: answer.country,
              jobTitle: answer.job,
              company: answer.company
            };
          });
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

  get professional(): ProfessionalColumn {
    return this._professional;
  }

  get pros(): Array<{ company: Clearbit; jobTitle: string; country: {flag: string} }> {
    return this._pros;
  }

  get anonymous(): boolean {
    return this._anonymous;
  }

}

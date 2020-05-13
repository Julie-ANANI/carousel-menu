import { Component, Inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { OldExecutiveReport } from '../../../../../models/innovation';
import { ExecutiveReport } from '../../../../../models/executive-report';
import { Professional } from '../../../../../models/professional';
import { ProfessionalsService } from '../../../../../services/professionals/professionals.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

interface ProfessionalColumn {
  title: string;
  countries: Array<string>;
  targetAbstract: string;
  profileAbstract: string;
  answers: string;
}

@Component({
  selector: 'report-professional',
  templateUrl: './report-professional.component.html',
  styleUrls: ['./report-professional.component.scss']
})

export class ReportProfessionalComponent implements OnChanges {

  @Input() userLang = 'en';

  @Input() report: OldExecutiveReport | ExecutiveReport = <OldExecutiveReport | ExecutiveReport>{};

  @Input() answers: Array<Answer> = [];

  private _pros: Array<{ company: string; jobTitle: string; country: string; }> = [];

  private _professional: ProfessionalColumn = <ProfessionalColumn>{};

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _professionalsService: ProfessionalsService) { }

  ngOnChanges(): void {
    if (this.report['totalSections'] && this.answers.length > 0) {
      this._typeInnovation();
    } else if (this.answers.length === 0 && this.report['professionals'] && this.report['targeting']) {
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
      title: this.userLang === 'fr' ? 'Professionnels qualifiés' : 'Qualified professionals',
      targetAbstract: data.professionalAbstract,
      profileAbstract: '',
      countries: this._targetCountries(),
      answers: this.userLang === 'fr' ? `${this.answers.length.toString(10)} réponses` : `${this.answers.length.toString(10)} answers`
    };
  }

  /***
   * if the object type is Executive report
   * @private
   */
  private _typeExecutive() {
    const data: ExecutiveReport = <ExecutiveReport>this.report;

    if (data.professionals.list.length > 0) {
      this._getProfessionals(data.professionals.list);
    }

    this._professional = {
      title: data.lang === 'fr' ? 'Professionnels qualifiés' : 'Qualified professionals',
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
      if (acc.indexOf(answer.country.flag) === -1) {
        acc.push(answer.country.flag);
      }
      return acc;
    }, []);
  };

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
  private _getProfessionals(list: Array<string>) {
    if (isPlatformBrowser(this._platformId)) {
      const config = {
        fields: '_id firstName lastName jobTitle company country',
        _id: JSON.stringify({ $in: list.slice(0, 4) })
      };

      this._professionalsService.getAll(config).pipe(first()).subscribe((professionals) => {
        if (professionals && professionals.result) {
          this._pros = professionals.result.map((value: any) => {
            return {
              country: value.country,
              jobTitle: value.jobTitle,
              company: value.company
            };
          });
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  get professional(): ProfessionalColumn {
    return this._professional;
  }

  get pros(): Array<{ company: string; jobTitle: string; country: string }> {
    return this._pros;
  }

}

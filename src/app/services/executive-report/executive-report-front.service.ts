import { Injectable } from '@angular/core';
import { SectionBar, SectionKpi, SectionPie, SectionQuote, SectionRanking } from '../../models/executive-report';
import { Professional } from '../../models/professional';
import { BarData } from '../../modules/shared/components/shared-market-report/models/bar-data';
import { ResponseService } from '../../modules/shared/components/shared-market-report/services/response.service';
import { specialCharRegEx } from '../../utils/regex';
import { MultilingPipe } from '../../pipe/pipes/multiling.pipe';
import { Tag } from '../../models/tag';
import { PieChart } from '../../models/pie-chart';
import { ExecutiveReportService } from './executive-report.service';
import { TranslateNotificationsService } from '../translate-notifications/translate-notifications.service';
import { first} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../error/error-front.service';
import { CommonService } from '../common/common.service';
import {Answer} from '../../models/answer';

@Injectable({ providedIn: 'root' })
export class ExecutiveReportFrontService {

  constructor(private _multilingPipe: MultilingPipe,
              private _commonService: CommonService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _executiveReportService: ExecutiveReportService) { }

  /***
   * this returns the content of the KPI section.
   * @param professionals
   * @param totalAnswers
   */
  public static kpiSection(professionals: Array<Professional>, totalAnswers: string): SectionKpi {

    const section: SectionKpi = {
      kpi: totalAnswers,
      examples: '',
      legend: ''
    };

    if (professionals && professionals.length > 0) {
      section.examples = professionals.map((professional, index) => {
        return index === 0 ? professional.firstName + ' ' + professional.lastName
          : ' ' + professional.firstName + ' ' + professional.lastName;
      }).toString().slice(0, 175);
    }

    return section;

  }

  /***
   * this returns the content of the Quote section.
   */
  public static quoteSection(): SectionQuote {
    return {
      showQuotes: true,
      quotation: '',
      name: '',
      job: '',
    };
  }

  /***
   * this returns the content of the PIE section.
   * @param pieChartData
   * @param lang
   */
  public static pieChartSection(pieChartData: PieChart, lang: string): SectionPie {

    const section: SectionPie = {
      favorable_answers: {
        percentage: 0,
        visibility: false
      },
      values: []
    };

    if (pieChartData && (pieChartData.percentage || pieChartData.data)) {

      if (pieChartData.percentage) {
        section.favorable_answers = {
          percentage: pieChartData.percentage,
          visibility: pieChartData.percentage > 0
        };
      }

      if (pieChartData.data) {
        pieChartData.data.forEach((data, index) => {
          section.values.push({
            percentage: pieChartData.labelPercentage && pieChartData.labelPercentage[index]
              && Number(pieChartData.labelPercentage[index].replace(specialCharRegEx, '')) || 0,
            color: pieChartData.colors && pieChartData.colors[index],
            legend: pieChartData.labels && pieChartData.labels[lang] && pieChartData.labels[lang][index],
            answers: data
          });
        });
      }

    } else {

      section.favorable_answers = {
        percentage: 0,
        visibility: false
      };

      for (let i = 0; i < 4; i++) {
        section.values.push({
          percentage: 25,
          color: i === 0 ? '#C0210F' : i === 1 ? '#82CD30' : i === 2 ? '#34AC01' : '#F2C500',
          legend: '',
          answers: 0
        });
      }

    }

    return section;

  }

  /***
   * this returns the content of the BAR section.
   * @param barsData
   * @param lang
   */
  public barSection(barsData: Array<BarData>, lang: string): SectionBar {

    const section: SectionBar = {
      showExamples: true,
      values: []
    };

    if (barsData && barsData.length > 0) {

      barsData.slice(0, 3).forEach((bar) => {

        const professionals: Array<Professional> = ResponseService.answersProfessionals(bar.answers);

        section.values.push({
          name: this._multilingPipe.transform(bar.label, lang),
          visibility: (Number(bar.absolutePercentage.replace(specialCharRegEx, '')) || 0) > 0,
          percentage: Number(bar.absolutePercentage.replace(specialCharRegEx, '')) || 0,
          legend: professionals.map((professional, index) => {
            return index === 0 ? professional.jobTitle : ' ' + professional.jobTitle;
          }).toString().slice(0, 40)
        });
      });
    } else {
      for (let i = 0; i < 3; i++) {
        section.values.push({
          percentage: 0,
          legend: '',
          name: '',
          visibility: false
        });
      }
    }

    return section;

  }

  /***
   * this returns the content of the RANKING section for tags.
   * @param tagsData
   * @param lang
   */

  public rankingTagsSection(tagsData: Array<Tag>, lang: string): SectionRanking {

    const section: SectionRanking = {
      values: []
    };

    if (tagsData && tagsData.length > 0) {
      tagsData.slice(0, 3).forEach((tag) => {
        section.values.push({
          legend: tag.count + 'X',
          color: '#4F5D6B',
          name: this._multilingPipe.transform(tag.label, lang),
          visibility: tag.count > 0
        });
      });
    } else {
      for (let i = 0; i < 3; i++) {
        section.values.push({
          color: '#4F5D6B',
          legend: '',
          name: '',
          visibility: false
        });
      }
    }

    return section;

  }


  /***
   * this returns the content of the RANKING section.
   * @param rankingData
   * @param lang
   */
  public rankingSection(rankingData: {label: string, answers: Answer[]; percentage: number; count: number; identifier: string; }[],
                        lang: string): SectionRanking {

    const section: SectionRanking = {
      values: []
    };

    if (rankingData && rankingData.length > 0) {
      rankingData.slice(0, 3).forEach((rank, index) => {
        section.values.push({
          legend: (index + 1).toString(),
          color: '#4F5D6B',
          name: rank.label,
          visibility: true
        });
      });
    } else {
      for (let i = 0; i < 3; i++) {
        section.values.push({
          color: '#4F5D6B',
          legend: '',
          name: '',
          visibility: false
        });
      }
    }

    return section;

  }

  /***
   * play the text.
   * @param text
   * @param lang
   */
  public audio(text: string, lang: string = 'en') {
    if (text) {
      this._executiveReportService.audio(text, lang).pipe(first()).subscribe((file) => {
        this._commonService.playAudio(file.audioContent);
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      });
    } else {
      this._translateNotificationsService.error('Error', 'The text could not be empty.');
    }
  }

}

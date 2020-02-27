import { Injectable } from '@angular/core';
import { SectionBar, SectionKpi, SectionPie, SectionRanking } from '../../models/executive-report';
import { Professional } from '../../models/professional';
import { BarData } from '../../modules/shared/components/shared-market-report/models/bar-data';
import { ResponseService } from '../../modules/shared/components/shared-market-report/services/response.service';
import { specialCharRegEx } from '../../utils/regex';
import { MultilingPipe } from '../../pipe/pipes/multiling.pipe';
import { Tag } from '../../models/tag';
import { PieChart } from '../../models/pie-chart';

@Injectable({ providedIn: 'root' })
export class ExecutiveReportFrontService {

  constructor(private _multilingPipe: MultilingPipe) { }

  /***
   * this returns the content of the KPI section.
   * @param professionals
   * @param totalAnswers
   */
  public static kpiSection(professionals: Array<Professional>, totalAnswers: string): SectionKpi {

    const section: SectionKpi = {
      value: totalAnswers,
      examples: '',
      name: ''
    };

    if (professionals && professionals.length > 0) {
      section.examples = professionals.map((professional, index) => {
        return index === 0 ? professional.firstName + ' ' + professional.lastName
          : ' ' + professional.firstName + ' ' + professional.lastName
      }).toString().slice(0, 175);
    }

    return section;

  }

  /***
   * this returns the content of the PIE section.
   * @param pieChartData
   * @param lang
   */
  public static pieChartSection(pieChartData: PieChart, lang: string): SectionPie {

    const section: SectionPie = {
      showPositive: false,
      favorable: '',
      values: []
    };

    if (pieChartData) {

      if (pieChartData.percentage) {
        section.favorable = pieChartData.percentage + '%';
        section.showPositive = true;
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

      barsData.slice(0, 3).forEach((bar, index) => {

        const professionals: Array<Professional> = ResponseService.answersProfessionals(bar.answers);

        section.values.push({
          name: this._multilingPipe.transform(bar.label, lang),
          value: Number(bar.absolutePercentage.replace(specialCharRegEx, '')) || 0,
          example: professionals.map((professional, index) => {
            return index === 0 ? professional.jobTitle : ' ' + professional.jobTitle
          }).toString().slice(0, 40)
        })
      });
    }

    return section;

  }

  /***
   * this returns the content of the RANKING section.
   * @param tagsData
   * @param lang
   */
  public rankingSection(tagsData: Array<Tag>, lang: string): SectionRanking {

    const section: SectionRanking = {
      color: '#4F5D6B',
      values: []
    };

    if (tagsData && tagsData.length > 0) {
      tagsData.slice(0, 3).forEach((tag) => {
        section.values.push({
          occurrence: tag.count + 'X',
          name: this._multilingPipe.transform(tag.label, lang)
        })
      });
    }

    return section;

  }


}

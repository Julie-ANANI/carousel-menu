/**
 * Created by Abhishek SAINI on 03-01-2022
 */

import { Injectable } from '@angular/core';
import {LangEntryPipe} from '../../pipe/lang-entry/lang-entry.pipe';
import {PieChart, PieChartLabel} from '../../models/pie-chart';

@Injectable({
  providedIn: 'root'
})
export class LangEntryService extends LangEntryPipe {

  /**
   * from the list of the entry it will return the single entry based on the 'lang' param.
   * @param entry - actual entry list can be of any type, but it should have the lang property.
   * @param requested
   * @param lang - requested lang
   * @param returnDefault = true means if not find the entry in the given lang then return the entry at index 0
   */
  transform(entry: Array<any>, lang: string = 'en', requested: 'ENTRY' | 'INDEX' = 'ENTRY',  returnDefault: boolean = false): any {
    return super.transform(entry, lang, requested, returnDefault);
  }

  /**
   * return the label of the PieChart.
   * @param pieData
   * @param lang
   * @param index
   */
  public pieChartLabel(pieData: PieChart, lang: string, index: number): string {
    let label = '';

    if (Array.isArray(pieData.labels) && pieData.labels.length > 0) {
      const entry: PieChartLabel = this.transform(pieData.labels, lang);
      if (entry && entry.value && entry.value.length) {
        label = entry.value[index];
      }
    } else if (pieData.labels && pieData.labels[lang] && pieData.labels[lang][index]) {
      label = pieData.labels[lang][index];
    }

    return label;
  }

}

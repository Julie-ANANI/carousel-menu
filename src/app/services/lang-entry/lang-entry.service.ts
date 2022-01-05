/**
 * Created by Abhishek SAINI on 03-01-2022
 */

import { Injectable } from '@angular/core';
import {LangEntryPipe} from '../../pipe/lang-entry/lang-entry.pipe';
import {PieChart, PieChartLabel} from '../../models/pie-chart';
import {InnovationFollowUpEmails} from '../../models/innovation';
import {EmailMultiling} from '../../models/email';

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
   * return the innovation follow-up email object
   * @param followEmails
   * @param templateName - should be same InnovationFollowUpTemplateType and also in uppercase.
   */
  public static followUpEmails(followEmails: InnovationFollowUpEmails, templateName: string): EmailMultiling {
    if (!followEmails || !templateName) return {};

    if (followEmails.templates && followEmails.templates.length) {
      const template = followEmails.templates.find((_template) => _template.name === templateName);
      if (!template && !template.entry && !template.entry.length) return {};
      const email = {};
      template.entry.map((_entry) => {
        email[_entry.lang] = {
          subject: _entry.subject,
          content: _entry.content
        };
      });
      return email;
    }

    return followEmails[templateName.toLocaleLowerCase()] || {};
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

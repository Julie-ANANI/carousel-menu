/**
 * Created by Abhishek SAINI on 03-01-2022
 */

import { Injectable } from '@angular/core';
import {PieChart} from '../../models/chart/pie-chart';
import {InnovationFollowUpEmails} from '../../models/innovation';
import {EmailMultiling} from '../../models/email';
import {Tag} from '../../models/tag';
import {TransactionalEmail} from '../../models/transactional-email';
import {JobConfig, JobsTypologies} from '../../models/target-pros';
import {TranslateService} from '@ngx-translate/core';
import {UmiusLangEntryService} from '@umius/umi-common-component';

/**
 * UmiusLangEntryService functions:
 *
 * 1. transform(value: any, requested: string, lang: string = 'en', returnDefault: boolean = false): any;
 */

@Injectable({
  providedIn: 'root'
})
export class LangEntryService extends UmiusLangEntryService {

  constructor(protected _translateService: TranslateService) {
    super(_translateService);
  }

  /**
   * return the entry index based on the searchValue and the searchKey with which we compare the value
   * for ex: _entry[lang] === 'en' => lang (searchKey) & en (searchValue)
   * @param entry
   * @param searchKey
   * @param searchValue
   */
  public static entryIndex(entry: Array<any>, searchKey: string, searchValue: string): number {
    if (!entry.length || !searchKey || !searchValue) return -1;
    return entry.findIndex((_entry) => _entry[searchKey] === searchValue);
  }

  /**
   * return the innovation follow-up email object
   * @param followEmails
   * @param templateName - should be same InnovationFollowUpTemplateType and also in uppercase.
   */
  public static followUpEmails(followEmails: InnovationFollowUpEmails, templateName: string): EmailMultiling {
    if (!followEmails || !templateName) return {};

    if (followEmails.templates && followEmails.templates.length) {
      // TODO remove console
      console.log('New Multi-language system.');
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
   * this is to convert the Array<TransactionalEmailTemplate> into en: EmailTemplate format
   * to work with the current components.
   * @param email
   */
  public static transactionalEmails(email: TransactionalEmail): TransactionalEmail {
    if (!email) return <TransactionalEmail>{};
    if (email.templates && email.templates.length) {
      // TODO remove console
      console.log('New Multi-language system.');
      email.templates.forEach((_template) => {
        if (!email[_template.lang]) email[_template.lang] = {};
        email[_template.lang] = _template.template;
      });
    }
    return email;
  }

  /**
   * this is to convert the Array<TargetProsJobEntry> into the already existing properties
   * given through type.
   * like this: name: { en: string, fr: string } or label: { en: string, fr: string }
   * @param job
   * @param type
   */
  public static jobEntry(job: JobConfig | JobsTypologies, type: 'name' | 'label'): any {
    if (!job || !type) return <JobConfig | JobsTypologies>{};
    if (job.entry && job.entry.length) {
      // TODO remove console
      console.log('New Multi-language system.');
      const object = {};
      job.entry.forEach((_entry) => {
        object[_entry.lang] = _entry.value;
      });
      job[type] = object;
    }
    return job;
  }

  /**
   * return the requested value from the tag object.
   * @param tag
   * @param requested - 'label' | 'description' | 'originalLabel'
   * @param lang
   * @param returnDefault
   */
  public tagEntry(tag: Tag, requested: string, lang = 'en', returnDefault = true): string {
    if (!tag || !requested) return '';
    if (tag.entry && tag.entry.length) {
      return this.transform(tag.entry, requested, lang, returnDefault);
    }
    return this.transform(tag, requested, lang, returnDefault);
  }

  /**
   * return the label of the PieChart.
   * @param pieData
   * @param lang
   * @param index
   */
  public pieChartLabel(pieData: PieChart, lang: string, index: number): string {
    if (!pieData || !lang) return '';
    if (Array.isArray(pieData.labels) && pieData.labels.length > 0) {
      const value: Array<string> = this.transform(pieData.labels, 'value', lang);
      return (value.length && value[index]) || '';
    }
    return (pieData.labels && pieData.labels[lang] && pieData.labels[lang][index]) || '';
  }

}

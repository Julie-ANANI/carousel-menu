import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MissionTemplate, MissionTemplateSection} from '../../../../../models/mission';
import {MissionFrontService} from '../../../../../services/mission/mission-front.service';
import {DOCUMENT} from '@angular/common';
import {PageScrollService} from 'ngx-page-scroll-core';

/**
 * example: New project component.
 */

@Component({
  selector: 'app-market-test-objectives',
  templateUrl: './market-test-objectives.component.html',
  styleUrls: ['./market-test-objectives.component.scss']
})
export class MarketTestObjectivesComponent {

  get isTemplateChanged(): boolean {
    return this._isTemplateChanged;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get selectedCategory(): string {
    return this._selectedCategory;
  }

  get objectivesCategory(): Array<string> {
    return this._objectivesCategory;
  }

  get missionTemplates(): Array<MissionTemplate> {
    return this._missionTemplates;
  }

  get selectedTemplate(): MissionTemplate {
    return this._selectedTemplate;
  }

  get missionTemplate(): MissionTemplate {
    return this._missionTemplate;
  }

  get objectiveComment(): string {
    return this._objectiveComment;
  }

  /**
   * make it true if you include this component in the modal because page scroll does not work.
   */
  @Input() insideModal = false;

  /**
   * actual list of the mission templates we get from the back.
   * we do not modify it.
   */
  @Input() set missionTemplates(value: Array<MissionTemplate>) {
    this._missionTemplates = value.map((template) => {
      const enIndex = template.entry.findIndex((entry: any) => entry.lang === 'en');
      if (enIndex !== -1) {
        switch (template.entry[enIndex].objective) {
          case 'Detecting market needs':
          case 'Validating market needs':
          case 'Sourcing solutions / suppliers':
            template['category'] = 'INNOVATE';
            break;

          case 'Identifying receptive markets':
          case 'Validating the interest in my project':
          case 'Optimizing my value proposition':
            template['category'] = 'INNOVATION';
            break;
        }
      }
      return template;
    });
  }

  @Input() set objectiveComment(value: string) {
    this._objectiveComment = value;
    this.objectiveCommentChange.emit(this._objectiveComment);
  }

  /**
   * pass the selected mission template here then we search that template into the list of templates
   * and assign that as selected template.
   * @param value
   */
  @Input() set missionTemplate(value: MissionTemplate) {
    this._missionTemplate = value || <MissionTemplate>{};

    if (!!this._missionTemplate._id && this._missionTemplates.length) {
      const template = this._missionTemplates.find((_template) => _template._id === this._missionTemplate._id);

      if (!!template) {
        this._selectedTemplate = template;
        this._selectedCategory = template['category'];
      }
    }
  }

  /**
   * emit the selected template with all the updated value in it.
   */
  @Output() missionTemplateChange: EventEmitter<MissionTemplate> = new EventEmitter<MissionTemplate>();

  /**
   * emit the change in the mission objective comment.
   */
  @Output() objectiveCommentChange: EventEmitter<string> = new EventEmitter<string>();

  private _selectedCategory = '';

  private _objectivesCategory: Array<string> = ['INNOVATE', 'INNOVATION'];

  private _selectedTemplate: MissionTemplate = <MissionTemplate>{};

  private _missionTemplates: Array<MissionTemplate> = [];

  private _missionTemplate: MissionTemplate = <MissionTemplate>{};

  private _objectiveComment = '';

  private _selectedSectionsObjectives: Array<MissionTemplateSection> = [];

  private _isTemplateChanged = false;

  constructor(@Inject(DOCUMENT) private _document: Document,
              private _pageScrollService: PageScrollService,
              private _translateService: TranslateService) { }

  public onChangeCategory(event: Event, value: string) {
    event.preventDefault();
    if (value !== this._selectedCategory) {
      this._selectedCategory = value;
      this._selectedTemplate = <MissionTemplate>{};
    }
  }

  public onChangeTemplate(event: Event, value: MissionTemplate) {
    event.preventDefault();
    if (this._selectedCategory && this._selectedCategory === value['category']) {
      this._selectedTemplate = value;
      this._isTemplateChanged = true;
      this._selectedSectionsObjectives = [];
      this._emitTemplate();
    }
  }

  /**
   * before emitting it we remove the category attribute because we use it
   * to enable / disable the template respective to its category.
   * @private
   */
  private _emitTemplate() {
    const template: MissionTemplate = JSON.parse(JSON.stringify(this._selectedTemplate));
    delete template['category'];
    if (!this._selectedSectionsObjectives.length) {
      template.sections = MissionFrontService.resetComplementaryObjectives(template.sections);
    } else {
      template.sections = this._selectedSectionsObjectives;
    }
    this.missionTemplateChange.emit(template);
  }

  public onChangeObjectivesComplementary(event: Array<MissionTemplateSection>) {
    this._selectedSectionsObjectives = event;
    this._emitTemplate();
  }

  public templateName(template: MissionTemplate, lang = this.currentLang): string {
    return MissionFrontService.objectiveName(template, lang);
  }

  /**
   * scroll to view
   * @param elementId
   * @param scrollOffset
   */
  public scrollTo(elementId: string, scrollOffset = 0) {
    if (!this.insideModal) {
      this._pageScrollService.scroll({
        document: this._document,
        scrollTarget: elementId,
        scrollOffset: scrollOffset
      });
    }
  }

}

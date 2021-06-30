import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MissionQuestion, MissionTemplateSection} from '../../../../../models/mission';
import {MissionFrontService} from '../../../../../services/mission/mission-front.service';

type template = 'TEMPLATE_1' | 'TEMPLATE_2';

/**
 * example: Market test objective component.
 */

@Component({
  selector: 'app-market-test-objectives-complementary',
  templateUrl: './market-test-objectives-complementary.component.html',
  styleUrls: ['./market-test-objectives-complementary.component.scss']
})
export class MarketTestObjectivesComplementaryComponent {

  get selectedSectionsObjectives(): Array<MissionTemplateSection> {
    return this._selectedSectionsObjectives;
  }

  get templateSections(): Array<MissionTemplateSection> {
    return this._templateSections;
  }

  get objectiveComment(): string {
    return this._objectiveComment;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  /**
   * when we change the template value in the parent we make it true
   * so that questions are not checked because sometimes we have the same
   * questions in other templates and they are checked by default.
   */
  @Input() isTemplateChanged = false;

  /**
   * TEMPLATE_1 : show the objective row by row.
   * TEMPLATE_2 : show more than one objective in the row.
   */
  @Input() template: template = 'TEMPLATE_1';

  /**
   * pass the actual list of mission template sections.
   * we do not modify them.
   */
  @Input() set templateSections(value: Array<MissionTemplateSection>) {
    this._templateSections = value;
  }

  /**
   * pass the selected objectives with the section info.
   * @param value
   */
  @Input() set selectedSectionsObjectives(value: Array<MissionTemplateSection>) {
    this._selectedSectionsObjectives = value || [];
  }

  @Input() set objectiveComment(value: string) {
    this._objectiveComment = value;
  }

  /**
   * emits the comment written in the textarea.
   */
  @Output() objectiveCommentChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * emits the selected objectives with the section info.
   */
  @Output() templateSectionsChange: EventEmitter<Array<MissionTemplateSection>> = new EventEmitter<Array<MissionTemplateSection>>();

  private _objectiveComment = '';

  private _templateSections: Array<MissionTemplateSection> = [];

  private _selectedSectionsObjectives: Array<MissionTemplateSection> = [];

  constructor(private _translateService: TranslateService) { }

  public onChangeOption(event: Event, value: MissionQuestion, sectionIndex: number) {
    event.preventDefault();

    if (!this._selectedSectionsObjectives.length) {
      this._selectedSectionsObjectives = JSON.parse(JSON.stringify(this._templateSections));
      this._selectedSectionsObjectives = MissionFrontService.resetComplementaryObjectives(this._selectedSectionsObjectives);
    }

    if (this._selectedSectionsObjectives.length) {
      if (((event.target) as HTMLInputElement).checked) {
        this._selectedSectionsObjectives[sectionIndex].questions.push(value);
      } else {
        const index = this._selectedSectionsObjectives[sectionIndex].questions.findIndex((objective) => {
          return objective._id === value._id;
        });
        if (index !== -1) {
          this._selectedSectionsObjectives[sectionIndex].questions.splice(index, 1);
        }
      }

      this.templateSectionsChange.emit(this._selectedSectionsObjectives);
    }
  }

  public isChecked(value: MissionQuestion, sectionIndex: number): boolean {
    if (this._selectedSectionsObjectives.length && this._selectedSectionsObjectives[sectionIndex] && !this.isTemplateChanged) {
      return this._selectedSectionsObjectives[sectionIndex].questions.some((objective) => {
        return objective._id === value._id;
      });
    }
    return false;
  }

  public objectiveName(value: MissionQuestion): string {
    return MissionFrontService.objectiveName(value, this.currentLang);
  }

  public emitCommentChange() {
    this.objectiveCommentChange.emit(this._objectiveComment.trim());
  }

}

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

  /**
   * TEMPLATE_1 : show the objective row by row.
   * TEMPLATE_2 : show more than one objective in the row.
   */
  @Input() template: template = 'TEMPLATE_1';

  /**
   * pass the actual list of mission template sections.
   * we do not modify them.
   */
  @Input() templateSections: Array<MissionTemplateSection> = [];

  /**
   * pass the selected objectives with the section info.
   */
  @Input() selectedSectionsObjectives: Array<MissionTemplateSection> = [];

  /**
   * pass the comment return for the objectives.
   */
  @Input() objectiveComment = '';

  /**
   * emits the comment written in the textarea.
   */
  @Output() objectiveCommentChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * emits the selected objectives with the section info.
   */
  @Output() templateSectionsChange: EventEmitter<Array<MissionTemplateSection>> = new EventEmitter<Array<MissionTemplateSection>>();

  constructor(private _translateService: TranslateService) { }

  public onChangeOption(event: Event, value: MissionQuestion, sectionIndex: number) {
    event.preventDefault();

    if (((event.target) as HTMLInputElement).checked) {
      this.selectedSectionsObjectives[sectionIndex].questions.push(value);
    } else {
      const index = this.selectedSectionsObjectives[sectionIndex].questions.findIndex((objective: MissionQuestion) => {
        return objective._id === value._id;
      });
      if (index !== -1) {
        this.selectedSectionsObjectives[sectionIndex].questions.splice(index, 1);
      }
    }

    this.templateSectionsChange.emit(this.selectedSectionsObjectives);
  }

  public isChecked(value: MissionQuestion, sectionIndex: number): boolean {
    if (this.selectedSectionsObjectives.length && this.selectedSectionsObjectives[sectionIndex]) {
      return this.selectedSectionsObjectives[sectionIndex].questions.some((objective: MissionQuestion) => {
        return objective._id === value._id;
      });
    }
    return false;
  }

  public objectiveName(value: MissionQuestion): string {
    return MissionFrontService.objectiveName(value, this.currentLang);
  }

  public emitCommentChange() {
    this.objectiveCommentChange.emit(this.objectiveComment.trim());
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

}

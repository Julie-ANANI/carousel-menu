import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MissionQuestion} from '../../../../../models/mission';
import {MissionFrontService} from '../../../../../services/mission/mission-front.service';

/**
 * example: Market test objective component.
 */

@Component({
  selector: 'app-market-test-objectives-complementary',
  templateUrl: './market-test-objectives-complementary.component.html',
  styleUrls: ['./market-test-objectives-complementary.component.scss']
})
export class MarketTestObjectivesComplementaryComponent {

  get templateComment(): string {
    return this._templateComment;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  /**
   * actual list of the complementary objectives.
   * we do not modify it here.
   */
  @Input() objectivesComplementary: Array<MissionQuestion> = [];

  @Input() set templateComment(value: string) {
    this._templateComment = value;
  }

  /**
   * emits the comment written in the textarea.
   */
  @Output() templateCommentChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * emits the selected objectives list.
   */
  @Output() objectivesComplementaryChange: EventEmitter<Array<MissionQuestion>> = new EventEmitter<Array<MissionQuestion>>();

  private _templateComment = '';

  private _selectedObjectives: Array<MissionQuestion> = [];

  constructor(private _translateService: TranslateService) { }

  public onChangeOption(event: Event, value: MissionQuestion) {
    event.preventDefault();

    if (((event.target) as HTMLInputElement).checked) {
      this._selectedObjectives.push(value);
    } else {
      const index = this._selectedObjectives.findIndex((objective) => objective._id === value._id);
      if (index !== -1) {
        this._selectedObjectives.splice(index, 1);
      }
    }

    this.objectivesComplementaryChange.emit(this._selectedObjectives);
  }

  public isChecked(value: MissionQuestion): boolean {
    return this._selectedObjectives.some((objective) => objective._id === value._id);
  }

  public objectiveName(value: MissionQuestion): string {
    return MissionFrontService.objectiveName(value, this.currentLang);
  }

  public emitCommentChange() {
    this.templateCommentChange.emit(this._templateComment.trim());
  }

}

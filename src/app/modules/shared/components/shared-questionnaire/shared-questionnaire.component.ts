import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MissionTemplate} from '../../../../models/mission';
import {MissionQuestionService} from '../../../../services/mission/mission-question.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-shared-questionnaire',
  templateUrl: './shared-questionnaire.component.html',
  styleUrls: ['./shared-questionnaire.component.scss']
})
export class SharedQuestionnaireComponent implements OnInit {

  /**
   * can be edit or not.
   */
  @Input() isEditable = false;

  /**
   * provide the lang of the innovation cards.
   */
  @Input() set questionnaireLanguages(value: Array<string>) {
    this._missionQuestionService.questionnaireLangs = value;
  }

  /**
   * mission template
   * @param value
   */
  @Input() set template(value: MissionTemplate) {
    this._missionQuestionService.template = value;
  }

  /**
   * sometimes we have the section of type 'OTHER' more then one in the innovation card
   * so for that to identify which section belongs to which we assign the section name of card as an identifier.
   * @param value
   */
  @Input() set sectionsNames(value: Array<string>) {
    this._missionQuestionService.sectionsNames = value;
  }

  @Output() templateChange: EventEmitter<MissionTemplate> = new EventEmitter<MissionTemplate>();

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _missionQuestionService: MissionQuestionService) { }

  ngOnInit() {
    this._missionQuestionService.notifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((_changes) => {
      if (_changes) {
        this.templateChange.emit(this._missionQuestionService.template);
      }
    });
  }

  public addSection(event: Event) {
    event.preventDefault();
    if (this.isEditable) {
      this._missionQuestionService.addSection();
    }
  }

  get template(): MissionTemplate {
    return this._missionQuestionService.template;
  }

}

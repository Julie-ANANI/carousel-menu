import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MissionCardTitle, MissionTemplate} from '../../../../models/mission';
import {MissionQuestionService} from '../../../../services/mission/mission-question.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {RolesFrontService} from '../../../../services/roles/roles-front.service';


@Component({
  selector: 'app-shared-questionnaire',
  templateUrl: './shared-questionnaire.component.html',
})
export class SharedQuestionnaireComponent implements OnInit {

  /**
   * its true if we are integrating this under Library route.
   * because there we are editing the use case template or questions directly from the collections.
   */
  @Input() isLibraryView = false;

  /**
   * provide the access path if you are not providing the isEditable input value to give access
   * to the functionalities.
   * Example: use it on the Libraries page.
   */
  @Input() accessPath: Array<string> = [];

  /**
   * can be edited or not.
   */
  @Input() isEditable = false;

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
  @Input() set cardsSections(value: MissionCardTitle) {
    this._missionQuestionService.cardsSections = value;
  }

  @Input() languageSelected = 'en';

  @Output() templateChange: EventEmitter<MissionTemplate> = new EventEmitter<MissionTemplate>();

  /**
   * do not change this as we are using this under the Library page use case.
   * it emits the value in the for key and value.
   */
  @Output() valueToSave: EventEmitter<any> = new EventEmitter<any>();

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _missionQuestionService: MissionQuestionService,
              private _rolesFrontService: RolesFrontService) { }

  ngOnInit() {
    this._missionQuestionService.notifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((_changes) => {
      if (_changes) {
        this.templateChange.emit(this._missionQuestionService.template);
      }
    });
  }

  public addSection(event: Event) {
    event.preventDefault();
    if (this.isEditable || this.canAccess(['section', 'add'])) {
      this._missionQuestionService.addSection();
    }
  }

  /**
   * to check the user has access to the defined functionality on the page or not.
   *
   * @param path
   */
  public canAccess(path: Array<string> = []) {
    if (this.accessPath.length) {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath.concat(path));
    }
  }

  get template(): MissionTemplate {
    return this._missionQuestionService.template;
  }

}

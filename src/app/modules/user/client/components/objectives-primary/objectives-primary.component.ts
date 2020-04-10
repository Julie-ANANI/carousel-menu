import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Multiling } from '../../../../../models/multiling';
import { Objective, ObjectivesPrincipal } from '../../../../../models/static-data/missionObjectives';

/***
 * this module is to select the primary objective for the client project.
 * It already has all the objectives in both lang.
 *
 * Input:
 * 1. Objective: pass the value in the form of { en: '', fr: '' }.
 *
 * Output:
 * 1. objectiveChange: emits the value in the form of { en: '', fr: '' }.
 *
 * Implementation:
 * <objectives-primary [(objective)]=objective></objectives-primary>
 *
 * Example: while adding the new project. module: NewProjectModule
 */

@Component({
  selector: 'objectives-primary',
  templateUrl: './objectives-primary.component.html',
  styleUrls: ['./objectives-primary.component.scss']
})

export class ObjectivesPrimaryComponent {

  @Input() set objective(value: Multiling) {
    this._objective = value;
  };

  @Output() objectiveChange: EventEmitter<Multiling> = new EventEmitter<Multiling>();

  private readonly _currentLang = this._translateService.currentLang;

  private _objective: Multiling = {
    en: '', fr: ''
  };

  private _objectives: Array<Objective> = ObjectivesPrincipal;

  constructor(private _translateService: TranslateService) { }

  public onClickObjective(event: Event, objective: Objective) {
    event.preventDefault();
    this._objective = { en: objective.en.label, fr: objective.fr.label };
    this.objectiveChange.emit(this._objective);
  }

  public isActive(objective: Objective): boolean {
    return this._objective[this._currentLang] === objective[this._currentLang]['label'];
  }

  get objective(): Multiling {
    return this._objective;
  }

  get objectives(): Array<Objective> {
    return this._objectives;
  }

  get currentLang(): string {
    return this._currentLang;
  }

}

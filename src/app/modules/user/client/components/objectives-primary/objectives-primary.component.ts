import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Objective, ObjectivesPrincipal } from '../../../../../models/static-data/missionObjectives';
import {UmiusMultilingInterface} from '@umius/umi-common-component';

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
  selector: 'app-objectives-primary',
  templateUrl: './objectives-primary.component.html',
  styleUrls: ['./objectives-primary.component.scss']
})

export class ObjectivesPrimaryComponent {

  @Input() set objective(value: UmiusMultilingInterface) {
    this._objective = value;
  };

  @Output() objectiveChange: EventEmitter<UmiusMultilingInterface> = new EventEmitter<UmiusMultilingInterface>();

  private readonly _currentLang = this._translateService.currentLang;

  private _objective: UmiusMultilingInterface = {
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

  get objective(): UmiusMultilingInterface {
    return this._objective;
  }

  get objectives(): Array<Objective> {
    return this._objectives;
  }

  get currentLang(): string {
    return this._currentLang;
  }

}

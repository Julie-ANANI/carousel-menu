import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Mission} from '../../models/mission';
import {ObjectivesPrincipal} from '../../models/static-data/missionObjectives';
import {Pitches} from '../../models/static-data/project-pitch';

@Injectable({providedIn: 'root'})
export class MissionFrontService {

  private _missionObj: BehaviorSubject<Mission> = new BehaviorSubject<Mission>(<Mission>{});

  /***
   * this function return the value based on the required filed and the provided language.
   * when required is equal to
   * 1. OBJECTIVE: gives the full principal objective text.
   * 2. PICTO: gives the img src of the principal objective.
   * 3. FONT_AWESOME_ICON: gives the icon class of the fontawesome.
   * 4. HELP_QUIZ: gives the quiz example link defined based on the objective.
   * 5. PITCH_HELP: give the description help text object for the project pitch.
   * @param mission
   * @param lang
   * @param required: the value to return
   */
  public static objectiveInfo(mission: Mission, required: string, lang = 'en'): any {
    if (mission && mission.objective && mission.objective.principal && mission.objective.principal['en'] && required) {
      const _objective = mission.objective.principal['en'];
      const _matching = ['Detecting needs / trends', 'Validating market needs', 'Sourcing innovative solutions / partners',
        'Validating the interest of my solution', 'Discovering new applications / markets',
        'Targeting the most receptive application / market', 'Optimizing my value proposition', 'Other'];

      if (required === 'OBJECTIVE') {
        return ObjectivesPrincipal[_matching.indexOf(_objective)][lang];
      } else if (required === 'PICTO') {
        return ObjectivesPrincipal[_matching.indexOf(_objective)]['picto'];
      } else if (required === 'FONT_AWESOME_ICON') {
        return ObjectivesPrincipal[_matching.indexOf(_objective)].icon;
      } else if (required === 'HELP_QUIZ') {
        return Pitches[_objective][lang].quiz;
      } else if (required === 'PITCH_HELP') {
        return Pitches[_objective][lang];
      }

    }

    return '';
  }

  /***
   * set the mission value using this function.
   * @param value
   */
  public setMission(value: Mission) {
    this._missionObj.next(value);
  }

  /***
   * use this to listen the value in the components that
   * we set.
   */
  public mission(): BehaviorSubject<Mission> {
    return this._missionObj;
  }

}

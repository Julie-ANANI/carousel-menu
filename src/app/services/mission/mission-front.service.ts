import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Mission} from '../../models/mission';
import {ObjectivesPrincipal} from '../../models/static-data/missionObjectives';
import {
  DetectingNeedsHelp, DiscoveringApplicationsHelp, OptimizingValueHelp, OtherHelp,
  SourcingInnovativeHelp, TargetingApplicationHelp, ValidatingInterestHelp,
  ValidatingMarketHelp
} from '../../models/static-data/project-pitch';

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
      switch (mission.objective.principal['en']) {

        case 'Detecting needs / trends':
          if (required === 'OBJECTIVE') {
            return ObjectivesPrincipal[0][lang];
          } else if (required === 'PICTO') {
            return ObjectivesPrincipal[0].picto;
          } else if (required === 'FONT_AWESOME_ICON') {
            return 'fas fa-compass';
          } else if (required === 'HELP_QUIZ') {
            return DetectingNeedsHelp[lang]['quiz'];
          } else if (required === 'PITCH_HELP') {
            return DetectingNeedsHelp[lang];
          }
          break;

        case 'Validating market needs':
          if (required === 'OBJECTIVE') {
            return ObjectivesPrincipal[1][lang];
          } else if (required === 'PICTO') {
            return ObjectivesPrincipal[1].picto;
          } else if (required === 'FONT_AWESOME_ICON') {
            return 'fas fa-globe';
          } else if (required === 'HELP_QUIZ') {
            return ValidatingMarketHelp[lang]['quiz'];
          } else if (required === 'PITCH_HELP') {
            return ValidatingMarketHelp[lang];
          }
          break;

        case 'Sourcing innovative solutions / partners':
          if (required === 'OBJECTIVE') {
            return ObjectivesPrincipal[2][lang];
          } else if (required === 'PICTO') {
            return ObjectivesPrincipal[2].picto;
          } else if (required === 'FONT_AWESOME_ICON') {
            return 'fas fa-book-open';
          } else if (required === 'HELP_QUIZ') {
            return SourcingInnovativeHelp[lang]['quiz'];
          } else if (required === 'PITCH_HELP') {
            return SourcingInnovativeHelp[lang];
          }
          break;

        case 'Validating the interest of my solution':
          if (required === 'OBJECTIVE') {
            return ObjectivesPrincipal[3][lang];
          } else if (required === 'PICTO') {
            return ObjectivesPrincipal[3].picto;
          } else if (required === 'FONT_AWESOME_ICON') {
            return 'fas fa-lightbulb';
          } else if (required === 'HELP_QUIZ') {
            return ValidatingInterestHelp[lang]['quiz'];
          } else if (required === 'PITCH_HELP') {
            return ValidatingInterestHelp[lang];
          }
          break;

        case 'Discovering new applications / markets':
          if (required === 'OBJECTIVE') {
            return ObjectivesPrincipal[4][lang];
          } else if (required === 'PICTO') {
            return ObjectivesPrincipal[4].picto;
          } else if (required === 'FONT_AWESOME_ICON') {
            return 'fas fa-map-signs';
          } else if (required === 'HELP_QUIZ') {
            return DiscoveringApplicationsHelp[lang]['quiz'];
          } else if (required === 'PITCH_HELP') {
            return DiscoveringApplicationsHelp[lang];
          }
          break;

        case 'Targeting the most receptive application / market':
          if (required === 'OBJECTIVE') {
            return ObjectivesPrincipal[5][lang];
          } else if (required === 'PICTO') {
            return ObjectivesPrincipal[5].picto;
          } else if (required === 'FONT_AWESOME_ICON') {
            return 'fas fa-crosshairs';
          } else if (required === 'HELP_QUIZ') {
            return TargetingApplicationHelp[lang]['quiz'];
          } else if (required === 'PITCH_HELP') {
            return TargetingApplicationHelp[lang];
          }
          break;

        case 'Optimizing my value proposition':
          if (required === 'OBJECTIVE') {
            return ObjectivesPrincipal[6][lang];
          } else if (required === 'PICTO') {
            return ObjectivesPrincipal[6].picto;
          } else if (required === 'FONT_AWESOME_ICON') {
            return 'fas fa-sync-alt';
          } else if (required === 'HELP_QUIZ') {
            return OptimizingValueHelp[lang]['quiz'];
          } else if (required === 'PITCH_HELP') {
            return OptimizingValueHelp[lang];
          }
          break;

        case 'Other':
          if (required === 'OBJECTIVE') {
            return ObjectivesPrincipal[7][lang];
          } else if (required === 'PICTO') {
            return ObjectivesPrincipal[7].picto;
          } else if (required === 'FONT_AWESOME_ICON') {
            return 'fas fa-pencil-alt';
          } else if (required === 'HELP_QUIZ') {
            return OtherHelp[lang]['quiz'];
          } else if (required === 'PITCH_HELP') {
            return OtherHelp[lang];
          }
          break;

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

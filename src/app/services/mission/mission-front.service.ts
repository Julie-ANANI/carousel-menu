import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Milestone, Mission, MissionQuestion, MissionTemplate, MissionTemplateSection} from '../../models/mission';
import {ObjectivesPrincipal} from '../../models/static-data/missionObjectives';
import {Pitches, Template_Pitches} from '../../models/static-data/project-pitch';

@Injectable({providedIn: 'root'})
export class MissionFrontService {

  private _missionObj: BehaviorSubject<Mission> = new BehaviorSubject<Mission>(<Mission>{});

  /**
   * return the combined complementary objectives of the sections of template.
   * @param missionSections
   */
  public static combineComplementaryObjectives(missionSections: Array<MissionTemplateSection>): Array<MissionQuestion> {
    let objectives: Array<MissionQuestion> = [];
    for (let i = 0 ; i < missionSections.length; i++) {
      objectives = [...missionSections[i].complementary];
    }
    return objectives;
  }

  /**
   * for the sections it assign the complementary = []
   * @param missionSections
   */
  public static resetComplementaryObjectives(missionSections: Array<MissionTemplateSection>): Array<MissionTemplateSection> {
    return missionSections.map((_section) => {
      _section.complementary = [];
      return _section;
    });
  }

  /***
   * this function return the value based on the required filed and the provided language.
   * when required is equal to
   * 1. OBJECTIVE: gives the full principal objective text.
   * 2. PICTO: gives the img src of the principal objective.
   * 3. FONT_AWESOME_ICON: gives the icon class of the fontawesome.
   * 4. HELP_QUIZ: gives the quiz example link defined based on the objective.
   * 5. PITCH_HELP: give the description help text object for the project pitch.
   *
   * hasTemplate - means using the new mission template - check for the template object in the mission.
   *
   * updated on 7th June, 2021 to work with the mission templates.
   * @param mission
   * @param lang
   * @param required: the value to return
   */
  public static objectiveInfo(mission: Mission, required: string, lang = 'en'): any {
    const hasTemplate = mission && mission.template && mission.template.entry && mission.template.entry.length > 0;

    if (hasTemplate) {
      const objective = this.objectiveName(mission.template);

      switch (required) {
        case 'HELP_QUIZ':
          return Template_Pitches[objective][lang].quiz;
        case 'PITCH_HELP':
          return Template_Pitches[objective][lang];
      }
    } else {
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
    }

    return '';
  }

  /**
   * return the name to show the user readable form.
   * both uses the same structure.
   * @param value - can be Mission template or Mission question
   * @param lang
   */
  public static objectiveName(value: MissionTemplate | MissionQuestion, lang = 'en'): string {
    if (value && value.entry && value.entry.length) {
      const find = value.entry.find((entry: any) => entry.lang === lang);
      if (!!find && find.objective) {
        return find.objective;
      }
    }
    return '';
  }

  /***
   * this will return the sorted dates
   * @param dates
   */
  public static sortMilestoneDates(dates: Array<Milestone>) {
    if (dates && dates.length) {
      return dates.sort((a, b) => {
        const _dateA: any = new Date(a.dueDate);
        const _dateB: any = new Date(b.dueDate);
        return _dateA - _dateB;
      });
    }
    return [];
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

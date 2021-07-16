import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Milestone, Mission, MissionQuestion, MissionTemplate, MissionTemplateSection} from '../../models/mission';
import {ObjectivesPrincipal} from '../../models/static-data/missionObjectives';
import {Pitches, Template_Pitches} from '../../models/static-data/project-pitch';

@Injectable({providedIn: 'root'})
export class MissionFrontService {

  private _missionObj: BehaviorSubject<Mission> = new BehaviorSubject<Mission>(<Mission>{});

  /**
   * sort the template in the order of the category
   *
   * @param templates
   */
  public static sortTemplatesByCategory(templates: Array<MissionTemplate>): Array<MissionTemplate> {
    const _templates: Array<MissionTemplate> = [];
    const cases = ['Detecting market needs', 'Validating market needs', 'Sourcing solutions / suppliers',
      'Identifying receptive markets', 'Validating the interest in my project', 'Optimizing my value proposition'];

    templates.forEach((_template, index) => {
      const _index = _template.entry.findIndex((entry: any) => entry.objective === cases[index]);

      if (_index !== -1) {
        switch (cases[index]) {
          case 'Detecting market needs':
          case 'Validating market needs':
          case 'Sourcing solutions / suppliers':
            templates[index]['category'] = 'INNOVATE';
            break;

          case 'Identifying receptive markets':
          case 'Validating the interest in my project':
          case 'Optimizing my value proposition':
            templates[index]['category'] = 'INNOVATION';
            break;
        }

        _templates.push(templates[index]);
      }
    });
    return _templates;
  }

  /**
   * based on the lang it will return the index of that entry;
   *
   * @param value
   * @param lang
   */
  public static entryIndex(value: MissionTemplate | MissionQuestion, lang = 'en'): number {
    let index = 0;
    if (value && value.entry && value.entry.length > 1) {
      index = value.entry.findIndex((_entry) => _entry.lang === lang);
    }
    return index === -1 ? 0 : index;
  }

  /**
   * return true if the mission has template in it.
   * @param mission
   */
  public static hasMissionTemplate(mission: Mission = <Mission>{}): boolean {
    return mission && mission.template && mission.template.entry && mission.template.entry.length > 0;
  }

  /**
   * return the total list of the question in the template.
   * @param template
   */
  public static totalTemplateQuestions(template: MissionTemplate): Array<MissionQuestion> {
    const questions: Array<MissionQuestion> = [];
    if (template && template.sections && template.sections.length) {
      for (let i = 0 ; i < template.sections.length; i++) {
        questions.push(...template.sections[i].questions);
      }
    }
    return questions;
  }

  /**
   * return the combined complementary objectives of the sections of template.
   * @param missionSections
   */
  public static combineComplementaryObjectives(missionSections: Array<MissionTemplateSection>): Array<MissionQuestion> {
    const objectives: Array<MissionQuestion> = [];
    for (let i = 0 ; i < missionSections.length; i++) {
      objectives.push(...MissionFrontService.complementaryQuestions(missionSections[i].questions));
    }
    return objectives;
  }

  /**
   * return the list of the complementary objectives
   * @param questions
   */
  public static complementaryQuestions(questions: Array<MissionQuestion>): Array<MissionQuestion> {
    return questions.filter((_question) => _question.type === 'COMPLEMENTARY');
  }

  /**
   * the list questions in the sections only contain the list of the essentials objectives.
   * @param missionSections
   */
  public static resetComplementaryObjectives(missionSections: Array<MissionTemplateSection>): Array<MissionTemplateSection> {
    return missionSections.map((_section) => {
      _section.questions = MissionFrontService.essentialsObjectives(_section.questions);
      return _section;
    });
  }

  /**
   * return the list of the questions whose essentials === false and map it Array<MissionQuestion>
   * @param questions - only pass the questions of the template
   */
  public static complementaryObjectives(questions: Array<any>): Array<MissionQuestion> {
    return questions.filter((_question) => !_question.essential).map((value) => {
      value.question.type = 'COMPLEMENTARY';
      return value.question;
    });
  }

  /**
   * return the list of the questions whose essentials === true and map it Array<MissionQuestion>
   * @param questions - only pass the questions of the template
   */
  public static essentialsObjectives(questions: Array<any>): Array<MissionQuestion> {
    return questions.filter((_question) => !!_question.essential).map((value) => {
      value.question.type = 'ESSENTIAL';
      return value.question;
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

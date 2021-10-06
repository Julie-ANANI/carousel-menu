import { Injectable } from '@angular/core';
import { Preset } from '../../models/preset';
import { Option, Question, QuestionType } from '../../models/question';
import { Section } from '../../models/section';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { colors } from '../../utils/chartColors';

@Injectable({providedIn: 'root'})
export class PresetFrontService {

  private _savePresetSubject: Subject<boolean> = new Subject<boolean>();

  private taggedQuestionsTypes: { [identifier: string]: QuestionType } = {
    optim_context: 'radio',
    optim_issues: 'stars',
    optim_useSolution: 'radio',
    optim_strengths: 'stars',
    optim_weaknesses: 'textarea',
    optim_differentiation: 'textarea',
    optim_price: 'radio',
    optim_competition: 'textarea',
    optim_leads: 'checkbox',
    optim_contact: 'textarea',
    detect_context: 'radio',
    detect_stakes: 'textarea',
    detect_criticalIssues: 'stars',
    detect_promisingSolutions: 'textarea',
    detect_promisingActors: 'textarea',
    detect_promisingDevelopments: 'stars',
    detect_impact: 'textarea',
    detect_brainstorming: 'radio',
    detect_contact: 'textarea',
    validNeeds_context: 'radio',
    validNeeds_issues: 'stars',
    validNeeds_otherIssues: 'textarea',
    validNeeds_usedSolution: 'radio',
    validNeeds_whichSolution: 'textarea',
    validNeeds_whyNoSolution: 'textarea',
    validNeeds_otherSolutions: 'textarea',
    validNeeds_leads: 'checkbox',
    validNeeds_contact: 'textarea',
    sourcing_solutions: 'textarea',
    sourcing_needs: 'textarea',
    sourcing_solvedIssues: 'checkbox',
    sourcing_developpers: 'textarea',
    sourcing_otherFields: 'textarea',
    sourcing_tellUsMore: 'textarea',
    sourcing_leads: 'checkbox',
    sourcing_interest: 'textarea',
    sourcing_contact: 'textarea',
    validInterest_context: 'radio',
    validInterest_isCritical: 'radio',
    validInterest_criticalIssues: 'stars',
    validInterest_otherIssues: 'textarea',
    validInterest_solutions: 'textarea',
    validInterest_relevance: 'radio',
    validInterest_strengths: 'stars',
    validInterest_weaknesses: 'textarea',
    validInterest_useIt: 'radio',
    validInterest_leads: 'checkbox',
    validInterest_contact: 'textarea',
    discover_context: 'radio',
    discover_isCritical: 'radio',
    discover_criticalIssues: 'stars',
    discover_useSolution: 'radio',
    discover_whichApplications: 'textarea',
    discover_strengths: 'stars',
    discover_weaknesses: 'textarea',
    discover_otherApplications: 'textarea',
    discover_leads: 'checkbox',
    discover_contact: 'textarea',
    target_context: 'radio',
    target_isCritical: 'radio',
    target_criticalIssues: 'stars',
    target_otherIssues: 'textarea',
    target_solutions: 'textarea',
    target_relevance: 'radio',
    target_strengths: 'stars',
    target_weaknesses: 'textarea',
    target_useIt: 'radio',
    target_leads: 'checkbox',
    target_contact: 'textarea',
  };

  private _sectionsNames: Array<string>;

  private _preset: Preset;

  constructor(private _translateService: TranslateService) {
  }

  /**
   * re-index options to keep a count from 0 to X
   * @param options
   */
  public static reConfigureOptionsIdentifier(options: Array<Option>) {
    options.forEach(function (option, i) {
      option.identifier = i.toString();
    });
  }

  /**
   * get the new option for the controlType = 'radio' | 'checkbox' | 'stars' | 'ranking'
   * @param question
   * @param oldOptions
   */
  public static addNewOption(question: Question, oldOptions?: any[]): Option {
    if (question && !!question.options) {
      const id = question.options.length;
      let en = 'Option ' + id.toString();
      let fr = 'Option ' + id.toString();
      if (oldOptions && oldOptions.length && oldOptions.length > id) {
        en = oldOptions[id].label.en;
        fr = oldOptions[id].label.fr;
      }
      return {
        identifier: id.toString(),
        label: {
          en: en,
          fr: fr
        }
      };
    }

    return <Option>{};
  }

  /**
   * based on the control type we configure question
   * maxOptionsSelect, options and instructions
   * @param question
   */
  public static configureQuestion(question: Question): Question {
    if (question && question.controlType) {
      question.instruction = PresetFrontService.questionInstruction(question.controlType);
      question.maxOptionsSelect = null;
      const options = question.options;
      console.log(options);
      question.options = [];

      switch (question.controlType) {
        case 'checkbox':
        case 'radio':
        case 'stars':
        case 'ranking':
          for (let i = 0; i < 4; i++) {
            question.options.push(PresetFrontService.addNewOption(question, options));
          }
          break;

        case 'textarea':
          question.canComment = false;
          break;
      }
      if (question.controlType === 'checkbox') {
        question.maxOptionsSelect = 4;
      }

      if (question.controlType === 'ranking') {
        question.randomization = true;
      }

      if (question.controlType === 'radio') {
        question = PresetFrontService.setOptionsColors(question);
        question = PresetFrontService.setOptionsPositiveAnswer(question);
      }

    }

    return question;
  }

  /**
   * return the default instruction for the different questions
   * @param controlType
   */
  public static questionInstruction(controlType: QuestionType): { en: string, fr: string } {
    switch (controlType) {
      case 'scale':
        return {
          en: '1 = Not at all / 10 = Totally',
          fr: '1 = Pas du tout / 10 = Totalement'
        };

      case 'stars':
        return {
          en: '0 star = Not at all / 5 stars = Totally',
          fr: '0 étoile = Pas du tout / 5 étoiles = Totalement'
        };

      case 'checkbox':
        return {
          en: 'You can select up to 4 items',
          fr: 'Vous pouvez sélectionner jusqu\'à 4 items'
        };

      case 'ranking':
        return {
          en: 'Drag and drop to rank items',
          fr: 'Drag and drop pour classer les items'
        };

      default:
        return {
          en: '',
          fr: ''
        };
    }
  }

  /**
   * setting the options color for control type === 'radio'
   * @param question
   */
  public static setOptionsColors(question: Question): Question {
    const nbOptions = question.options.length;

    if (nbOptions > 4 && nbOptions <= 6) {
      for (let i = 0; i < nbOptions; i++) {
        question.options[i].color = colors[i + 4].value;
      }
    } else {
      for (let i = 0; i < nbOptions; i++) {
        question.options[i].color = colors[i % 10].value;
      }
    }

    return question;
  }

  /**
   * setting the options are positive answers or not for control type === 'radio'
   * @param question
   */
  public static setOptionsPositiveAnswer(question: Question): Question {
    const nbOptions = question.options.length;

    // If 4 items, 3rd and 4th are positive answers
    if (nbOptions === 4) {
      question.options[2].positive = true;
      question.options[3].positive = true;
    } else {
      for (let i = 0; i < nbOptions; i++) {
        question.options[i].positive = false;
      }
    }

    return question;
  }

  /**
   * based on the languages will search the label and if not found then return first label based
   * on the presetLanguages
   * @param question
   * @param presetLanguages
   */
  public questionLabel(question: Question = <Question>{}, presetLanguages: Array<string>): string {
    if (presetLanguages.length) {
      const _lang = presetLanguages.find((lang) => lang === this._translateService.currentLang);
      if (!!_lang && question.label && question.label[_lang]) {
        return question.label[_lang];
      }
      if (question.label && question.label[presetLanguages[0]]) {
        return question.label[presetLanguages[0]];
      }
    }

    return question.label && question.label[this._translateService.currentLang] || '';
  }

  /***
   * this function is called when there are some changes and we want to notify
   * in the component that changes are to be saved or not for the preset.
   * @param value
   */
  public setNotifyChanges(value: boolean) {
    this._savePresetSubject.next(value);
  }

  public getNotifyChanges(): Subject<boolean> {
    return this._savePresetSubject;
  }

  public generateId(): string {
    // Generate a random id for custom questions
    return Math.random().toString(36).substring(2);
  }

  public getQuestionType(identifier: string): QuestionType {
    return this.taggedQuestionsTypes[identifier];
  }

  public isTaggedQuestion(identifier: string): boolean {
    return Object.keys(this.taggedQuestionsTypes).indexOf(identifier) !== -1;
  }

  public isContactQuestion(identifier: string): boolean {
    return this.isTaggedQuestion(identifier) && identifier.indexOf('contact') !== -1;
  }

  public getNonUsedQuestions(): Array<string> {
    const identifiersMap = this._preset.sections.reduce((accS, section) => {
      const subIdentifiersMap = section.questions.reduce((accQ, question) => Object.assign(accQ, {[question.identifier]: 1}), {});
      return Object.assign(accS, subIdentifiersMap);
    }, {} as { [questionId: string]: 1 });
    return Object.keys(this.taggedQuestionsTypes).filter((tag) => !identifiersMap[tag]);
  }

  public addSection() {
    if (this._preset) {
      let name = 'Section';
      if (Array.isArray(this._preset.sections)) {
        name += this._preset.sections.length;
      }
      const section: Section = {
        questions: [],
        description: 'nothing',
        label: {
          en: name,
          fr: name
        }
      };
      this._preset.sections.push(section);
      this.setNotifyChanges(true);
    }
  }

  public addQuestion(sectionIndex: number) {
    if (this._preset && this._preset.sections[sectionIndex]) {
      let name = 'Question';
      const section = this._preset.sections[sectionIndex];
      if (Array.isArray(section.questions)) {
        name += section.questions.length;
      }
      let newQuestion: Question = {
        label: {
          en: name,
          fr: name
        },
        title: {
          en: '',
          fr: ''
        },
        subtitle: {
          en: '',
          fr: ''
        },
        identifier: this.generateId(),
        controlType: 'radio',
        canComment: true,
        randomization: false,
        sensitiveAnswerData: false,
      };
      newQuestion = PresetFrontService.configureQuestion(newQuestion);
      section.questions.push(newQuestion);
    }
  }

  public moveSection(sectionIndex: number, move: number) {
    const new_place = sectionIndex + move;
    const sections = this._preset.sections;
    if (new_place >= 0 && new_place < sections.length) {
      sections[new_place] = sections.splice(sectionIndex, 1, sections[new_place])[0];
    }
  }

  public removeSection(sectionIndex: number) {
    this._preset.sections.splice(sectionIndex, 1);
  }

  public moveQuestion(questionIndex: number, sectionIndex: number, move: number) {
    const new_question_place = questionIndex + move;
    const questions = this._preset.sections[sectionIndex].questions;
    if (new_question_place >= 0 && new_question_place < questions.length) {
      questions[new_question_place] = questions.splice(questionIndex, 1, questions[new_question_place])[0];
    } else {
      /* here we try if possible to move the question to another section */
      const new_section_place = sectionIndex + move;
      if (new_section_place >= 0 && new_section_place < this._preset.sections.length) {
        const new_questions = this._preset.sections[new_section_place].questions;
        if (move > 0) {
          new_questions.unshift(questions.splice(questionIndex, 1)[0]);
        } else if (move < 0) {
          new_questions.push(questions.splice(questionIndex, 1)[0]);
        }
      }
    }
  }

  /**
   * change the question option place
   * @param questionIndex
   * @param sectionIndex
   * @param optionIndex
   * @param move - 1 (down) | -1 (up)
   */
  public moveQuestionOption(questionIndex: number, sectionIndex: number, optionIndex: number, move: number) {
    const new_place = optionIndex + move;
    const options = this._preset.sections[sectionIndex].questions[questionIndex].options;
    if (new_place >= 0 && new_place < options.length) {
      options[new_place] = options.splice(optionIndex, 1, options[new_place])[0];
      PresetFrontService.reConfigureOptionsIdentifier(options);
    }
  }

  public cloneQuestion(questionIndex: number, sectionIndex: number) {
    const questions: Array<Question> = this._preset.sections[sectionIndex].questions;
    const question: Question = {...questions[questionIndex]};
    /* mutate question to avoid getting 2 questions with the same id */
    delete question._id;
    question.identifier = this.generateId();
    questions.push(JSON.parse(JSON.stringify(question)));
  }

  public removeQuestion(questionIndex: number, sectionIndex: number) {
    this._preset.sections[sectionIndex].questions.splice(questionIndex, 1);
  }

  get preset(): Preset {
    return this._preset;
  }

  set preset(value: Preset) {
    this._preset = value;
  }

  get sectionsNames(): Array<string> {
    return this._sectionsNames;
  }

  set sectionsNames(value: Array<string>) {
    this._sectionsNames = value;
  }
}

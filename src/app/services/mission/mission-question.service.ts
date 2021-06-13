import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {
  MissionQuestion,
  MissionQuestionEntry,
  MissionQuestionOption,
  MissionQuestionOptionType,
  MissionTemplate,
  MissionTemplateSection
} from '../../models/mission';
import {Subject} from 'rxjs/Subject';
import {colors} from '../../utils/chartColors';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class MissionQuestionService {

  get questionnaireLangs(): Array<string> {
    return this._questionnaireLangs;
  }

  set questionnaireLangs(value: Array<string>) {
    this._questionnaireLangs = value;
  }

  get template(): MissionTemplate {
    return this._template;
  }

  set template(value: MissionTemplate) {
    this._template = value;
  }

  get sectionsNames(): Array<string> {
    return this._sectionsNames;
  }

  set sectionsNames(value: Array<string>) {
    this._sectionsNames = value;
  }

  private _missionTemplateObj: BehaviorSubject<MissionTemplate> = new BehaviorSubject<MissionTemplate>(<MissionTemplate>{});

  private _template: MissionTemplate = <MissionTemplate>{};

  private _notifyObj: Subject<boolean> = new Subject<boolean>();

  /**
   * name of the sections in the innovation card.
   * @private
   */
  private _sectionsNames: Array<string> = [];

  private _questionnaireLangs: Array<string> = ['en', 'fr'];

  constructor(private _translateService: TranslateService) {
  }

  /**
   * return the entry info of different type
   * 'MissionTemplateSection | MissionQuestionOption | MissionQuestion | MissionTemplateSectionEntry | MissionQuestionEntry | OptionEntry'
   * for the return value check the respective interface.
   * @param value
   * @param lang
   */
  public static entryInfo(value: any, lang = 'en'): any {
    if (value && value.entry && value.entry.length) {
      const entry = value.entry.find((_entry: any) => _entry.lang === lang);
      if (!!entry) {
        return entry;
      }
    }
    return <any>{};
  }

  /**
   * re-index options to keep a count from 0 to X
   * @param options
   */
  public static reConfigureOptionsIdentifier(options: Array<MissionQuestionOption>): Array<MissionQuestionOption> {
    options.forEach((_option, i) => {
      _option.identifier = i.toString();
    });
    return options;
  }

  /**
   * return the default instruction for the different questions
   * @param controlType
   */
  public static questionInstruction(controlType: MissionQuestionOptionType): {en: string, fr: string} {
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

      default:
        return {
          en: '',
          fr: ''
        };
    }
  }

  /**
   * return the options color for controlType === 'radio'
   * @param question
   */
  public static setOptionsColors(question: MissionQuestion): MissionQuestion {
    const nbOptions = question.options.length;

    if (question.controlType === 'radio') {
      if (nbOptions > 4 && nbOptions <= 6) {
        for (let i = 0; i < nbOptions; i++) {
          question.options[i].color = colors[i + 4].value;
        }
      } else {
        for (let i = 0; i < nbOptions; i++) {
          question.options[i].color = colors[i % 10].value;
        }
      }
    }

    return question;
  }

  /**
   * return the options are positive answers or not for control type === 'radio'
   * If 4 items, 3rd and 4th are positive answers.
   * @param question
   */
  public static setOptionsPositiveAnswer(question: MissionQuestion = <MissionQuestion>{}): MissionQuestion {
    const nbOptions = question.options && question.options.length;

    if (question.controlType === 'radio') {
      if (nbOptions === 4) {
        question.options[2].positive = true;
        question.options[3].positive = true;
      } else {
        for (let i = 0; i < nbOptions; i++) {
          question.options[i].positive = false;
        }
      }
    }

    return question;
  }

  /**
   * this will emit behaviour subject event of the updated template value.
   * @private
   */
  private _emitTemplate() {
    this.setMissionTemplate(this._template);
    this.setNotifyChanges(true);
  }

  /**
   * based on the control type we configure question
   * maxOptionsSelect, options and instructions
   * @param question
   */
  public configureQuestion(question: MissionQuestion) {
    if (question && question.controlType) {

      question.entry.forEach((_entry) => {
        _entry.instruction = MissionQuestionService.questionInstruction(question.controlType)[_entry.lang];
      });

      question.maxOptionsSelect = null;
      question = this.configureQuestionOptions(question);

      if (question.controlType === 'textarea') {
        question.canComment = false;
      }

      this._emitTemplate();
    }

  }

  /**
   * return the
   * @param question
   */
  public configureQuestionOptions(question: MissionQuestion = <MissionQuestion>{})
    : MissionQuestion {

    question.options = [];

    if (question.controlType === 'checkbox' || question.controlType === 'radio' || question.controlType === 'stars') {
      for (let i = 0; i < 4; i++) {
        question.options.push(this.addOption(question));
      }
    }

    if (question.controlType === 'checkbox') {
      question.maxOptionsSelect = 4;
    }

    if (question.controlType === 'radio') {
      question = MissionQuestionService.setOptionsColors(question);
      question = MissionQuestionService.setOptionsPositiveAnswer(question);
    }

    return question;
  }

  /**
   * return the new option for the controlType = 'radio' | 'checkbox' | 'stars'
   * @param question
   */
  public addOption(question: MissionQuestion = <MissionQuestion>{}): MissionQuestionOption {
    if (question.controlType === 'radio' || question.controlType === 'checkbox' || question.controlType === 'stars') {
      const stringId = question.options.length.toString();
      return {
        identifier: stringId,
        entry: this._questionnaireLangs.map((_lang) => {
          return {
            lang: _lang,
            label: 'Option ' + stringId
          };
        })
      };
    }

    return <MissionQuestionOption>{};
  }

  public deleteOption(question: MissionQuestion = <MissionQuestion>{}, optionIndex: number) {
    if (question.options && question.options.length) {
      const options = question.options;
      options.splice(optionIndex, 1);
      MissionQuestionService.reConfigureOptionsIdentifier(options);
      this.configureCheckbox(question);

      if (question.controlType === 'radio') {
        MissionQuestionService.setOptionsColors(question);
        MissionQuestionService.setOptionsPositiveAnswer(question);
      }

      this._emitTemplate();
    }
  }

  /**
   * replace the instruction for the type checkbox based on the provided total or question maxOptionSelect.
   * @param question
   * @param total
   */
  public configureCheckbox(question: MissionQuestion = <MissionQuestion>{}, total?: number) {
    if (question.controlType === 'checkbox') {
      question.maxOptionsSelect = question.options.length;
      total = total || question.maxOptionsSelect;

      question.entry.forEach((_entry) => {
        _entry.instruction = _entry.instruction.replace(/\d/g, (total.toString(10)));
      });
    }

    return question;
  }

  /**
   * add the new option in the list of options.
   * @param question
   */
  public addNewOption(question: MissionQuestion = <MissionQuestion>{}) {
    const option = this.addOption(question);

    if (option && !!option.identifier) {
      question.options.push(option);
      MissionQuestionService.setOptionsColors(question);
      MissionQuestionService.setOptionsPositiveAnswer(question);
      this.configureCheckbox(question);
    }

    this._emitTemplate();
  }

  /**
   * return the question entry of the question.
   * @param questionType
   */
  public createQuestionEntry(questionType: MissionQuestionOptionType): Array<MissionQuestionEntry> {
    const entry: Array<MissionQuestionEntry> = [];
    for (let i = 0; i < this._questionnaireLangs.length; i++) {
      entry.push({
        title: '',
        subtitle: '',
        instruction: MissionQuestionService.questionInstruction(questionType)[this._questionnaireLangs[i]],
        label: '',
        objective: '',
        lang: this._questionnaireLangs[i]
      });
    }
    return entry;
  }

  /**
   * Generate a random id for custom questions
   */
  public generateId(): string {
    return Math.random().toString(36).substring(2);
  }

  /**
   * add the section in the template.
   */
  public addSection() {
    if (this._template.sections && this._template.sections.length) {
      const section: MissionTemplateSection = {
        type: 'NOTHING',
        questions: [],
        entry: this._questionnaireLangs.map((_lang) => {
          return {
            lang: _lang,
            name: 'Section' + this._template.sections.length
          };
        })
      };
      this._template.sections.push(section);
      this._emitTemplate();
    }
  }

  /**
   * add a new question in the section complementary list with the predefined value.
   * @param sectionIndex
   */
  public addQuestion(sectionIndex: number) {
    if (this._template && this._template.sections[sectionIndex] && this._template.sections[sectionIndex].questions) {

      let question: MissionQuestion = {
        type: 'COMPLEMENTARY',
        controlType: 'radio',
        visibility: true,
        canComment: true,
        sensitiveAnswerData: false,
        identifier: this.generateId(),
        entry: this.createQuestionEntry( 'radio'),
      };

      question = this.configureQuestionOptions(question);
      this._template.sections[sectionIndex].questions.push(question);
      this._emitTemplate();
    }
  }

  /**
   * move the section index up or down based on the 'move'.
   * @param sectionIndex
   * @param move
   */
  public moveSection(sectionIndex: number, move: number) {
    const new_place = sectionIndex + move;
    const sections = this._template.sections;
    if (new_place >= 0 && new_place < sections.length) {
      sections[new_place] = sections.splice(sectionIndex, 1, sections[new_place])[0];
    }
    this._emitTemplate();
  }

  /**
   * move the section question up or down based on the 'move' .
   * @param questionIndex
   * @param sectionIndex
   * @param move
   */
  public moveQuestion(questionIndex: number, sectionIndex: number, move: number) {
    const new_question_place = questionIndex + move;
    const questions = this._template.sections[sectionIndex].questions;

    if (new_question_place >= 0 && new_question_place < questions.length) {
      questions[new_question_place] = questions.splice(questionIndex, 1, questions[new_question_place])[0];
    } else {
      /**
       * here we try if possible to move the question to another section
       */
      const new_section_place = sectionIndex + move;
      if (new_section_place >= 0 && new_section_place < this._template.sections.length) {
        const new_questions = this._template.sections[new_section_place].questions;
        if (move > 0) {
          new_questions.unshift(questions.splice(questionIndex, 1)[0]);
        } else if (move < 0) {
          new_questions.push(questions.splice(questionIndex, 1)[0]);
        }
      }
    }

    this._emitTemplate();
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
    const options = this._template.sections[sectionIndex].questions[questionIndex].options;

    if (new_place >= 0 && new_place < options.length) {
      options[new_place] = options.splice(optionIndex, 1, options[new_place])[0];
      MissionQuestionService.reConfigureOptionsIdentifier(options);
      this._emitTemplate();
    }
  }

  /**
   * remove the sections from the template.
   * @param sectionIndex
   */
  public removeSection(sectionIndex: number) {
    if (this._template && this._template.sections && this._template.sections[sectionIndex]) {
      this._template.sections.splice(sectionIndex, 1);
      this._emitTemplate();
    }
  }

  /**
   * update the section name with the new value.
   * @param newValue
   * @param lang
   * @param section
   */
  public changeSectionName(newValue: string, lang: string, section: MissionTemplateSection) {
    if (section && section.entry && section.entry.length) {
      const index = section.entry.findIndex((_entry) => _entry.lang === lang);
      if (index !== -1) {
        section.entry[index].name = newValue;
        this._emitTemplate();
      }
    }
  }

  /**
   * update the question entry with the new value.
   * @param newValue
   * @param lang
   * @param question
   * @param attr - should be the attribute of the model MissionQuestion
   */
  public changeQuestionEntry(newValue: string, lang: string, question: MissionQuestion, attr: string) {
    if (question && question.entry && question.entry.length) {
      const index = question.entry.findIndex((_entry) => _entry.lang === lang);
      if (index !== -1) {
        question.entry[index][attr] = newValue;
        this._emitTemplate();
      }
    }
  }

  /**
   * update the value of the option entry with new value.
   * @param newValue
   * @param lang
   * @param question
   * @param optionIndex
   */
  public changeQuestionOptionEntry(newValue: string, lang: string, question: MissionQuestion, optionIndex: number) {
    if (question && question.options && question.options[optionIndex]) {
      const option = question.options[optionIndex];
      const index = option.entry.findIndex((_entry) => _entry.lang === lang);
      if (index !== -1) {
        option.entry[index].label = newValue;
        this._emitTemplate();
      }
    }
  }

  /**
   * return the total questions of the sections.
   * @param sectionIndex
   */
  public totalQuestions(sectionIndex: number = 0): Array<MissionQuestion> {
    return this._template.sections && this._template.sections.length ? this._template.sections[sectionIndex].questions : [];
  }

  /**
   * first we search the entry by the lang passed if not found then
   * based on the languages will search the entry of the question and if not found then return first entry based
   * on the questionnaireLangs
   * @param question
   * @param lang
   */
  public questionEntry(question: MissionQuestion = <MissionQuestion>{}, lang: string): MissionQuestionEntry {
    const find = MissionQuestionService.entryInfo(question, lang);

    if (!!find) {
      return find;
    } else if (this._questionnaireLangs.length) {
      const quesLang = this._questionnaireLangs.find((_lang) => _lang === this._translateService.currentLang);
      if (!!quesLang) {
        return MissionQuestionService.entryInfo(question, quesLang);
      } else {
        return MissionQuestionService.entryInfo(question, this._questionnaireLangs[0]) || <MissionQuestionEntry>{};
      }
    }

    return question.entry && question.entry[0] || <MissionQuestionEntry>{};
  }

  /**
   * remove the question
   * @param questionIndex
   * @param sectionIndex
   */
  public removeQuestion(questionIndex: number,  sectionIndex: number) {
    this._template.sections[sectionIndex].questions.splice(questionIndex, 1);
    this._emitTemplate();
  }

  /**
   * clone the question.
   * @param questionIndex
   * @param sectionIndex
   */
  public cloneQuestion(questionIndex: number, sectionIndex: number) {
    const questions: Array<MissionQuestion> = this._template.sections[sectionIndex].questions;
    const question: MissionQuestion = { ...questions[questionIndex] };

    /**
     * mutate question to avoid getting 2 questions with the same id
     */
    delete question._id;
    question.identifier = this.generateId();
    questions.push(JSON.parse(JSON.stringify(question)));
  }

  /**
   * behaviour object to listen for the mission template.
   */
  public missionTemplate(): BehaviorSubject<MissionTemplate> {
    return this._missionTemplateObj;
  }

  public setMissionTemplate(value: MissionTemplate) {
    this._template = value;
    this._missionTemplateObj.next(value);
  }

  /***
   * this function is called when there are some changes and we want to notify
   * in the component that changes are to be saved or not for the template.
   * @param value
   */
  public setNotifyChanges(value: boolean) {
    this._notifyObj.next(value);
  }

  public notifyChanges(): Subject<boolean> {
    return this._notifyObj;
  }

}

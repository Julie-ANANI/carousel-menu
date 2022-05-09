import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  MissionCardTitle,
  MissionQuestion,
  MissionQuestionEntry,
  MissionQuestionOption,
  MissionQuestionType,
  MissionTemplate,
  MissionTemplateSection,
} from '../../models/mission';
import { Subject } from 'rxjs/Subject';
import { colors } from '../../utils/chartColors';
import { replaceNumberRegex } from '../../utils/regex';
import optionLikert from '../../../../assets/json/likert-scale.json';
import { Language } from "../../models/static-data/language";

@Injectable({providedIn: 'root'})
export class MissionQuestionService {

  get cardsSections(): MissionCardTitle {
    return this._cardsSections;
  }

  set cardsSections(value: MissionCardTitle) {
    this._cardsSections = value;
  }

  get allQuestions(): Array<MissionQuestion> {
    return this._allQuestions;
  }

  set allQuestions(value: Array<MissionQuestion>) {
    this._allQuestions = value;
  }

  get allTemplates(): Array<MissionTemplate> {
    return this._allTemplates;
  }

  set allTemplates(value: Array<MissionTemplate>) {
    this._allTemplates = value;
  }

  get question(): MissionQuestion {
    return this._question;
  }

  set question(value: MissionQuestion) {
    this._question = value;
  }

  get taggedQuestionsTypes(): { [p: string]: MissionQuestionType } {
    return this._taggedQuestionsTypes;
  }

  get questionnaireLangs(): Array<Language> {
    return this._questionnaireLangs;
  }

  set questionnaireLangs(value: Array<Language>) {
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

  /**
   * it's file data JSON of Choice Likert Scale
   *
   */
  dataOfChoiceLikertScale = optionLikert;

  get optionsNamesLikert(): Object {
    return this.dataOfChoiceLikertScale;
  }

  set sectionsNames(value: Array<string>) {
    this._sectionsNames = value;
  }

  private _missionTemplateObj: BehaviorSubject<MissionTemplate> = new BehaviorSubject<MissionTemplate>(<MissionTemplate>{});

  /**
   * single template / use case
   *
   * @private
   */
  private _template: MissionTemplate = <MissionTemplate>{};

  /**
   * hold all the use cases / templates
   *
   * @private
   */
  private _allTemplates: Array<MissionTemplate> = [];

  /**
   * hold all the questions
   *
   * @private
   */
  private _allQuestions: Array<MissionQuestion> = [];

  /**
   * single question.
   *
   * @private
   */
  private _question: MissionQuestion = <MissionQuestion>{};

  private _notifyObj: Subject<boolean> = new Subject<boolean>();

  /**
   * name of the sections in the innovation card.
   * for the old presets.
   * @private
   */
  private _sectionsNames: Array<string> = [];

  /**
   * store the info of all cards of innovation.
   * instead of showing the section type we show the Section name and behind we change the section type.
   * @private
   */
  private _cardsSections: MissionCardTitle = <MissionCardTitle>{};

  private _questionnaireLangs: Array<Language> = [];

  /**
   * for the moment we always add the entry in both languages
   * later we will deal with it.
   */
  private _addEntryLang: Array<string> = ['en', 'fr'];

  /**
   * Questions identifier should imperatively be less than 24 characters for etherpad purposes
   * @private
   */
  private _taggedQuestionsTypes: { [identifier: string]: MissionQuestionType } = {
    InnovOpp: 'radio',
    Expectations: 'textarea',
    FutureTrends: 'textarea',
    AreasOfDev: 'textarea',
    PreIdentifiedIssues: 'ranking',
    MarketPlayers: 'textarea',
    MarketImpact: 'textarea',
    ContinueDiscussion: 'radio',
    Recontact: 'textarea',
    ExistenceOfNeeds: 'radio',
    CritOfNeeds: 'radio',
    RankNeeds: 'ranking',
    CurrentUsedSol: 'textarea',
    SolLimitations: 'textarea',
    Stakeholders: 'checkbox',
    IdentifySol: 'textarea',
    IdentifySuppliers: 'textarea',
    ProblemSolFit: 'stars',
    MaturityLevel: 'radio',
    SimilarProblem: 'textarea',
    OtherMarketPlayers: 'textarea',
    DetectNeeds: 'textarea',
    Adaptability: 'radio',
    RankFeatures: 'ranking',
    ExpectedSpec: 'textarea',
    AdoptionBarriers: 'textarea',
    ExistingSol: 'textarea',
    ValueOfSol: 'radio',
    Strengths: 'textarea',
    Weaknesses: 'textarea',
    WillingnessToPay: 'radio',
    BusinessModelExpect: 'radio',
    RankMarketNeeds: 'ranking',
    RankArguments: 'ranking',
    PricePositioning: 'radio',
    BusinessModelValid: 'radio'
  };

  /**
   * these are the identifier of the question that we use in the Market report are of type general which do not have to do anything
   * with the Innovation preset or Mission template.
   * @private
   */
  private _generalMarketQuestionsTypes: Array<string> = ['finalConclusion', 'professionals', 'keyLearning'];

  constructor() {
  }

  /**
   * return the value from the entry or directly from the questions.
   * If it's from the entry you need to pass the attr value.
   * For the previous questions we always have the label attribute.
   *
   * Entry can be the MissionOptionEntry, MissionSectionEntry, MissionQuestion... see the respective interface.
   * @param value
   * @param attr
   * @param lang
   */
  public static label(value: any = <any>{}, attr: string, lang = 'en') {
    if (value.entry && value.entry.length) {
      const entry = MissionQuestionService.entryInfo(value, lang);
      if (!!entry && entry[attr]) {
        return entry[attr];
      } else {
        return value.entry[0] && value.entry[0][attr];
      }
    } else {
      if (attr === 'title' || attr === 'subtitle') {
        return value[attr] && value[attr][lang] || '';
      } else {
        return value.label && value.label[lang] || '';
      }
    }
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
  public static questionInstruction(controlType: MissionQuestionType): { en: string, fr: string } {
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

      case 'likert-scale':
        return {
          en: '',
          fr: ''
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

    if (nbOptions > 4 && nbOptions <= 6 && question.controlType === 'radio') {
      for (const indexOption in question.options) {
        const index = parseInt(indexOption);
        question.options[indexOption].color = colors[index + 4].value;
      }
    } else
      for (let i = 0; i < nbOptions; i++) {
        question.options[i].color = colors[i % 10].value;
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
    this.setTemplate(this._template);
    this.setNotifyChanges(true);
  }

  /**
   * based on the control type we configure question
   * maxOptionsSelect, options and instructions
   * @param question
   * @param emitChanges
   */
  public configureQuestion(question: MissionQuestion, emitChanges = true): MissionQuestion {
    if (question && question.controlType) {

      question.entry.forEach((_entry) => {
        _entry.instruction = MissionQuestionService.questionInstruction(question.controlType)[_entry.lang];
      });

      question.maxOptionsSelect = null;
      question.canComment = true;

      if (question.controlType === 'textarea') {
        question.canComment = false;
      }
      if (question.controlType === 'ranking') {
        question.randomization = true;
      }
      if (question.controlType === 'likert-scale') {
        question.attitudeMeasure = question.attitudeMeasure || 'agreement';
        delete question.options;
      }

      question = this.configureQuestionOptions(question);

      if (emitChanges) {
        this._emitTemplate();
      }
    }

    return question;
  }

  /**
   * based on the question type its configure the question attributes to its default values.
   * @param question
   */
  public configureQuestionOptions(question: MissionQuestion = <MissionQuestion>{})
    : MissionQuestion {

    const oldOptions = question.options;
    question.options = [];

    if (question.controlType === 'checkbox' || question.controlType === 'radio'
      || question.controlType === 'stars' || question.controlType === 'ranking') {
      for (let i = 0; i < 4; i++) {
        question.options.push(this.addOption(question, oldOptions));
      }
    }


    if (question.controlType === 'checkbox') {
      question.maxOptionsSelect = 4;
    }

    if (question.controlType === 'radio') {
      question = MissionQuestionService.setOptionsColors(question);
      question = MissionQuestionService.setOptionsPositiveAnswer(question);
    }

    if (question.controlType === 'likert-scale') {
      const measureOptions = this.dataOfChoiceLikertScale[question.attitudeMeasure];
      for (let i = 0; i < measureOptions.length; i++) {
        question.options.push(this.addOptionLikert(question, measureOptions[i]));

        question = MissionQuestionService.setOptionsColors(question);
        question = MissionQuestionService.setOptionsPositiveAnswer(question);

      }
    }

    return question;
  }


  /**
   * return the new option for the controlType = 'radio' | 'checkbox' | 'stars' | 'ranking'
   * @param question,
   * @param oldOptions
   */
  public addOption(question: MissionQuestion = <MissionQuestion>{}, oldOptions?: any[]): MissionQuestionOption {

    if (question.controlType === 'radio' || question.controlType === 'checkbox'
      || question.controlType === 'stars' || question.controlType === 'ranking') {
      const id = question.options.length;

      return {
        identifier: id.toString(),
        positive: false,
        entry: this._addEntryLang.map((_lang) => {
          let option = 'Option ' + id.toString();
          // if there are old options, we should keep the text
          if (oldOptions && oldOptions.length && oldOptions.length > id) {
            const optionToReplace = this.replaceOption(_lang, oldOptions[id]);
            if (optionToReplace) {
              option = optionToReplace;
            }
          }
          return {
            lang: _lang,
            label: option
          };
        })
      };
    }

    return <MissionQuestionOption>{};
  }


  /**
   * return the new option for the attitudeMeasure = 'agreement' | 'frequency' | 'satisfaction' | 'use'| 'quality'
   * | 'relevance' | 'importance' | 'interest' |'criticality | 'adoptability';
   * @param question,
   * @param measureOptions
   */
  public addOptionLikert(question: MissionQuestion = <MissionQuestion>{}, measureOptions: any): MissionQuestionOption {
    if (question.controlType === 'likert-scale') {
      const id = question.options.length;
      return {
        identifier: id.toString(),
        positive: false,
        entry:  this._addEntryLang.map((_lang) => {
          return {
            lang: _lang,
            label: measureOptions[_lang]
          };
        })
      };
    }
    return <MissionQuestionOption>{};
  }

  /**
   * find option's text in right lang
   * @param lang
   * @param option
   * @private
   */
  private replaceOption(lang: string, option: any) {
    if (option.entry && option.entry.length) {
      const _entry = option.entry.find((e: any) => e.lang === lang);
      if (_entry) {
        return _entry.label;
      }
    }
    return '';
  }

  /**
   * to delete the option from the question.
   *
   * @param question
   * @param optionIndex
   * @param emitChanges
   */
  public deleteOption(question: MissionQuestion = <MissionQuestion>{}, optionIndex: number, emitChanges = true) {
    if (question.options && question.options.length) {
      const options = question.options;
      options.splice(optionIndex, 1);
      MissionQuestionService.reConfigureOptionsIdentifier(options);
      this.configureCheckbox(question);

      if (question.controlType === 'radio') {
        MissionQuestionService.setOptionsColors(question);
        MissionQuestionService.setOptionsPositiveAnswer(question);
      }

      if (emitChanges) {
        this._emitTemplate();
      }
    }

    return question;
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
        _entry.instruction = _entry.instruction.replace(replaceNumberRegex, (' ' + total.toString(10)));
      });
    }

    return question;
  }

  /**
   * add the new option in the list of options.
   * @param question
   * @param emitChanges
   */
  public addNewOption(question: MissionQuestion = <MissionQuestion>{}, emitChanges = true) {
    const option = this.addOption(question);

    if (option && !!option.identifier) {
      question.options.push(option);
      MissionQuestionService.setOptionsColors(question);
      MissionQuestionService.setOptionsPositiveAnswer(question);
      this.configureCheckbox(question);
    }

    if (emitChanges) {
      this._emitTemplate();
    }

    return question;
  }

  /**
   * return the question entry of the question.
   * @param questionType
   */
  public createQuestionEntry(questionType: MissionQuestionType): Array<MissionQuestionEntry> {
    const entry: Array<MissionQuestionEntry> = [];
    for (let i = 0; i < this._addEntryLang.length; i++) {
      entry.push({
        title: '',
        subtitle: '',
        instruction: MissionQuestionService.questionInstruction(questionType)[this._addEntryLang[i]],
        label: '',
        objective: '',
        lang: this._addEntryLang[i]
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
        entry: this._addEntryLang.map((_lang) => {
          return {
            lang: _lang,
            name: 'New section ' + this._template.sections.length
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
   * @param type
   */
  public addQuestion(sectionIndex: number, type: MissionQuestionType = 'radio') {
    if (this._template && this._template.sections[sectionIndex] && this._template.sections[sectionIndex].questions) {
      this._template.sections[sectionIndex].questions.push(this.createQuestion(type));
      this._emitTemplate();
    }
  }

  /**
   * create a question with default values
   *
   * @param type
   */
  public createQuestion(type: MissionQuestionType = 'radio'): MissionQuestion {
    let question: MissionQuestion = {
      type: 'COMPLEMENTARY',
      controlType: type,
      visibility: true,
      canComment: true,
      randomization: false,
      sensitiveAnswerData: false,
      identifier: this.generateId(),
      entry: this.createQuestionEntry(type),
    };
    question = this.configureQuestion(question);
    return question;
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
   * @param question
   * @param optionIndex
   * @param move - 1 (down) | -1 (up)
   * @param emitChanges
   */
  public moveQuestionOption(question: MissionQuestion, optionIndex: number, move: number, emitChanges = true) {
    const new_place = optionIndex + move;
    const options = question.options;

    if (new_place >= 0 && new_place < options.length) {
      options[new_place] = options.splice(optionIndex, 1, options[new_place])[0];
      MissionQuestionService.reConfigureOptionsIdentifier(options);
      if (emitChanges) {
        this._emitTemplate();
      }
    }

    return question;
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
   * @param emitChanges
   */
  public changeQuestionEntry(newValue: any, lang: string, question: MissionQuestion, attr: string, emitChanges = true) {
    if (question && question.entry && question.entry.length) {
      const index = question.entry.findIndex((_entry) => _entry.lang === lang);
      if (index !== -1) {
        question.entry[index][attr] = newValue;
        if (emitChanges) {
          this._emitTemplate();
        }
      }
    }

    return question;
  }

 /***
   * update the value of the option entry with new value.
   * @param newValue
   * @param lang
   * @param question
   * @param optionIndex
   * @param emitChanges /* /!**
   * update the value of the option entry with new value.
   * @param newValue
   * @param lang
   * @param question
   * @param optionIndex
   * @param emitChanges
   */
  public changeQuestionOptionEntry(newValue: string, lang: string, question: MissionQuestion,
                                   optionIndex: number, emitChanges = true) {
    if (question && question.options && question.options[optionIndex]) {
      const option = question.options[optionIndex];
      const index = option.entry.findIndex((_entry) => _entry.lang === lang);
      if (index !== -1) {
        option.entry[index].label = newValue;
        if (emitChanges) {
          this._emitTemplate();
        }
      }
    }

    return question;
  }


  /**
   * update the value of the option with new value not the option entry.
   * @param newValue
   * @param question
   * @param optionIndex
   * @param attr
   */
  public changeQuestionOption(newValue: any, question: MissionQuestion, optionIndex: number, attr: string) {
    if (question && question.options && question.options[optionIndex]) {
      const option = question.options[optionIndex];
      if (!!option) {
        option[attr] = newValue;
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
   * based on the questionnaireLangs will search the entry of the question and if not found then
   * return first entry of the questionnaireLangs
   * @param question
   * @param lang
   */
  public questionEntry(question: MissionQuestion = <MissionQuestion>{}, lang: string): MissionQuestionEntry {
    if (this._questionnaireLangs.length) {
      const quesLang = this._questionnaireLangs.find((_lang) => _lang.type === lang);
      if (!!quesLang) {
        return MissionQuestionService.entryInfo(question, quesLang.type);
      } else {
        return MissionQuestionService.entryInfo(question, 'en') || <MissionQuestionEntry>{};
      }
    }

    return question.entry && question.entry[0] || <MissionQuestionEntry>{};
  }

  /**
   * remove the question
   * @param questionIndex
   * @param sectionIndex
   * @param returnValue
   */
  public removeQuestion(questionIndex: number, sectionIndex: number, returnValue = false) {
    const question = this._template.sections[sectionIndex].questions[questionIndex];
    this._template.sections[sectionIndex].questions.splice(questionIndex, 1);

    if (!returnValue) {
      this._emitTemplate();
    } else {
      return question;
    }
  }

  /**
   * clone the question.
   * @param questionIndex
   * @param sectionIndex
   * @param returnValue
   */
  public cloneQuestion(questionIndex: number, sectionIndex: number, returnValue = false) {
    const questions: Array<MissionQuestion> = this._template.sections[sectionIndex].questions;
    let question: any;

    if (!returnValue) {
      question = {...questions[questionIndex]};
    } else {
      question = {...questions[questionIndex]['question']};
    }

    /**
     * mutate question to avoid getting 2 questions with the same id
     */
    delete question._id;
    question.identifier = this.generateId();

    if (!returnValue) {
      questions.push(JSON.parse(JSON.stringify(question)));
      this._emitTemplate();
    } else {
      return JSON.parse(JSON.stringify(question));
    }
  }

  /**
   *
   * @param identifier
   */
  public isTaggedQuestion(identifier: string): boolean {
    return Object.keys(this._taggedQuestionsTypes).indexOf(identifier) !== -1;
  }

  /**
   * make sensitiveAnswerData to true if exists.
   * @param identifier
   */
  public isContactQuestion(identifier: string): boolean {
    return this.isTaggedQuestion(identifier) && identifier.indexOf('Recontact') !== -1;
  }

  /**
   *
   */
  public getNonUsedQuestions(): Array<string> {
    const identifiersMap = this._template.sections.reduce((accS, section) => {
      const subIdentifiersMap = section.questions.reduce((accQ, question) => Object.assign(accQ, {[question.identifier]: 1}), {});
      return Object.assign(accS, subIdentifiersMap);
    }, {} as { [questionId: string]: 1 });
    return Object.keys(this._taggedQuestionsTypes).filter((tag) => !identifiersMap[tag]);
  }

  /**
   *
   * @param identifier
   */
  public getQuestionType(identifier: string): MissionQuestionType {
    return this._taggedQuestionsTypes[identifier];
  }

  /**
   * return true if the identifier matches to market report general type questions.
   * @param question
   */
  public marketReportGeneralQuestion(question: any): boolean {
    return question && question.identifier && this._generalMarketQuestionsTypes.indexOf(question.identifier) !== -1;
  }

  /**
   * behaviour object to listen for the mission template.
   */
  public missionTemplate(): BehaviorSubject<MissionTemplate> {
    return this._missionTemplateObj;
  }

  /**
   * set the mission template / use case.
   *
   * @param value
   */
  public setTemplate(value: MissionTemplate) {
    this._template = value;
    this._missionTemplateObj.next(value);
  }

  /**
   * set the mission question
   *
   * @param value
   */
  public setQuestion(value: MissionQuestion) {
    this._question = value;
  }

  /**
   * set all the use cases
   *
   * @param value
   */
  public setAllTemplates(value: Array<MissionTemplate>) {
    this._allTemplates = value;
  }


  /**
   * set all the questions
   *
   * @param value
   */
  public setAllQuestions(value: Array<MissionQuestion>) {
    this._allQuestions = value;
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

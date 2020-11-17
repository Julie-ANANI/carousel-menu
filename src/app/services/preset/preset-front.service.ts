import { Injectable } from '@angular/core';
import { Preset } from '../../models/preset';
import { Question, QuestionType } from '../../models/question';
import { Section } from '../../models/section';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PresetFrontService {

  private _savePresetSubject: Subject<boolean> = new Subject<boolean>();

  private taggedQuestionsTypes: {[identifier: string]: QuestionType} = {
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

  constructor() {}

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

  public getNonUsedQuestions(): Array<string> {
    const identifiersMap = this._preset.sections.reduce((accS, section) => {
      const subIdentifiersMap = section.questions.reduce((accQ, question) => Object.assign(accQ, {[question.identifier]: 1}), {});
      return Object.assign(accS, subIdentifiersMap);
    }, {} as {[questionId: string]: 1});
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
      const newQuestion: Question = {
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
        sensitiveAnswerData: false,
        options: []
      };
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

  public cloneQuestion(questionIndex: number, sectionIndex: number) {
    const questions: Array<Question> = this._preset.sections[sectionIndex].questions;
    const question: Question = { ...questions[questionIndex] };
    /* mutate question to avoid getting 2 questions with the same id */
    delete question._id;
    question.identifier = this.generateId();
    questions.push(JSON.parse(JSON.stringify(question)));
  }

  public removeQuestion(questionIndex: number,  sectionIndex: number) {
    this._preset.sections[sectionIndex].questions.splice(questionIndex, 1);
  }

  get preset(): Preset { return this._preset; }
  set preset(value: Preset) { this._preset = value; }

  get sectionsNames(): Array<string> { return this._sectionsNames; }
  set sectionsNames(value: Array<string>) { this._sectionsNames = value; }
}

import { Injectable } from '@angular/core';
import { Preset } from '../../../../../models/preset';
import { Question, QuestionType } from '../../../../../models/question';
import { Section } from '../../../../../models/section';

@Injectable()
export class PresetService {

  private taggedQuestionsTypes: {[identifier: string]: QuestionType} = {
    context: 'radio',
    marketNeed: 'radio',
    relevance: 'radio',
    differentiation: 'radio',
    strengths: 'textarea',
    objections: 'textarea',
    applications: 'textarea',
    leads: 'checkbox',
    competition: 'textarea',
    benefits: 'stars'
  };

  private _preset: Preset;

  constructor() {}

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
    questions.push(question);
  }

  public removeQuestion(questionIndex: number,  sectionIndex: number) {
    this._preset.sections[sectionIndex].questions.splice(questionIndex, 1);
  }

  get preset(): Preset { return this._preset; }
  set preset(value: Preset) { this._preset = value; }

}

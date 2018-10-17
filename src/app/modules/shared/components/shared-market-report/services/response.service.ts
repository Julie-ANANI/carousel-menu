import { Injectable } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { Subject } from 'rxjs/Subject';
import { Question } from '../../../../../models/question';
import { Section } from '../../../../../models/section';
import { Innovation } from '../../../../../models/innovation';

@Injectable()
export class ResponseService {

  executiveAnswers = new Subject <Array<Answer>>();

  filteredAnswers = new Subject <Array<Answer>>();

  constructor() {
  }

  setExecutiveAnswers(value: Array<Answer>) {
    this.executiveAnswers.next(value);
  }

  getExecutiveAnswers(): Subject <Array<Answer>> {
    return this.executiveAnswers;
  }

  setFilteredAnswers(value: Array<Answer>) {
    this.filteredAnswers.next(value);
  }

  getFilteredAnswers(): Subject <Array<Answer>> {
    return this.filteredAnswers;
  }


  /***
   * This function is to get and returns the questions from the innovation.
   */
   getPresets(innovation: Innovation): Array<Question> {

    let questions: Array<Question>;

    questions = innovation.preset.sections.reduce((questionArray: Array<Question>, section: Section) => {
      return questionArray.concat(section.questions);
    }, []);

    return questions;

  }


  /***
   *This function is the get the answers based on the question that we pass
   * and than we pass these answers to the sub components.
   */
  getAnswersToShow(answers: Array<Answer>, question: Question): Array<Answer> {

    let answersToShow: Array<Answer>;

    const questionID = question.identifier;

    answersToShow = answers.filter((a) => (a.answers[questionID]));

    switch (question.controlType) {

      case 'clearbit':
        break;

      case 'list':
        break;

      case 'checkbox':
        /***
         * here we are checking that at least one of the options of the answer is true.
         * @type {Answer[]}
         */
        answersToShow = answersToShow.filter(
          (a) => Object.keys(a.answers[questionID]).some((k) => a.answers[questionID][k])
        );

        break;

      case 'textarea':
        /***
         * here we are sorting the answer array first by quality and then length.
         * @type {Answer[]}
         */
        answersToShow = answersToShow.filter((a) => (a.answers[questionID + 'Quality'] !== 0)).sort((a, b) => {
            if ((b.answers[questionID + 'Quality'] || 1) - (a.answers[questionID + 'Quality'] || 1) === 0) {
              return b.answers[questionID].length - a.answers[questionID].length;
            } else {
              return (b.answers[questionID + 'Quality'] || 1) - (a.answers[questionID + 'Quality'] || 1);
            }
          });

        break;

      default:
        answersToShow = answersToShow.filter((a) => (a.answers[questionID + 'Quality'] !== 0));
    }

    return answersToShow;

  }


  /***
   * This function is to save the abstract in the innovation object.
   * @param {Innovation} project
   * @param {string} abstractValue
   * @param {string} quesId
   * @returns {Innovation}
   */
  saveInnovationAbstract(project: Innovation, abstractValue: string, quesId: string): Innovation {
    const innovation = project;
    const index = innovation.executiveReport.abstracts.findIndex((ques) => ques.quesId === quesId);

    if (index !== -1) {
      innovation.executiveReport.abstracts[index].value = abstractValue;
    } else {
      innovation.executiveReport.abstracts.push({
        quesId: quesId, value: abstractValue
      });
    }

    return innovation;

  }


  /***
   * This function is to get the abstract value of the question that we pass.
   * @param {Innovation} innovation
   * @param {string} quesId
   * @returns {string}
   */
  getInnovationAbstract(innovation: Innovation, quesId: string): string {
    const abstract = innovation.executiveReport.abstracts.find((ques) => ques.quesId === quesId);
    let value;

    value = abstract ? abstract.value : '';

    return value;

  }


  /***
   * This function returns the color according to the length of the input data.
   * @param {number} length
   * @param {number} limit
   * @returns {string}
   */
  getColor(length: number, limit: number): string {
    if (length <= 0) {
      return '#EA5858';
    } else if (length > 0 && length < (limit / 2)) {
      return '#f0ad4e';
    } else {
      return '#2ECC71';
    }
  }


}

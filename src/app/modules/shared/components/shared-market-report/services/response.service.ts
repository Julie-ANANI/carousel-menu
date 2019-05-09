import { Injectable } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { Subject } from 'rxjs/Subject';
import { Question } from '../../../../../models/question';
import { Section } from '../../../../../models/section';
import { Innovation } from '../../../../../models/innovation';
import { Tag } from '../../../../../models/tag';
import { Multiling } from '../../../../../models/multiling';

@Injectable()
export class ResponseService {

  filteredAnswers = new Subject <Array<Answer>>();

  constructor() { }

  /***
   * Return the list of tags on every user answers for a given question
   * @param answers
   * @param question
   */
  static getTagsList(answers: Array<Answer>, question: Question): Array<Tag> {

    let tags: Array<Tag>;
    const tagId = question.identifier + (question.controlType !== 'textarea' ? 'Comment' : '');

    tags = answers.reduce((tagsList, answer) => {

      const answerTags = answer.answerTags[tagId];

      if (Array.isArray(answerTags)) {
        answerTags.forEach((t) => {
          const previousTag = tagsList.find((t2) => t2._id === t._id);

          if (previousTag) {
            previousTag['count'] += 1;
          } else {
            t['count'] = 1;
            tagsList.push(t);
          }

        });
      }
      return tagsList;
    }, []).sort((a, b) => b.count - a.count);

    return tags;

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
  static getPresets(innovation: Innovation): Array<Question> {

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

      case 'stars':
        /***
         * here we are checking that at least one of the options of the answer is noted > 0.
         * @type {Answer[]}
         */
        answersToShow = answersToShow.filter(
          (a) => Object.keys(a.answers[questionID]).some((k) => a.answers[questionID][k] > 0)
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
   * this function is to get the notes data answer for the question type star.
   * @param question
   * @param answers
   */
  static getStarsAnswers(question: Question, answers: Array<Answer>) {

    let notesData: Array<{label: Multiling, sum: number, percentage: string}> = [];

    if (question && answers) {

      notesData = question.options.map((x: any) => {
        return {
          label: x.label,
          sum: 0,
          percentage: '0%'
        };
      });

      answers.forEach((answer) => {
        Object.keys(answer.answers[question.identifier]).forEach((k) => {
          const idx = parseInt(k, 10);
          const vote = parseInt(answer.answers[question.identifier][k], 10);
          if (Number.isInteger(idx) && Number.isInteger(vote) && idx < notesData.length) {
            // If user didn't vote this characteristic, default value will be 0.
            notesData[k].sum += vote;
          }
        });
      });

      notesData = notesData.map((noteData) => {
          if (answers.length > 0) {
            noteData.percentage = `${Math.round(((noteData.sum / answers.length) || 0) * 20)}%`;
          }
          return noteData;
        }).sort((noteA, noteB) => {
          return noteB.sum - noteA.sum;
        });

    }

    return notesData;

  }

}

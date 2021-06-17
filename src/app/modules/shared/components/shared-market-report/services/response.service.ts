import { Injectable } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { Subject } from 'rxjs/Subject';
import { Question } from '../../../../../models/question';
import { Section } from '../../../../../models/section';
import { Innovation } from '../../../../../models/innovation';
import { Tag } from '../../../../../models/tag';
import { Multiling } from '../../../../../models/multiling';
import { BarData } from '../models/bar-data';
import { PieChart } from '../../../../../models/pie-chart';
import { Professional } from '../../../../../models/professional';

@Injectable({ providedIn: 'root' })
export class ResponseService {

  filteredAnswers = new Subject <Array<Answer>>();

  /***
   * Return the list of tags on every user answers for a given question
   * @param answers
   * @param question
   */
  static tagsList(answers: Array<Answer>, question: any): Array<Tag> {

    const tagId = question.identifier + (question.controlType !== 'textarea' ? 'Comment' : '');

    return answers.reduce((tagsList, answer) => {

      const answerTags: Array<Tag&{count?: number}> = answer.answerTags[tagId];

      if (Array.isArray(answerTags)) {
        answerTags.forEach((t) => {
          const previousTag = tagsList.find((t2) => t2._id === t._id);

          if (previousTag) {
            previousTag.count += 1;
          } else {
            t.count = 1;
            tagsList.push(t);
          }

        });
      }
      return tagsList;
    }, []).sort((a, b) => b.count - a.count);

  }

  /***
   * This function is to returns the questions from the innovation.
   * @param innovation
   */
  static presets(innovation: Innovation): Array<Question> {
    let questions: Array<Question> = [];

    if (innovation && innovation.preset && innovation.preset.sections && innovation.preset.sections.length > 0) {
      questions = innovation.preset.sections.reduce((questionArray: Array<Question>, section: Section) => {
        return questionArray.concat(section.questions);
      }, []);
    }

    return questions;
  }


  /***
   * this will return the professionals of the provided answers.
   * @param answers
   */
  static answersProfessionals(answers: Array<Answer>): Array<Professional> {
    let professionals: Array<Professional> = [];

    if (answers && answers.length > 0) {
      answers.forEach((answer) => {
        if (answer.professional) {
          const index = professionals.findIndex((pro) => pro._id === answer.professional._id);
          if (index === -1 ) {
            professionals.push(answer.professional);
          }
        }
      })
    }

    return professionals;

  }


  /***
   *This function is the get the answers based on the question that we pass.
   * We are filtering the answers based on the question identifier.
   */
  public answersToShow(answers: Array<Answer>, question: Question): Array<Answer> {

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
        answersToShow = answersToShow.filter((a) => (a.answers[questionID + 'Quality'] !== 0))
          .sort((a, b) => {
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
    const abstract = innovation.executiveReport.abstracts.find((ques) =>
      ques.quesId === quesId);
    return abstract ? abstract.value : '';
  }


  /***
   * this function is to get the notes data answer for the question type star.
   * @param question
   * @param answers
   */
  public static getStarsAnswers(question: Question, answers: Array<Answer>) {

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
            notesData[idx].sum += vote;
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


  /***
   * this function is to get the bars data answer for the question type checkbox and radio.
   * @param question
   * @param answers
   */
  public static barsData(question: Question, answers: Array<Answer>) {

    let barsData: Array<BarData> = [];

    if (question && answers) {

      barsData = question.options.map((q) => {

        let filteredAnswers: Array<Answer> = [];

        if (question.controlType === 'checkbox') {
          filteredAnswers = answers.filter((a) => a.answers[question.identifier]
            && a.answers[question.identifier][q.identifier]
            && a.answers[question.identifier + 'Quality'] !== 0);
        } else if (question.controlType === 'radio')  {
          filteredAnswers = answers.filter((a) => a.answers[question.identifier] === q.identifier
            && a.answers[question.identifier + 'Quality'] !== 0 );
        }

        filteredAnswers = filteredAnswers.sort((a, b) => {
          if ((b.answers[question.identifier + 'Quality'] || 1) - (a.answers[question.identifier + 'Quality'] || 1) === 0) {
            const a_length = a.answers[question.identifier + 'Comment'] ? a.answers[question.identifier + 'Comment'].length : 0;
            const b_length = b.answers[question.identifier + 'Comment'] ? b.answers[question.identifier + 'Comment'].length : 0;
            return b_length - a_length;
          } else {
            return (b.answers[question.identifier + 'Quality'] || 1) - (a.answers[question.identifier + 'Quality'] || 1);
          }
        });

        return {
          label: q.label,
          answers: filteredAnswers,
          absolutePercentage: '0%',
          relativePercentage: '0%',
          color: question.controlType === 'checkbox' ? '#FFB300' : q.color,
          count: filteredAnswers.length,
          positive: q.positive,
          identifier: q.identifier
        };

      });

      // Then calcul percentages
      const maxAnswersCount = barsData.reduce((acc, bd) => {
        return (acc < bd.count) ? bd.count : acc;
      }, 0);

      const relativePercentages: {difference: Array<number>, rounded: Array<number>} = {
        difference: [],
        rounded: []
      };
      barsData.forEach((bd) => {
        const absolutePercentage = bd.count * 100 / answers.length;
        bd.absolutePercentage = `${Math.round(absolutePercentage)}%`;
        const relativePercentage = bd.count * 100 / maxAnswersCount;
        relativePercentages.difference.push(Math.round(relativePercentage) - relativePercentage);
        relativePercentages.rounded.push(Math.round(relativePercentage));
      });

      const fixPercentagesSum = (values: {difference: Array<number>, rounded: Array<number>}, questionType: string) => {
        if (questionType === 'radio') {
          // first we check if the sum of rounded values is equal to 100
          let diff = values.rounded.reduce((acc: number, curr: number) => acc + curr, 0) - 100;
          // if there is a difference, we need to fix it!
          while (diff) {
            const index = diff < 0 ?
              values.difference.findIndex((value: number) => value === Math.min(...values.difference)) :
              values.difference.findIndex((value: number) => value === Math.max(...values.difference));
            values.rounded[index] += diff / Math.abs(diff);
            values.difference[index] = 1 + values.difference[index];
            diff = values.rounded.reduce((acc: number, curr: number) => acc + curr, 0) - 100;
          }
        }
        fixPercentagesSum(relativePercentages, question.controlType);

        barsData.forEach((bd, i) => {
          bd.relativePercentage = `${relativePercentages.rounded[i]}%`;
        });
      };

      if (question.controlType === 'checkbox') {
        barsData.sort((a, b) => {
          return b.count - a.count;
        });
      }

    }

    return barsData;

  }

  /***
   * this function is to get the pie chart data for the question type radio.
   * @param barsData
   * @param answers
   */
  public static pieChartData(barsData: Array<BarData>, answers: Array<Answer>) {

    let positiveAnswersCount = 0;

    const pieChartData: PieChart = {
      data: [],
      colors: [],
      labels: {fr: [], en: []},
      labelPercentage: []
    };

    barsData.forEach((barData) => {

      if (barData.positive) {
        positiveAnswersCount += barData.count;
      }

      pieChartData.data.push(barData.count);
      pieChartData.colors.push(barData.color);
      pieChartData.labels.fr.push(barData.label.fr);
      pieChartData.labels.en.push(barData.label.en);
      pieChartData.labelPercentage.push(barData.absolutePercentage);

    });

    pieChartData.percentage = Math.round((positiveAnswersCount * 100) / answers.length);

    return pieChartData;

  }

  public static filterCommentAnswers(question: Question = <Question>{}, answers: Array<Answer> = []) {
    if (question && question.controlType && question.identifier && answers.length > 0) {
      const _id = question.identifier;

      switch (question.controlType) {

        case 'checkbox':
          return answers.filter(function(a) {
            return !(a.answers[_id] && Object.keys(a.answers[_id]).some((k) => a.answers[_id][k]))
              && a.answers[_id + 'Comment'] && a.answers[_id + 'CommentQuality'] !== 0;
          });

        case 'radio':
          return  answers.filter(function(a) {
            return !a.answers[_id] && a.answers[_id + 'Comment'] && a.answers[_id + 'CommentQuality'] !== 0;
          });

        default:
          return answers.filter(function(a) {
            return a.answers[_id + 'Comment'] && a.answers[_id + 'CommentQuality'] !== 0;
          });

      }
    }
    return [];
  }

  public static sortComments(question: Question = <Question>{}, answer: Array<Answer> = []) {
    if (question.identifier && answer.length > 0) {
      const _id = question.identifier;

      return answer.sort((a, b) => {
        if ((b.answers[_id + 'CommentQuality'] || 1) - (a.answers[_id + 'CommentQuality'] || 1) === 0) {
          return b.answers[_id + 'Comment'].length - a.answers[_id + 'Comment'].length;
        } else {
          return (b.answers[_id + 'CommentQuality'] || 1) - (a.answers[_id + 'CommentQuality'] || 1);
        }
      });
    }
    return [];
  }

}

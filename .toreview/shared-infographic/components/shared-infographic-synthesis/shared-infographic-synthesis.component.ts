import { Component, Input, OnInit } from '@angular/core';
import { TranslateService, initTranslation } from './i18n/i18n';

@Component({
  selector: 'app-shared-infographic-synthesis',
  templateUrl: './shared-infographic-synthesis.component.html',
  styleUrls: ['./shared-infographic-synthesis.component.styl']
})
export class SharedInfographicSynthesisComponent implements OnInit {

  @Input() public infographic: any;
  @Input() public question: any;
  

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    initTranslation(this._translateService);
  }

  getAnswerToQuestion (answer) {
    for (const question of answer.questions) {
      if (this.question.id === question.id) {
        const type = this.question.answerType;
        let answerTrueType = question.answer;
        if (type === 'number') {
          answerTrueType = Number(answerTrueType);
        }
        else if (type === 'boolean') {
          answerTrueType = Boolean(answerTrueType);
        }
        return answerTrueType;
      }
    }
  }

  getAllAnswersToQuestion () {
    const answersObj = [];
    for (const answer of this.infographic.answers) {
      for (const question of answer.questions) {
        if (this.question.id === question.id) {
          answersObj.push(question.answer);
        }
      }
    }
    return answersObj;
  }

  getPercentAnswers (): number {
    return this.getQuantityAnswers() * 100 / this.infographic.answers.length;
  }

  getPercentOfFollow (): number {
    return this.getQuantityFollow() * 100 / this.infographic.answers.length;
  }

  getQuantityAnswers () {
    let cpt = 0;
    for (const answers of this.infographic.answers) {
      for (const answer of answers.questions) {
        if (this.question.id === answer.id && answer.answer) {
          cpt++;
        }
      }
    }
    return cpt;
  }

  getQuantityFollow () {
    let cpt = 0;
    for (const answer of this.infographic.answers) {
      if (answer.follow === 'true') {
        cpt++;
      }
    }
    return cpt;
  }

  getQuantityOfTrue () {
    let cpt = 0;
    for (const answers of this.infographic.answers) {
      for (const answer of answers.questions) {
        if (this.question.id === answer.id && Boolean(answer.answer) === true) {
          cpt++;
        }
      }
    }
    return cpt;
  }

  getMoyenneOfAnswers () {
    let sum = 0;
    for (const answer of this.infographic.answers) {
      sum += Number(this.getAnswerToQuestion (answer)); // cast into number
    }
    return sum / this.getQuantityAnswers();
  }

  getPercentFavorable() {
    let cpt = 0;
    for (const answer of this.getAllAnswersToQuestion()) {
      if (this.question.answerPossibilities.indexOf(answer) < this.question.answerPossibilities.length / 2) {
        cpt++;
      }
    }
    return cpt * 100 / this.getAllAnswersToQuestion().length;
  }

}

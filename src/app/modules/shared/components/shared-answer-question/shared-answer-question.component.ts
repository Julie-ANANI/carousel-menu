/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'shared-answer-question',
  templateUrl: 'shared-answer-question.component.html',
  styleUrls: ['shared-answer-question.component.scss']
})

export class SharedAnswerQuestionComponent implements OnInit {

  private _selectLangInput = 'en';
  private _question: any;

  @Input() public answer;
  @Input() public fullAnswer;

  constructor(private _translateService: TranslateService,
              private _authService: AuthService) { }

  ngOnInit() {
    this._selectLangInput = this._translateService.currentLang || this._translateService.getBrowserLang() || 'fr';
    //TODO: comment on récupère les données de description de la question ?,
    this._question = {
      "controlType": "radio",
      "name": "relevantProblematic",
      "id": "relevantProblematic",
      "label": {
        "en": "Is this problem an issue in this market?",
        "fr": "Cette problématique est-elle un véritable enjeu sur ce marché ?"
      },
      "canComment": true,
      "options": [
        {
          "label": {
            "en": "No",
            "fr": "Non"
          }
        },
        {
          "label": {
            "en": "Possibly",
            "fr": "Eventuellement"
          }
        },
        {
          "label": {
            "en": "Yes",
            "fr": "Oui"
          }
        },
        {
          "label": {
            "en": "Definitely",
            "fr": "Cruciale"
          }
        }
      ]
    }
  }

  get question(): any { return this._question; }
  get lang(): any { return this._selectLangInput; }
}

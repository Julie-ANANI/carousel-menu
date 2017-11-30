import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { initTranslation, TranslateService } from './i18n/i18n';
import { AuthService } from '../../../../services/auth/auth.service';
import { ShareService } from '../../../../services/share/share.service';

@Component({
  selector: 'app-shared-project-description',
  templateUrl: './shared-project-description.component.html',
  styleUrls: ['./shared-project-description.component.scss']
})
export class SharedProjectDescriptionComponent implements OnInit {

  @Input() project: any;
  public idInnovationCard = 0;

  constructor(private _translateService: TranslateService,
              private _router: Router,
              private _authService: AuthService,
              public shareService: ShareService) { }


  ngOnInit() {
    initTranslation(this._translateService);

    this._displayInnovationCardWithLang(this._translateService.currentLang);

    for (const innovationCard of this.project.innovationCards) {
      if (innovationCard) {
        innovationCard.problem = innovationCard.problem.split('\n').join('<br>');
        innovationCard.solution = innovationCard.solution.split('\n').join('<br>');
      }
    }

    this._translateService.onLangChange.subscribe(data => {
      this._displayInnovationCardWithLang(data.lang);
    });
  }

  private _displayInnovationCardWithLang (lang) {
    for (const i in this.project.innovationCards) {
      if (this.project.innovationCards[i]) {
        if (this.project.innovationCards[i].lang === lang) {
          this.idInnovationCard = parseInt(i, 10);
        }
      }
    }
  }

  get isProjectOwner (): boolean {
    return this._authService.userId === this.project.owner.id;
  }

  get isAdmin (): boolean {
    return this._authService.isAdmin;
  }

  /**
   * Builds the data required to ask the API for a PDF
   * @returns {{projectId, innovationCardId}}
   */
  public dataBuilder(): any {
    return {
      projectId: this.project.id,
      innovationCardId: this.project.innovationCards[0].id,
      title: this.project.innovationCards[0].title.slice(0, Math.min(20, this.project.innovationCards[0].title.length)) + "-" + "project" +"(" + (this.project.innovationCards[0].lang || 'en') +").pdf"
    }
  }

  /**
   *
   * @param event
   */
  public compilingStatus(event) {
    console.log(event);
  }

  public getModel (): any {
    return {
      lang: 'en',
      jobType: 'innovationCard',
      labels: 'EXPORT.INNOVATION.CARD',
      pdfDataseedFunction: this.dataBuilder(),
      compilingStatus: this.compilingStatus
    };
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
  private _onEditingPage = false;

  constructor(private _translateService: TranslateService,
              private _activatedRoute: ActivatedRoute,
              private _authService: AuthService,
              public shareService: ShareService) { }


  ngOnInit() {
    this._displayInnovationCardWithLang(this._translateService.currentLang);

    for (const innovationCard of this.project.innovationCards) {
      if (innovationCard) {
        innovationCard.problem = innovationCard.problem.split('\n').join('<br>');
        innovationCard.solution = innovationCard.solution.split('\n').join('<br>');
      }
    }

    this._activatedRoute.url.subscribe(segments => {
      if (segments[0] && segments[0].path == 'edit') {
        this._onEditingPage = true;
      }
    });

    this._translateService.onLangChange.subscribe(data => {
      this._displayInnovationCardWithLang(data.lang);
    });
  }
  
  get lang() {
    return this._translateService.currentLang;
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
    return (this._authService.adminLevel & 2) >= 2;
  }
  
  get onEditingPage(): boolean {
    return this._onEditingPage;
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

  public getModel (): any {
    return {
      lang: 'en',
      jobType: 'inventionCard',
      labels: 'EXPORT.INNOVATION.CARD',
      pdfDataseedFunction: this.dataBuilder()
    };
  }
}

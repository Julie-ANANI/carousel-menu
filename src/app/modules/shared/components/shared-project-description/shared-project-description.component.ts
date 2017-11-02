import { Component, OnInit, Input } from '@angular/core';
import { initTranslation, TranslateService } from './i18n/i18n';

@Component({
  selector: 'app-shared-project-description',
  templateUrl: './shared-project-description.component.html',
  styleUrls: ['./shared-project-description.component.scss']
})
export class SharedProjectDescriptionComponent implements OnInit {

  @Input() project: any;
  public idInnovationCard = 0;

  constructor(private _translateService: TranslateService) { }


  ngOnInit() {
    initTranslation(this._translateService);

    this._displayInnovationCardWithLang(this._translateService.currentLang);

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
}

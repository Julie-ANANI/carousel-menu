import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../services/auth/auth.service';
import { FrontendService } from '../../../../../services/frontend/frontend.service';
import { TranslateService } from '@ngx-translate/core';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { InnovCard } from '../../../../../models/innov-card';

@Component({
  selector: 'app-admin-project',
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.scss']
})

export class AdminProjectComponent implements OnInit {

  private _project: Innovation;

  private _fetchingError: boolean;

  private _currentInnovationCard: InnovCard;

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _translateTitleService: TranslateTitleService,
              private _authService: AuthService,
              private _frontendService: FrontendService) {

    this._setPageTitle('COMMON.PAGE_TITLE.PROJECT');

  }

  ngOnInit() {

    if (this._activatedRoute.snapshot.data['innovation'] && this._activatedRoute.snapshot.data['innovation'] !== undefined) {
      this._project = this._activatedRoute.snapshot.data['innovation'];
      this._currentInnovationCard = InnovationFrontService.currentLangInnovationCard(this._project, this.userLang);
      this._setPageTitle(this._currentInnovationCard.title);
      this._metadata();
    } else {
      this._fetchingError = true;
    }

  }

  // todo remove.
  private _metadata() {
    this._frontendService.calculateInnovationMetadataPercentages(this._project, 'preparation');
    this._frontendService.calculateInnovationMetadataPercentages(this._project, 'campaign');
    this._frontendService.calculateInnovationMetadataPercentages(this._project, 'delivery');
  }

  private _setPageTitle(value: string) {
    this._translateTitleService.setTitle(value);
  }

  get authorizedTabs(): Array<string> {
    const adminLevel = this._authService.adminLevel;

    if (adminLevel > 1) {
      return ['settings', 'cards', 'answer_tags', 'questionnaire', 'campaigns', 'synthesis' ];
    } else {
      return ['cards', 'campaigns', 'synthesis'];
    }

  }

  // todo remove.
  getColor(length: number) {
    if (length < 34 && length >= 0) {
      return '#EA5858';
    } else if (length >= 34 && length < 67) {
      return '#f0ad4e';
    } else {
      return '#2ECC71';
    }
  }

  get userLang(): string {
    return this._translateService.currentLang;
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get currentInnovationCard(): InnovCard {
    return this._currentInnovationCard;
  }

  get project(): Innovation {
    return this._project;
  }

}

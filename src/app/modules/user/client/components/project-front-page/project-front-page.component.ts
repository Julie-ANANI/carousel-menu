import { Component, Input, OnChanges } from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { TranslateService } from '@ngx-translate/core';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { InnovCard } from '../../../../../models/innov-card';
import { ExecutiveReport } from '../../../../../models/executive-report';
import { UserFrontService } from '../../../../../services/user/user-front.service';
import { environment } from '../../../../../../environments/environment';

/***
 * this component is to show the first page of the Executive report.
 * You pass either the innovation or executive report object. Based on that
 * it assigns the value. If you pass the object type of Executive report with that also
 * pass the title and media.
 *
 * Example: print-executive-report module.
 */

interface ProjectFront {
  title: string;
  summary: string;
  media: string;
  objective: string;
  ownerName: string;
  ownerEmail: string;
  companyLogo: string;
}

@Component({
  selector: 'app-project-front-page',
  templateUrl: './project-front-page.component.html',
  styleUrls: ['./project-front-page.component.scss']
})

export class ProjectFrontPageComponent implements OnChanges {

  @Input() media = '';

  @Input() title = '';

  @Input() data: Innovation | ExecutiveReport = <Innovation | ExecutiveReport>{};

  private _userLang = this._translateService.currentLang;

  private _project: ProjectFront = <ProjectFront>{};

  constructor(private _translateService: TranslateService) { }

  ngOnChanges(): void {
    if (!this.title && !this.media && this.data && this.data['executiveReport']) {
      this._typeInnovation();
    } else if (this.title && this.media && this.data && this.data['summary']) {
      this._typeExecutive();
    }
  }

  /***
   * it the object type is Innovation.
   * @private
   */
  private _typeInnovation() {
    const innovation: Innovation = <Innovation>this.data;
    const card: InnovCard = InnovationFrontService.currentLangInnovationCard(innovation, this._userLang, 'CARD');
    this._userLang = card.lang;
    this._project = {
      title: card.title,
      summary: card.summary,
      objective: innovation.executiveReport && innovation.executiveReport['objective'],
      media: InnovationFrontService.principalMedia(innovation, this._userLang, '173', '110'),
      ownerName: UserFrontService.fullName(innovation.owner),
      ownerEmail: innovation.owner && innovation.owner.email,
      companyLogo: UserFrontService.logo(innovation.owner)
    };
  }

  /***
   * if the object type is Executive report
   * @private
   */
  private _typeExecutive() {
    const report: ExecutiveReport = <ExecutiveReport>this.data;
    this._userLang = report.lang;
    const logo = report.client && report.client.company && report.client.company.logo && report.client.company.logo.uri ?
      report.client.company.logo.uri : 'https://res.cloudinary.com/umi/image/upload/app/companies-logo/no-image.png';
    this._project = {
      title: this.title,
      summary: report.summary,
      objective: report.objective,
      media: this.media,
      ownerName: report.client.name,
      ownerEmail: report.client.email,
      companyLogo: logo
    };
  }

  get isUmi(): boolean {
    return environment.domain === 'umi';
  }

  get project(): ProjectFront {
    return this._project;
  }

  get userLang(): string {
    return this._userLang;
  }

}

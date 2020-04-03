import { Component, OnDestroy, OnInit } from '@angular/core';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../../../../models/innovation';
import { Mission } from '../../../../../../../models/mission';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../../../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ClientProject } from '../../../../../../../models/client-project';
import { Router } from '@angular/router';

interface Section {
  name: string;
  isVisible: boolean;
  isEditable: boolean;
  level: 'CLIENT_PROJECT' | 'MISSION' | 'INNOVATION'
}

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _mission: Mission = <Mission>{};

  private _clientProject: ClientProject = <ClientProject>{};

  private _isAdmin = this._authService.isAdmin;

  private _currentLang = this._translateService.currentLang;

  activeView = 'TITLE';

  dateFormat = this._currentLang === 'en' ? 'y/MM/dd' : 'dd-MM-y';

  private _sections: Array<Section> = [
    { name: 'TITLE', isVisible: false, isEditable: false, level: 'INNOVATION' },
    { name: 'PRINCIPAL_OBJECTIVE', isVisible: false, isEditable: false, level: 'MISSION' },
    { name: 'SECONDARY_OBJECTIVE', isVisible: false, isEditable: false, level: 'MISSION' },
    { name: 'ROADMAP', isVisible: false, isEditable: !!(this._isAdmin) , level: 'MISSION' },
    { name: 'RESTITUTION_DATE', isVisible: false, isEditable: false, level: 'MISSION' },
    { name: 'OWNER', isVisible: false, isEditable: !!(this._isAdmin), level: 'INNOVATION' },
    { name: 'COLLABORATORS', isVisible: true, isEditable: true, level: 'INNOVATION' },
    { name: 'OPERATOR', isVisible: false, isEditable: !!(this._isAdmin), level: 'INNOVATION' },
    { name: 'COMMERCIAL', isVisible: false, isEditable: !!(this._isAdmin), level: 'CLIENT_PROJECT' },
    { name: 'LANGUAGE', isVisible: false, isEditable: false, level: 'INNOVATION' },
    { name: 'AUTHORISATION', isVisible: false, isEditable: false, level: 'MISSION' },
  ];

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _authService: AuthService,
              private _translateService: TranslateService,
              private _router: Router,
              private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;

      if (<Mission>this._innovation.mission && (<Mission>this._innovation.mission)._id) {
        this._mission = <Mission>this._innovation.mission;
      }

      if (<ClientProject>this._innovation.clientProject && (<Mission>this._innovation.clientProject)._id) {
        this._clientProject = <ClientProject>this._innovation.clientProject;
      }

      this._initSections();
      console.log(this._sections);
    });

  }

  /***
   * based on the innovation we initialize the sections. We also check here which section
   * to make visible and editable.
   * @private
   */
  private _initSections() {
    if (this._innovation && this._innovation.status) {
      this._sections.forEach((section) => {
        switch (section.name) {

          case 'TITLE':
            section.isVisible = !!this._innovation.name;
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
            break;

          case 'PRINCIPAL_OBJECTIVE':
            section.isVisible = !!(this._mission.objective && this._mission.objective.principal
              && this._mission.objective.principal[this._currentLang]);
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
            break;

          case 'SECONDARY_OBJECTIVE':
            section.isVisible = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED')
              || !!(this._mission.objective && this._mission.objective.principal && this._mission.objective.secondary[this._currentLang]);
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
            break;

          case 'OWNER':
            section.isVisible = !!(this._innovation.owner);
            break;

          case 'OPERATOR':
            section.isVisible = !!(this._isAdmin) || !!(this._innovation.operator && this._innovation.operator.id);
            break;

          case 'COMMERCIAL':
            section.isVisible = !!(this._isAdmin) || !!(this._clientProject.commercial);
            break;

          case 'RESTITUTION_DATE':
            section.isVisible = !!(this._mission.milestoneDates && this._mission.milestoneDates.length > 0
              && this._mission.milestoneDates.some((milestone) => milestone.code === 'RDO'));
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
            break;

          case 'ROADMAP':
            section.isVisible = !!(this._mission.milestoneDates && this._mission.milestoneDates.length > 0);
            /* Todo uncomment
            section.isVisible = !!(this._mission.milestoneDates && this._mission.milestoneDates.length > 0
              && this._mission.milestoneDates.some((milestone) => milestone.code !== 'RDO'));
             */
            break;

          case 'LANGUAGE':
            section.isVisible = !!(this._isAdmin) || !!(this._innovation.innovationCards && this._innovation.innovationCards.length > 0);
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED') || !!(this._isAdmin);
            break;

          case 'AUTHORISATION':
            section.isVisible = !!(this._mission.externalDiffusion);
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
            break;

        }
      });
    }
  }

  public navigateToSection(name: string) {
    this.activeView = name;
    this._router.navigate([`/user/projects/${this._innovation._id}/settings`], { fragment: name.toLowerCase() });
  }

  get mission(): Mission {
    return this._mission;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get clientProject(): ClientProject {
    return this._clientProject;
  }

  get sections(): Array<Section> {
    return this._sections;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

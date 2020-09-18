import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Innovation} from '../../../../../../models/innovation';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {StatsInterface} from '../../admin-stats-banner/admin-stats-banner.component';
import {Mission, MissionType} from '../../../../../../models/mission';
import {User} from '../../../../../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import {MissionService} from '../../../../../../services/mission/mission.service';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {DashboardService} from '../../../../../../services/dashboard/dashboard.service';
import {UserFrontService} from '../../../../../../services/user/user-front.service';
import {InnovationService} from '../../../../../../services/innovation/innovation.service';
import {ClientProject} from '../../../../../../models/client-project';
import {UserService} from '../../../../../../services/user/user.service';
import {Response} from '../../../../../../models/response';
import {ClientProjectService} from '../../../../../../services/client-project/client-project.service';

@Component({
  selector: 'app-admin-project-settings',
  templateUrl: './admin-project-settings.component.html',
  styleUrls: ['./admin-project-settings.component.scss']
})

export class AdminProjectSettingsComponent implements OnInit {

  isLoading = true;

  innovation: Innovation = <Innovation>{};

  mission: Mission = <Mission>{};

  missionTypes: Array<string> = ['USER', 'CLIENT', 'DEMO', 'TEST'];

  operators: Array<User> = [];

  commercials: Array<User> = [];

  clientProject: ClientProject = <ClientProject>{};

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _rolesFrontService: RolesFrontService,
              private _missionService: MissionService,
              private _dashboardService: DashboardService,
              private _innovationService: InnovationService,
              private _userService: UserService,
              private _clientProjectService: ClientProjectService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this.isLoading = false;
      this._getOperators();
      this._getCommercials();

      this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
        this.innovation = innovation || <Innovation>{};

        console.log(this.innovation);

        if (!!this.innovation.mission) {
          this.mission = <Mission>this.innovation.mission;
        }

        if (!!this.innovation.clientProject) {
          this.clientProject = <ClientProject>this.innovation.clientProject;
        }

      });

    }
  }

  private _getCommercials() {
    this._userService.getCommercials().pipe(first()).subscribe((response: Response) => {
      this.commercials = response.result;
      }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Commercial Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  private _getOperators() {
    this._dashboardService.getOperators().pipe(first()).subscribe((response: Response) => {
      this.operators = response.result;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Operator Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project', 'settings'];
    return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
  }

  /***
   * this is to update the banner stats.
   */
  public onClickUpdateStats() {

  }

  public onMissionTypeChange(type: MissionType) {
    this.mission.type = type
    this._saveMission('The market test type has been updated.');
  }

  public onChangeMissionTeam(operator: User) {
    const _index = this.mission.team.findIndex((op: any) => op._id === operator['_id']);
    if (_index > -1) {
      this.mission.team = this.mission.team.slice(_index, 1);
    } else {
      this.mission.team.push(operator);
    }
    this._saveMission('The team members have been updated.');
  }

  private _saveMission(notifyMessage = 'The project has been updated.', type?: string) {
    if (this.mission._id) {
      this._missionService.save(this.mission._id, this.mission).pipe(first()).subscribe((mission) => {
        this._translateNotificationsService.success('Success', notifyMessage);
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Mission Error...', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });

    }
  }

  public onOperatorChange(operatorId: string) {
    const _index = this.operators.findIndex((op: any) => op._id === operatorId);
    this.innovation.operator = _index !== -1 ? this.operators[_index] : null;
    this._saveProject('The operator has been updated.')
  }

  private _saveProject(notifyMessage = 'The project has been updated.') {
    this._innovationService.save(this.innovation._id, this.innovation).pipe(first()).subscribe((inno: Innovation) => {
      this._innovationFrontService.setInnovation(inno);
      this._translateNotificationsService.success('Success' , notifyMessage);
      }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Project Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public onCommercialChange(commercialId: string) {
    const _index = this.commercials.findIndex((commercial: any) => commercial._id === commercialId);
    this.clientProject.commercial = _index !== -1 ? this.commercials[_index] : null;
    this._saveClientProject('The commercial has been updated.');
  }

  private _saveClientProject(notifyMessage = 'The project has been updated.') {
    this._clientProjectService.save(this.clientProject._id, this.clientProject).pipe(first()).subscribe((clientProject: ClientProject) => {
      this.clientProject = clientProject;
      this._translateNotificationsService.success('Success' , notifyMessage);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Client Project Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public isTeamMember(operatorId: string): boolean {
    const _index = this.mission.team && this.mission.team.findIndex((member: any) => member._id === operatorId);
    return _index > -1;
  }

  public name(value: User): string {
    return UserFrontService.fullName(value);
  }

  get statsConfig(): Array<StatsInterface> {
    return [
      {
        heading: 'Emails',
        content: [
          { subHeading: 'To send', value: '9433' },
          { subHeading: 'Delivered', value: '9361' },
          { subHeading: 'Open rate', value: '19%' },
          { subHeading: 'Click rate', value: '30%' }
          ]
      },
      {
        heading: 'Answers',
        content: [
          { subHeading: 'Questionnaire quality', value: '60%' },
          { subHeading: 'Validated answers', value: '52' },
          { subHeading: 'Answer rate', value: '0.8%' }
        ]
      }
      ];
  }

}

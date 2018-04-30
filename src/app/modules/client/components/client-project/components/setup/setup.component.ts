import { Component, Input, OnInit } from '@angular/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { InnovationSettings } from '../../../../../../models/innov-settings';

@Component({
  selector: 'app-client-setup-project',
  templateUrl: 'setup.component.html',
  styleUrls: ['setup.component.scss']
})
export class SetupProjectComponent implements OnInit {

  @Input() project: Innovation;

  private _currentTab: string;

  constructor(private innovationService: InnovationService,
              private notificationService: TranslateNotificationsService) {}

  ngOnInit() {
    this._currentTab = 'pitch';
  }

  public updateSettings(value: InnovationSettings): void {
    this.project.settings = value;
  }

  public saveProject(event: Event): void {
    event.preventDefault();
    this.innovationService
      .save(this.project._id, this.project)
      .first()
      .subscribe(data => {
        this.project = data;
        this.notificationService.error('ERROR.PROJECT.SUBMITTED', '');
      }, err => {
        this.notificationService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
  }

  get currentTab() { return this._currentTab; }
  set currentTab(value: string) { this._currentTab = value; }

}

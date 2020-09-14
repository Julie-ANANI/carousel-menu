import {Component} from '@angular/core';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';

@Component({
  templateUrl: './admin-project-targeting.component.html',
  styleUrls: ['./admin-project-targeting.component.scss']
})

export class AdminProjectTargetingComponent {

  constructor(private _rolesFrontService: RolesFrontService) { }

  get isEditable(): boolean {
    return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'settings', 'edit', 'targeting']);
  }

}

import { Component } from '@angular/core';
import { ProfessionalsService } from '../../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';

@Component({
  selector: 'app-admin-community-members',
  templateUrl: './admin-community-members.component.html',
  styleUrls: ['./admin-community-members.component.scss']
})

export class AdminCommunityMembersComponent {

  private _config: any = {
    fields: 'language firstName lastName company country jobTitle campaigns tags messages ambassador.industry',
    limit: '10',
    offset: '0',
    search: '{ "ambassador.is": true }',
    sort: '{ "created": -1 }'
  };

  private _searchResult: any;

  private _sidebarValue: SidebarInterface = {};

  constructor(private _professionalService: ProfessionalsService,
              private _translateNotificationsService: TranslateNotificationsService) { }


  public importAmbassadors(file: File) {
    this._professionalService.importAmbassadorsFromCSV(file).subscribe((res: any) => {
      const total = (res.regSuccess || []).length + (res.regErrors || []).length;
      this._translateNotificationsService.success('ERROR.SUCCESS', `${(res.regSuccess || []).length}/${total} ambassadors has been added.`);
      this._searchResult = res;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }


  public addAmbassador(event: Event) {
    event.preventDefault();
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.ADD_AMBASSADOR'
    }
  }


/*  public onSearchClick(event: Event) {
    event.preventDefault();
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      size: null,
      title: 'Smart search',
      type: 'professional'
    };
  }*/


/*  receiveResult(event: Event) {
    if(event['result'] && event['result'].length) {
      this._searchResult = event['result'];
    } else {
      this._searchResult = [];
    }
  }*/

  get searchResult(): any {
    return this._searchResult;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get config(): any {
    return this._config;
  }

}

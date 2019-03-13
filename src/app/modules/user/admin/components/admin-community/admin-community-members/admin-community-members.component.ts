import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SidebarInterface } from "../../../../../sidebar/interfaces/sidebar-interface";
import { ProfessionalsService } from '../../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-admin-community-members',
  templateUrl: './admin-community-members.component.html',
  styleUrls: ['./admin-community-members.component.scss']
})

export class AdminCommunityMembersComponent implements OnInit {

  private _config: any;

  private _sidebarValue: SidebarInterface = {};

  private _searchResult: any;

  @Output() forceParentReload = new EventEmitter <any>();

  constructor(private professionalService: ProfessionalsService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this._config = {
      fields: 'language firstName lastName company country jobTitle campaigns tags messages',
      limit: '10',
      offset: '0',
      search: '{"ambassador.is":true}',
      sort: '{"created":-1}'
    };
  }


  onClickImport(file: File) {
    this.professionalService.importAmbassadorsFromCSV(file).subscribe((res: any) => {
      const total = (res.regSuccess || []).length + (res.regErrors || []).length;
      this.translateNotificationsService.success('ERROR.SUCCESS', `${(res.regSuccess || []).length}/${total} ambassadors has been added`);
      this._searchResult = res;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  public onSearchClick(event: Event) {
    event.preventDefault();
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      size: null,
      title: 'Smart search',
      type: 'professional'
    };
  }

  onClickAdd() {
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      size: '726px',
      title: 'SIDEBAR.TITLE.ADD_AMBASSADOR',
      type: 'professional'
    };
  }


  receiveResult(event: Event) {
    if(event['result'] && event['result'].length) {
      this._searchResult = event['result'];
    } else {
      this._searchResult = [];
    }
  }

  get searchResult(): any {
    return this._searchResult;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get config() {
    return this._config;
  }

}

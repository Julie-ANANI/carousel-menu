import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MissionService } from '../../../../../services/mission/mission.service';
import { Table } from '../../../../table/models/table';
import {Config} from '../../../../../models/config';
import { Mission } from '../../../../../models/mission';


@Component({
  selector: 'app-admin-missions-list',
  templateUrl: './admin-missions-list.component.html',
  styleUrls: ['./admin-missions-list.component.scss']
})
export class AdminMissionsListComponent implements OnInit {

  private _tableInfos: Table;

  private _config: Config;

  public showModalAdd: boolean;
  public newMissionName: string;

  constructor(private _missionService: MissionService,
              private _translateService: TranslateService) {}

  ngOnInit(): void {
    this.build();
  }

  build (): void {
    this._config = {
      fields: '',
      limit: '10',
      offset: '0',
      search: '{}',
      sort: '{"created":-1}'
    };
    /*if (!!this.operatorId) {
      this._config.operator = this.operatorId;
    }*/
    this.loadMissions();
  }

  loadMissions(): void {
    this._missionService.getAll(this._config).subscribe((missions: any) => {
      this._tableInfos = {
        _selector: 'admin-dashboard-limit',
        _title: 'COMMON.MISSIONS',
        _content: missions.result,
        _total: missions._metadata.totalCount,
        _editIndex: 1,
        _isSearchable: true,
        _isPaginable: true,
        _isTitle: true,
        _columns: [
          {_attrs: ['name'], _name: 'COMMON.MISSIONS', _type: 'TEXT', _isSearchable: true, _isSortable: true},
          {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isSortable: true},
          {_attrs: ['updated'], _name: 'TABLE.HEADING.UPDATED', _type: 'DATE', _isSortable: true}
        ]
      };
    });
  }

  public showCreateModal(event: Event) {
    event.preventDefault();
    this.newMissionName = '';
    this.showModalAdd = true;
  }

  public onClickCreate(event: Event) {
    event.preventDefault();
    const mission = {name: this.newMissionName };
    this._missionService.create(mission).subscribe((savedMission: Mission) => {
        this._tableInfos._content.push(savedMission);
        this._tableInfos._total = this._tableInfos._total + 1;
        this.showModalAdd = false;
    });
  }

  public removeMission(event: Event, missionId: string) {
    event.preventDefault();
    this._missionService
      .remove(missionId)
      .subscribe((_: any) => {
        // this._missions.splice(this._getMissionIndex(missionId), 1);
      });
  }

  public editMission(event: Event) {
    event.preventDefault();
    console.log('edit');
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    this.loadMissions();
  }

  get tableInfos(): Table { return this._tableInfos; }

  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }

}

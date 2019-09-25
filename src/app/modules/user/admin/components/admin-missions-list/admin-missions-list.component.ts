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

  private _missions: Array<Mission> = [];

  public selectedMissionIdToBeDeleted: string;

  private _tableInfos: Table;

  private _total: number;

  private _config: Config;

  constructor(private _missionService: MissionService,
              private _translateService: TranslateService) {}

  ngOnInit(): void {
    this.build();
  }

  build (): void {
    this._missions = [];
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

      this._missions = missions.result;
      this._total = missions._metadata.totalCount;

      this._tableInfos = {
        _selector: 'admin-dashboard-limit',
        _title: 'COMMON.MISSIONS',
        _content: this._missions,
        _total: this._total,
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

  /**
   * Suppression et mise à jour de la vue
   */
  public removeMission(event: Event, missionId: string) {
    event.preventDefault();
    this._missionService
      .remove(missionId)
      .subscribe((_: any) => {
        // this._missions.splice(this._getMissionIndex(missionId), 1);
        this.selectedMissionIdToBeDeleted = null;
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

  get total () { return this._total; }

  get tableInfos(): Table { return this._tableInfos; }

  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }

}

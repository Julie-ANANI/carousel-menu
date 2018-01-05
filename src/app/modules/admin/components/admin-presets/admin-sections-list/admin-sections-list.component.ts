import { Component, OnInit } from '@angular/core';
import { PresetService } from '../../../../../services/preset/preset.service';

@Component({
  selector: 'app-admin-sections-list',
  templateUrl: './admin-sections-list.component.html',
  styleUrls: ['./admin-sections-list.component.scss']
})
export class AdminSectionsListComponent implements OnInit {

  private _sections: [any];
  public selectedSectionIdToBeDeleted: any = null;
  private _total: number;
  private _config = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private _presetService: PresetService) {}

  ngOnInit(): void {
    this.loadSections(this._config);
  }

  loadSections(config: any): void {
    this._config = config;
    this._presetService.getAllSections(this._config).subscribe(sections => {
      this._sections = sections.result;
      this._total = sections._metadata.totalCount;
    });
  }

  private _getSectionIndex(sectionId: string): number {
    for (const section of this._sections) {
      if (sectionId === section._id) {
        return this._sections.indexOf(section);
      }
    }
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removePreset(sectionId) {
    this._presetService
      .removeSection(sectionId)
      .subscribe(sectionRemoved => {
        this._sections.splice(this._getSectionIndex(sectionId), 1);
        this.selectedSectionIdToBeDeleted = null;
      });
  }

  set config(value: any) {
    this._config = value;
  }

  get config(): any {
    return this._config;
  }

  get total () {
    return this._total;
  }

  get sections () {
    return this._sections;
  }
}

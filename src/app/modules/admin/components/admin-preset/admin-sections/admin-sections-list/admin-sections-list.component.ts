import { Component, OnInit } from '@angular/core';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { Router } from '@angular/router';
import { Section } from '../../../../../../models/section';

@Component({
  templateUrl: './admin-sections-list.component.html',
  styleUrls: ['./admin-sections-list.component.scss']
})
export class AdminSectionsListComponent implements OnInit {

  private _sections: Array<Section>;
  public selectedSectionIdToBeDeleted: string = null;
  public selectedSectionToBeCloned: Section = null;
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

  constructor(private _presetService: PresetService,
              private _router: Router) {}

  ngOnInit(): void {
    this.loadSections(this._config);
  }

  loadSections(config: any): void {
    this._config = config;
    this._presetService.getAllSections(this._config)
      .first()
      .subscribe(sections => {
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
  public removeSection(event: Event, sectionId: string) {
    event.preventDefault();
    this._presetService
      .removeSection(sectionId)
      .first()
      .subscribe(_ => {
        this._sections.splice(this._getSectionIndex(sectionId), 1);
        this.selectedSectionIdToBeDeleted = null;
      });
  }

  public cloneSection(event: Event, clonedSection: Section) {
    event.preventDefault();
    delete clonedSection._id;
    this._presetService.createSection(clonedSection)
      .first()
      .subscribe(section => {
        this._router.navigate(['/admin/sections/' + section._id])
      });
  }

  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get total () { return this._total; }
  get sections () { return this._sections; }
}

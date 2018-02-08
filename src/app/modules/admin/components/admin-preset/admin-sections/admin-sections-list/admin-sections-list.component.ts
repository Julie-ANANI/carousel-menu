import { Component, OnInit, OnDestroy } from '@angular/core';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { Section } from '../../../../../../models/section';

@Component({
  templateUrl: './admin-sections-list.component.html',
  styleUrls: ['./admin-sections-list.component.scss']
})
export class AdminSectionsListComponent implements OnInit, OnDestroy {

  private _subscriptions: ISubscription;
  private _sections: Array<Section>;
  public selectedSectionIdToBeDeleted: string = null;
  public selectedSectionToBeCloned: string = null;
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

  ngOnDestroy() {
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
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
  public removeSection(sectionId: string) {
    this._presetService
      .removeSection(sectionId)
      .subscribe(sectionRemoved => {
        this._sections.splice(this._getSectionIndex(sectionId), 1);
        this.selectedSectionIdToBeDeleted = null;
      });
  }

  public cloneSection(clonedSection: Section) {
    delete clonedSection._id;
    this._subscriptions = this._presetService.createSection(clonedSection).subscribe(section => {
      this._router.navigate(['/admin/sections/' + section._id])
    });
  }

  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get total () { return this._total; }
  get sections () { return this._sections; }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { Campaign } from '../../../../models/campaign';
import { Professional } from '../../../../models/professional';

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-shared-pros-list-old',
  templateUrl: './shared-pros-list-old.component.html',
  styleUrls: ['./shared-pros-list-old.component.scss']
})
export class SharedProsListOldComponent {

  private _config: any;
  public smartSelect: any = null;
  public editUser: {[propString: string]: boolean} = {};

  @Input() public requestId: string;
  @Input() public campaign: Campaign;
  @Input() set config(value: any) {
    this.loadPros(value);
  }
  @Output() selectedProsChange = new EventEmitter <any>();

  private _total = 0;
  private _pros: Array <SelectedProfessional>;

  constructor(private _searchService: SearchService) { }

  loadPros(config: any): void {
    this._config = config;
    this._searchService.getPros(this._config, this.requestId).first().subscribe(pros => {
      this._pros = pros.persons;
      this._total = pros._metadata.totalCount;
    });
  }

  selectPro(pro: SelectedProfessional): void {
    pro.isSelected = !pro.isSelected;
    const prosSelected = this._pros.filter(p => p.isSelected);
    this.selectedProsChange.emit({
      total: this.nbSelected,
      pros: prosSelected
    });
  }

  updateSelection(event: any) {
    this.smartSelect = event;
    const config = this._config;
    config.offset = this.smartSelect.offset;
    config.limit = this.smartSelect.limit;
    this.selectedProsChange.emit({
      total: this.nbSelected,
      pros: 'all',
      query: config
    });
  }

  get nbSelected(): number {
    if (this.smartSelect) {
      return (this.smartSelect.limit + this.smartSelect.offset) > this.total ?
        this.total - this.smartSelect.offset :
        this.smartSelect.limit;
    }
    return this._pros ? this._pros.filter(p => p.isSelected).length : 0;
  }
  get total() { return this._total; }
  get pros() { return this._pros; }
  get config() { return this._config; }
}

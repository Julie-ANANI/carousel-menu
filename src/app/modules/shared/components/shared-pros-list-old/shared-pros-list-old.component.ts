import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { Campaign } from '../../../../models/campaign';
import { Professional } from '../../../../models/professional';
import {PaginationInterface} from '../../../utility-components/paginations/interfaces/pagination';
import { first } from 'rxjs/operators';

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
  private _keywordsModal: boolean = false;
  private _paginationConfig: PaginationInterface = {};
  public smartSelect: any = null;
  public editUser: {[propString: string]: boolean} = {};

  @Input() public requestId: string;
  @Input() public campaign: Campaign;
  @Input() set config(value: any) {
    this.loadPaginationConfig(value);
    this.loadPros(value);
  }
  @Output() selectedProsChange = new EventEmitter <any>();

  private _total = 0;
  private _pros: Array <SelectedProfessional>;
  private _proKeywords: Array<string> = null;

  constructor(private _searchService: SearchService) { }

  loadPaginationConfig(config: any) {
    this._paginationConfig = {
      limit: config.limit || 10,
      offset: config.offset || 0
    };
  }

  loadPros(config: any): void {
    this._config = config;
    this._searchService.getPros(this._config, this.requestId).pipe(first()).subscribe((pros: any) => {
      this._pros = pros.persons;
      this._total = pros._metadata.totalCount;
    });
  }

  /***
   * This function is call when the user change the paginations config
   * It affects the values
   * @param value
   */
  changePaginationConfig(value: any) {
    this._paginationConfig = value;
    this._config.limit = value.limit
    this._config.offset = value.offset;
    window.scroll(0, 0);
    this.loadPros(this._config);
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

  showKeywords(personId: string) {
    this._searchService.getProKeywords(personId).subscribe((keywords: Array<string>) => {
      this._proKeywords = keywords;
      this._keywordsModal = true;
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
  get proKeywords(): Array<string> { return this._proKeywords; }
  get keywordsModal(): boolean { return this._keywordsModal; }
  set keywordsModal(value: boolean) { this._keywordsModal = value; }
  get config() { return this._config; }
  get paginationConfig(): PaginationInterface { return this._paginationConfig; }
}

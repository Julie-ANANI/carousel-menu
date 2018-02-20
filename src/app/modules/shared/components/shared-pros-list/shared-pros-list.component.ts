import { Component, Input } from '@angular/core';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { SearchService } from '../../../../services/search/search.service';
import { Professional } from '../../../../models/professional';

@Component({
  selector: 'app-shared-pros-list',
  templateUrl: './shared-pros-list.component.html',
  styleUrls: ['./shared-pros-list.component.scss']
})
export class SharedProsListComponent {
  
  private _config: any;
  public smartSelect: any = null;
  
  @Input() public requestId: string;
  @Input() set config(value: any) {
    this.loadPros(value);
  }

  private _total: number = 0;
  private _pros: Array <Professional>;

  constructor(private _professionalService: ProfessionalsService,
              private _searchService: SearchService) { }
  
  loadPros(config: any): void {
    this._config = config;
    if (this.requestId) {
      this._searchService.getPros(this._config, this.requestId).first().subscribe(pros => {
        this._pros = pros.persons;
        this._total = pros._metadata.totalCount;
      });
    } else {
      this._professionalService.getAll(this._config).first().subscribe(pros => {
        this._pros = pros.result;
        this._total = pros._metadata.totalCount;
      });
    }
  }

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }

  updateSelection(event: any) {
    this.smartSelect = event;
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

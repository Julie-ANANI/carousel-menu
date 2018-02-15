import { Component, Input } from '@angular/core';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { Professional } from '../../../../models/professional';

@Component({
  selector: 'app-shared-pros-list',
  templateUrl: './shared-pros-list.component.html',
  styleUrls: ['./shared-pros-list.component.scss']
})
export class SharedProsListComponent {
  
  private _config: any;

  @Input() set config(value: any) {
    this.loadPros(value);
  }

  private _total: number = 0;
  private _pros: Array <Professional>;

  constructor(private _professionalService: ProfessionalsService) { }
  
  loadPros(config: any): void {
    this._config = config;
    this._professionalService.getAll(this.config).first().subscribe(pros => {
      this._pros = pros.result;
      this._total = pros._metadata.totalCount;
    });
  }

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }
  get total() { return this._total; }
  get pros() { return this._pros; }
  get config() { return this._config; }
}

import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import 'rxjs/add/operator/filter';

type Template = 'NEW_BATCH' | 'EDIT_BATCH' | '';

@Component({
  selector: 'app-sidebar-scraping',
  templateUrl: './sidebar-scraping.component.html',
  styleUrls: ['./sidebar-scraping.component.scss']
})

export class SidebarScrapingComponent implements OnChanges {

  @Input() content: any = <any>{};

  @Input() sidebarState = 'inactive';

  @Input() templateType: Template = '';

  @Input() params: any = null;

  @Output() paramsChange = new EventEmitter<any>();

  private _hideInput = false;

  constructor() { }

  ngOnChanges(): void {
  }

  public saveParams(event: any) {
    console.log('UPDATED');
    event.preventDefault();
    this.paramsChange.emit(this.params);
  }

  public onKeyboardPress(event: Event) {
    event.preventDefault();
    this.paramsChange.emit(this.params);
  }

  public showField(index: number): boolean {
    return (index < this.params['numberFields']);
  }

  public showSpecificData(index: number): boolean {
    return (index < this.params['numberSpecificData']);
  }

  get hideInput(): boolean {
    return this._hideInput;
  }

}

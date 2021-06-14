import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminProductTrackingComponent } from '../admin-product-tracking.component';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { TrackingService } from '../../../../../../../services/tracking/tracking.service';

@Component({
  selector: 'app-product-date-selector',
  templateUrl: './admin-date-selector.component.html',
  styleUrls: ['./admin-date-selector.component.scss']
})

export class AdminDateSelectorComponent extends AdminProductTrackingComponent implements OnInit {
  @Input() set monthSelected(month: number) {
    this._monthSelected = month;
  }

  @Input() set yearSelected(year: number) {
    this._yearSelected = year;
  }

  @Output() monthSelectedChange: EventEmitter<number> = new EventEmitter<number>();

  @Output() yearSelectedChange: EventEmitter<number> = new EventEmitter<number>();

  private _monthSelected: number;

  private _yearSelected: number;

  constructor(protected _rolesFrontService: RolesFrontService,
              protected _trackingService: TrackingService) {
    super(_rolesFrontService, _trackingService);

  }

  ngOnInit(): void {
  }


  get monthSelected(): number {
    return this._monthSelected;
  }


  get yearSelected(): number {
    return this._yearSelected;
  }

  sendMonthSelection() {
    this.monthSelectedChange.emit(this._monthSelected);
  }

  sendYearSelection() {
    this.yearSelectedChange.emit(this._yearSelected);
  }
}

import {Component, EventEmitter, Input, Output} from '@angular/core';
import { StatsInterface } from "../../../../../models/stats";

@Component({
  selector: 'app-admin-stats-banner',
  templateUrl: './admin-stats-banner.component.html',
  styleUrls: ['./admin-stats-banner.component.scss']
})

export class AdminStatsBannerComponent {

  @Input() config: Array<StatsInterface> = [];

  @Input() updateBtn = false;

  @Output() updateStats: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  public onUpdateStats(event: Event) {
    event.preventDefault();
    this.updateStats.emit(true);
  }

  public stringToNumber(string: string) {
    return parseFloat(string.replace('%', ''));
  }
}

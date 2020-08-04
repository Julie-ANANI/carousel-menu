import {Component, EventEmitter, Input, Output} from '@angular/core';

export interface StatsInterface {
  heading: string;
  content: Array<{
    subHeading: string;
    value: string;
  }>;
}

@Component({
  selector: 'app-admin-campaign-stats',
  templateUrl: './admin-campaign-stats.component.html',
  styleUrls: ['./admin-campaign-stats.component.scss']
})

export class AdminCampaignStatsComponent {

  @Input() config: Array<StatsInterface> = [];

  @Input() updateBtn = false;

  @Output() updateStats: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  public onUpdateStats(event: Event) {
    event.preventDefault();
    this.updateStats.emit(true);
  }

}

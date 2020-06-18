import {Component, EventEmitter, Input, Output} from '@angular/core';

/***
 * this is to show the banner on the top. In this, you can write any message or
 * add any html tag.
 *
 * Input:
 * 1. background: pass the value to change the background of the banner.
 * 2. showBanner: true to show banner
 * 3. position: default is absolute means it does not affect the space of the
 * parent container. You can also use other position css value.
 *
 * Implementation:
 * <app-utility-banner [(showBanner)]="value" [background]="'#EA5858'">
 *   <p>this is the message</p>
 * <app-utility-banner>
 *
 * Example:
 * app-admin-storyboard component.
 */

@Component({
  selector: 'app-utility-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

export class BannerComponent {

  @Input() background = '#FFB300';

  @Input() position = 'absolute';

  @Input() set showBanner(value: boolean) {
    this._showBanner = value;
  }

  @Output() showBannerChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _showBanner = false;

  constructor() { }

  public onCloseBanner(event: Event) {
    event.preventDefault();
    this.showBannerChange.emit(false);
  }

  get showBanner(): boolean {
    return this._showBanner;
  }

}

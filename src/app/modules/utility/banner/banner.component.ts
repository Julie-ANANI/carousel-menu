import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  template: `
    <ng-container *ngIf="!!showBanner">
      <div
        [ngClass]="background"
        [ngStyle]="{'position': position}"
        class="banner animate-fade is-7"
        id="banner">
        <div class="m-right-15">
          <ng-content></ng-content>
        </div>
        <button
          (click)="onCloseBanner($event)"
          *ngIf="showCloseBtn"
          class="close has-background is-xs"
          id="banner-btn-close">
        </button>
      </div>
    </ng-container>
  `,
  styles: ['#banner {top: 0; width: 100%;padding: 8px 12px;z-index: 1;flex-wrap: wrap;font-weight: 600}']
})

export class BannerComponent {

  /**
   * provide the class
   * like bg-primary | bg-success
   */
  @Input() background = 'bg-primary text-white';

  @Input() position = 'absolute';

  @Input() showCloseBtn = true;

  @Input() set showBanner(value: boolean) {
    this._showBanner = value;
  }

  @Output() showBannerChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _showBanner = false;

  constructor() {
  }

  public onCloseBanner(event: Event) {
    event.preventDefault();
    this.showBannerChange.emit(false);
  }

  get showBanner(): boolean {
    return this._showBanner;
  }

}

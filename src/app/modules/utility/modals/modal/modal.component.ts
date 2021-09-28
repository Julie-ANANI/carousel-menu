import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/***
 * example: client projects-list component.
 * page: https://umicli.umi.us/user/projects - Delete button
 */

@Component({
  selector: 'app-utility-modal',
  templateUrl: './modal.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ModalComponent implements OnInit, OnDestroy {

  /***
   * this is to increase the width of the modal container, if you provide the value it will
   * make the modal of that width. By default the width of the modal is 640px
   */
  @Input() maxWidth = '640px';

  /***
   * this is to add the title to the modal. If you provide this value
   * it will add header class to the modal with the title and the close button.
   */
  @Input() title = '';

  /***
   * make it true to show the title header background in the white color.
   */
  @Input() isHeaderBgWhite = false;

  /***
   * make it true to show the close button on the top right corner of the modal.
   */
  @Input() enableCloseButton = false;

  /***
   * make it true to show the bottom border on the title header.
   */
  @Input() headerBottomBorder = false;

  /***
   * this is to make modal active and inactive. This variable should have getter and setter.
   */
  @Input() showModal = false;

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _element: any = null;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _elementRef: ElementRef) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this._element = this._elementRef.nativeElement;
      document.body.appendChild(this._element);
    }
  }

  public toggleState(event: Event) {
    const _classesToCheck: Array<string> = ['modal-overlay', 'modal-close is-sm', 'button modal-cancel', 'close'];
    const { className } = (event.target as any);
    if (_classesToCheck.indexOf(className) !== -1) {
      this.showModalChange.emit(false);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && !!this._element && !!document) {
      document.body.removeChild(this._element);
    }
  }

}

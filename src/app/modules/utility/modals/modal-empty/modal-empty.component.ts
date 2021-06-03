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
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/***
 * example: admin-project-preparation component
 * page: https://umicli.umi.us/user/admin/projects/project/5f9998efc2bb0653a1b26f3b/preparation/description -
 * Add language button
 */

@Component({
  selector: 'app-utility-modal-empty',
  templateUrl: './modal-empty.component.html'
})

export class ModalEmptyComponent implements OnInit, OnDestroy {

  /***
   * this is to increase the width of the modal container, if you provide the value it will
   * make the modal of that width. By default the width of the modal is 640px
   */
  @Input() maxWidth = '640px';

  /***
   * this is to make modal active and inactive. This variable should have getter and setter.
   */
  @Input() showModal = false;

  /**
   * make it false to show close btn in white color.
   */
  @Input() isCloseBtnDark = true;

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _element: any = null;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private elementRef: ElementRef) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this._element = this.elementRef.nativeElement;
      document.body.appendChild(this._element);
    }
  }

  public toggleState(event: Event) {
    const _classesToCheck: Array<string> = ['modal-overlay', 'button modal-cancel', 'close'];
    const { className } = (event.target as any);
    if (_classesToCheck.indexOf(className) !== -1) {
      this.showModalChange.emit(false);
    }
  }

  public onClickCross(event: Event) {
    event.preventDefault();
    this.showModalChange.emit(false);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && !!this._element) {
      document.body.removeChild(this._element);
    }
  }

}

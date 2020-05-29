import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output, PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-utility-modal-empty',
  templateUrl: './modal-empty.component.html',
  styleUrls: ['./modal-empty.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ModalEmptyComponent implements OnInit, OnDestroy {

  @Input() set showModal(value: boolean) {
    this._show = value;
  }

  @Input() maxWidth = '640px';

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _show = false;

  private readonly _element: any;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private elementRef: ElementRef) {
    this._element = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    if (isPlatformBrowser(this.platformId)) {
      document.body.appendChild(this._element);
    }
  }

  public toggleState(event: Event) {
    const classesToCheck: Array<string> = ['modal-overlay', 'button modal-cancel', 'close'];
    const { className } = (event.target as any);

    if (classesToCheck.indexOf(className) !== -1) {
      this.showModalChange.emit(false);
    }

  }

  public onClickCross(event: Event) {
    event.preventDefault();
    this.showModalChange.emit(false);
  }

  get showModal() {
    return this._show;
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.removeChild(this._element);
    }
  }

}

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
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ModalComponent implements OnInit, OnDestroy {

  @Input() set showModal(value: boolean) {
    this._show = value;
  }

  @Input() set maxWidth(value: string) {
    this._maxWidth = value;
  }

  @Input() set title(value: string) {
    this._title = value;
  }

  @Input() set enableCloseButton(value: boolean) {
    this._enableCloseButton = value;
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _show: boolean = false;

  private _maxWidth: string = '640px';

  private _title: string = '';

  private _enableCloseButton: boolean = false;

  private readonly _element: any;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _elementRef: ElementRef) {
    this._element = this._elementRef.nativeElement;
  }

  ngOnInit(): void {
    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    if (isPlatformBrowser(this.platformId)) {
      document.body.appendChild(this._element);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.removeChild(this._element);
    }
  }

  public toggleState(event: Event) {
    const classesToCheck: Array<string> = ['modal-overlay', 'modal-close is-sm', 'button modal-cancel', 'close'];
    const { className } = (event.target as any);

    if (classesToCheck.indexOf(className) !== -1) {
      this.showModalChange.emit(false);
    }

  }

  get showModal() {
    return this._show;
  }

  get maxWidth(): string {
    return this._maxWidth;
  }

  get title(): string {
    return this._title;
  }

  get enableCloseButton(): boolean {
    return this._enableCloseButton;
  }

}

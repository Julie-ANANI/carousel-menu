import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, OnDestroy, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
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

  private readonly _element: any;

  private _show: boolean = false;

  private _maxWidth: string = '640px';

  private _title: string = '';

  private _enableCloseButton: boolean = false;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _elementRef: ElementRef) {

    this._element = this._elementRef.nativeElement;

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.appendChild(this._element);
    }
  }

  public toggleState(event: Event) {
    const classesToCheck: Array<string> = ['modal-overlay', 'modal-close is-sm', 'button modal-cancel', 'close'];
    const { className } = (event.target as any);

    if (classesToCheck.indexOf(className) !== -1) {
      this.showModalChange.emit(false);
    }

  }

  get element(): any {
    return this._element;
  }

  get showModal() {
    return this._show;
  }

  get show(): boolean {
    return this._show;
  }

  set show(value: boolean) {
    this._show = value;
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

  ngOnDestroy(): void {
    this._element.remove();
  }

}

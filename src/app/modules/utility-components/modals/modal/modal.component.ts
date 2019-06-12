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

  @Input() set modalPosition(value: string) {
    this._position = value;
  }

  @Input() set widthMax(value: string) {
    this._maxWidth = value;
  }

  @Input() set heightMax(value: string) {
    this._maxHeight = value;
  }

  @Input() set modalTitle(value: string) {
    this._title = value;
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly _element: any;

  private _show: boolean;

  private _maxWidth: string;

  private _maxHeight: string;

  private _title: string;

  private _position = '';

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _elementRef: ElementRef) {

    this._element = this._elementRef.nativeElement;

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.appendChild(this._element);
    }
  }


  toggleState(event: Event) {
    const { className } = (event.target as any);
    if (className === 'modal-overlay' || className === 'btn btn-close' || className === 'btn btn-sm btn-cancel' || className === 'btn btn-cancel' ) {
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

  get maxHeight(): string {
    return this._maxHeight;
  }

  get title(): string {
    return this._title;
  }

  get position(): string {
    return this._position;
  }

  ngOnDestroy(): void {
    this._element.remove();
  }

}

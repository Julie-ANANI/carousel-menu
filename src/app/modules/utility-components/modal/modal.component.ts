import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, OnDestroy, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit, OnDestroy {

  @Input() set showModal(value: boolean) {
    this.show = value;
  }

  @Input() set widthMax(value: string) {
    this._maxWidth = value;
  }

  @Input() set modalTitle(value: string) {
    this._title = value;
  }

  @Input() set actionButtonTitle(value: string) {
    this._buttonAction = value;
  }

  @Input() set disabledActionButton(value: string) {
    this._disabledButton = value;
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() performAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  private element: any;

  private show: boolean;

  private _maxWidth: string;

  private _title: string;

  private _buttonAction: string;

  private _disabledButton: string;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object, private el: ElementRef) {
    this.element = this.el.nativeElement;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // move element to bottom of page (just before </body>) so it can be displayed above everything else
      document.body.appendChild(this.element);
    }
  }


  toggleState(event: Event) {
    if (event.target['className'] === 'modal-overlay' || event.target['id'] === 'button-close' || event.target['id'] === 'btn-cancel') {
      this.showModalChange.emit(false);
    }
  }


  onClickConfirm(event: Event) {
    event.preventDefault();
    this.performAction.emit(true);
    this.showModalChange.emit(false);
  }

  get showModal() {
    return this.show;
  }

  get maxWidth(): string {
    return this._maxWidth;
  }

  get title(): string {
    return this._title;
  }

  get buttonAction(): string {
    return this._buttonAction;
  }

  get disabledButton(): string {
    return this._disabledButton;
  }

  ngOnDestroy(): void {
    this.element.remove();
  }

}

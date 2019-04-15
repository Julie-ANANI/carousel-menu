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

  @Input() set modalPosition(value: string) {
    this._position = value;
  }

  @Input() set widthMax(value: string) {
    this._maxWidth = value;
  }

  @Input() set modalTitle(value: string) {
    this._title = value;
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private element: any;

  private show: boolean;

  private _maxWidth: string;

  private _title: string;

  private _position = '';

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
    if (event.target['className'] === 'modal-overlay' || event.target['className'] === 'btn btn-close' || event.target['className'] === 'btn btn-sm btn-cancel'
      || event.target['className'] === 'btn btn-cancel' ) {
      this.showModalChange.emit(false);
    }
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

  get position(): string {
    return this._position;
  }

  ngOnDestroy(): void {
    this.element.remove();
  }

}

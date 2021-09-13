import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, OnDestroy, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-utility-modal-media',
  templateUrl: './modal-media.component.html',
  styleUrls: ['./modal-media.component.scss']
})

export class ModalMediaComponent implements OnInit, OnDestroy {

  @Input() set showModal(value: boolean) {
    this.show = value;
  }

  @Input() set mediaSrc(value: string) {
    this._src = value;
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _element: any = null;

  private show: boolean;

  private _src: string;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _elementRef: ElementRef) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this._element = this._elementRef.nativeElement;
      document.body.appendChild(this._element);
    }
  }


  toggleState(event: Event) {
    const { className } = (event.target as any);
    if (className === 'modal-overlay' || className === 'btn btn-close' || className === 'modal-container' ) {
      this.showModalChange.emit(false);
    }
  }

  get showModal() {
    return this.show;
  }

  get src(): string {
    return this._src;
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && !!this._element) {
      document.body.removeChild(this._element);
    }
  }

}

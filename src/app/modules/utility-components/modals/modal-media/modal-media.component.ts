import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, OnDestroy, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-modal-media',
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

  private element: any;

  private show: boolean;

  private _src: string;

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
    if (event.target['className'] === 'modal-overlay' || event.target['className'] === 'btn btn-close' || event.target['className'] === 'modal-container' ) {
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
    this.element.remove();
  }

}

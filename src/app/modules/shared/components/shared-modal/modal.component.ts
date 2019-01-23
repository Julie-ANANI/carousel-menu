import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, OnDestroy, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})

export class ModalComponent implements OnInit, OnDestroy {

  private element: any;
  private show: boolean;

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() set showModal(value: boolean) {
    this.show = value;
  }

  constructor(@Inject(PLATFORM_ID) protected platformId: Object, private el: ElementRef) {
    this.element = this.el.nativeElement;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // move element to bottom of page (just before </body>) so it can be displayed above everything else
      document.body.appendChild(this.element);
      // close modal on background click
      this.element.addEventListener('click', (e: any) => {
        if (e.target.className === 'app-modal') {
          this.showModalChange.emit(false);
        }
      });
    }
  }

  get showModal() {
    return this.show;
  }

  ngOnDestroy(): void {
    this.element.remove();
  }

}

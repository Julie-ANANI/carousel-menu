import { Component, ElementRef, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})

export class ModalComponent implements OnInit, OnDestroy {

  private element: any;

  @Output() close: EventEmitter<null> = new EventEmitter();

  constructor(private el: ElementRef) {
    this.element = this.el.nativeElement;
  }

  ngOnInit(): void {

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', (e: any) => {
      if (e.target.className === 'app-modal') {
        this.close.emit();
      }
    });

  }

  ngOnDestroy(): void {
    this.element.remove();
  }

}

import {Directive, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';

/***
 * to make the textarea height increase and decrease
 * based on the text and scroll height.
 */

@Directive({
  selector: '[appTextareaAutoResize]'
})
export class TextareaAutoResizeDirective implements OnInit, OnDestroy {

  private readonly element: ElementRef;

  private clearTimeout: ReturnType<typeof setTimeout>;

  constructor(private _elementRef: ElementRef) {
    this.element = this._elementRef;
  }

  ngOnInit(): void {
    if (this.element && this.element.nativeElement.scrollHeight) {
      this.clearTimeout = setTimeout(() => this._resize());
    }
  }

  @HostListener(':input')
  onInput() {
    this._resize();
  }

  private _resize() {
    this.element.nativeElement.style.height = 'auto';
    this.element.nativeElement.style.height = (this.element.nativeElement.scrollHeight + 2) + 'px';
  }

  ngOnDestroy(): void {
    clearTimeout(this.clearTimeout);
  }

}

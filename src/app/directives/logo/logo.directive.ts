import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { WhitemarkService } from '../../services/whitemark/whitemark.service';

@Directive({
  selector: '[appLogo]'
})
export class LogoDirective implements AfterViewInit {
  @Input() public logoMaxWidth: number;
  @Input() public logoMaxHeight: number;
  private _logo: any;

  constructor(private _el: ElementRef,
              private _whitemarkService: WhitemarkService) { }

  ngAfterViewInit() {
    this._logo = this._whitemarkService.getLogo();
    this._resizeToFitIdealSize();
    this._el.nativeElement.style.display = 'inline-block';
    this._el.nativeElement.style.width = this._logo.width + 'px';
    this._el.nativeElement.style.height = this._logo.height + 'px';
    this._el.nativeElement.style.backgroundImage = 'url(' + this._logo.url + ')';
    this._el.nativeElement.style.backgroundSize = '100% 100%';
  }

  private _resizeToFitIdealSize() {
    // Si le logo est trop large, on le rétrécit
    if (this._logo.width > this.logoMaxWidth) {
      const percentWidthDeleted = (this._logo.width - this.logoMaxWidth) * 100 / this._logo.width;
      this._logo.width = this.logoMaxWidth;
      this._logo.height = this._logo.height - (this._logo.height * percentWidthDeleted / 100);
    }

    // Si le logo est trop haut, on le rétrécit
    if (this._logo.height > this.logoMaxHeight) {
      const percentHeightDeleted = (this._logo.height - this.logoMaxHeight) * 100 / this._logo.height;
      this._logo.height = this.logoMaxHeight;
      this._logo.width = this._logo.width - (this._logo.width * percentHeightDeleted / 100);
    }
  }
}

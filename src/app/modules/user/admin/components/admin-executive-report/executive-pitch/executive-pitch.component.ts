import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScrapeHTMLTags } from '../../../../../../pipe/pipes/ScrapeHTMLTags';
import { CommonService } from '../../../../../../services/common/common.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'executive-pitch',
  templateUrl: './executive-pitch.component.html',
  styleUrls: ['./executive-pitch.component.scss']
})

export class ExecutivePitchComponent {

  @Input() set pitch(value: string) {
    this._pitch = new ScrapeHTMLTags().transform(value) || '';
    this.textColor();
  }

  @Output() pitchChange: EventEmitter<string> = new EventEmitter<string>();

  private _pitch = '';

  private _pitchColor = '';

  constructor(private _translateService: TranslateService) { }

  public emitChanges() {
    this.pitchChange.emit(this._pitch);
  }

  public textColor() {
    this._pitchColor = CommonService.getLimitColor(this._pitch.length, 216);
  }

  public onClickSnippet(event: Event) {
    event.preventDefault();
    this._translateService.get('ADMIN_EXECUTIVE_REPORT.SNIPPET.PITCH').subscribe((text) => {
      this._pitch = text;
      this.textColor();
      this.emitChanges();
    });
  }

  get pitch(): string {
    return this._pitch;
  }

  get pitchColor(): string {
    return this._pitchColor;
  }

}

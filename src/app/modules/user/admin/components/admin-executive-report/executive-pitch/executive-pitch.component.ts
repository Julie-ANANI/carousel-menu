import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ScrapeHTMLTags } from '../../../../../../pipe/pipes/ScrapeHTMLTags';
import { CommonService } from '../../../../../../services/common/common.service';
import { SnippetService } from '../../../../../../services/snippet/snippet.service';
import { ExecutiveReportFrontService } from '../../../../../../services/executive-report/executive-report-front.service';

@Component({
  selector: 'app-admin-executive-pitch',
  templateUrl: './executive-pitch.component.html',
  styleUrls: ['./executive-pitch.component.scss']
})

export class ExecutivePitchComponent {

  @Input() isEditable = false;

  @Input() lang = 'en';

  @Input() set pitch(value: string) {
    this._pitch = new ScrapeHTMLTags().transform(value);
    this.textColor();
  }

  @Output() pitchChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('pitchText', { read: ElementRef }) pitchText: ElementRef;

  private _pitch = '';

  private _pitchColor = '';

  constructor(private _executiveReportFrontService: ExecutiveReportFrontService) { }

  public emitChanges() {
    if (this.isEditable) {
      this.pitchChange.emit(this._pitch);
    }
  }

  public update(value: string) {
    this._pitch = value;
  }

  public textColor() {
    this._pitchColor = CommonService.getLimitColor(this._pitch, 216);
  }

  public onClickPlay(event: Event) {
    event.preventDefault();
    this._executiveReportFrontService.audio(this._pitch, this.lang);
  }

  public onClickSnippet(event: Event) {
    event.preventDefault();
    this._pitch = SnippetService.storyboard('PITCH', this.lang);
    this.pitchText.nativeElement.value = this._pitch;
    this.textColor();
    this.emitChanges();
  }

  get pitch(): string {
    return this._pitch;
  }

  get pitchColor(): string {
    return this._pitchColor;
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { InnovCard } from '../../../../../../models/innov-card';
import { DomSanitizer } from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-innovation-preview',
  templateUrl: './innovation-preview.component.html',
  styleUrls: ['./innovation-preview.component.scss']
})

export class InnovationPreviewComponent implements OnInit {

  @Input() innovation: InnovCard;

  @Input() set batchInfo(data: any) {
    if (data) {
      if (data.status == 0) {
        this._date = new Date(data.firstMail);
      }
      if (data.status == 1) {
        this._date = new Date(data.secondMail);
      }
      if (data.status == 2) {
        this._date = new Date(data.thirdMail);
      }
    }
  };

  private _date: Date;

  constructor(private domSanitizer1: DomSanitizer,
              private _translateService: TranslateService) {
  }

  ngOnInit() {
  }

  get domSanitizer() {
    return this.domSanitizer1;
  }

  get getDate() {
    return this._date;
  }
  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y HH:mm' : 'y/MM/dd HH:mm'; }
}

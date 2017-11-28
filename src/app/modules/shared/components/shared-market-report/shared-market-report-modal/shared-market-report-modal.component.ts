/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from './../../../../../services/innovation/innovation.service';

@Component({
  selector: 'market-report-modal',
  templateUrl: 'shared-market-report-modal.component.html',
  styleUrls: ['shared-market-report-modal.component.scss']
})

export class SharedMarketReportModalComponent implements OnInit {

  private _advantages: string[];
  private _modalAnswer: any;
  private _selectLangInput = 'en';

  @Input() set modalAnswer(value: any) {
    this._modalAnswer = value;
  }
  @Input() public innoid: string;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(private _translateService: TranslateService,
              private _innovationService: InnovationService) { }

  ngOnInit() {
    this._selectLangInput = this._translateService.currentLang || this._translateService.getBrowserLang() || 'fr';
    this._innovationService.getInnovationCardByLanguage(this.innoid, this._selectLangInput).subscribe(card => {
      this._advantages = card.advantages;
    });
  }

  public close() {
    this.modalAnswerChange.emit(null);
  }

  get advantages(): string[] {
    return this._advantages;
  }

  get modalAnswer(): any {
    return this._modalAnswer;
  }
}

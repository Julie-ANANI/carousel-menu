import {Component, Input, OnInit} from '@angular/core';
import {TranslateService, initTranslation} from './i18n/i18n';

@Component({
  selector: 'app-shared-infographic-container',
  templateUrl: './shared-infographic-container.component.html',
  styleUrls: ['./shared-infographic-container.component.styl']
})
export class SharedInfographicContainerComponent implements OnInit {

  @Input() public infographic: any;
  @Input() public questions: any;
  @Input() public question: any;
  private _showDetails: boolean;

  constructor (private _translateService: TranslateService) { }

  ngOnInit () {
    initTranslation(this._translateService);
    this._showDetails = false;
  }

  get showDetails(): boolean {
    return this._showDetails;
  }
  set showDetails(bool: boolean) {
    this._showDetails = bool;
  }
}

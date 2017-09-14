import {Component, HostListener, Input, OnInit, ViewChild} from "@angular/core";

@Component({
  selector: 'app-shared-infographic-answer-string',
  templateUrl: './shared-infographic-answer-string.component.html',
  styleUrls: ['./shared-infographic-answer-string.component.styl']
})


export class SharedInfographicAnswerStringComponent implements OnInit {

  private _showMoreProInfos: boolean;
  @Input() public answer: string;
  @Input() public answerObject: any;

  @ViewChild('proInfos') private _divProInfos;

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    if (!this._divProInfos.nativeElement.contains(targetElement)) {
      this._showMoreProInfos = false;
    }
  }

  constructor () { }

  ngOnInit () {
    this._showMoreProInfos = false;
  }

  get showMoreProInfos(): boolean {
    return this._showMoreProInfos;
  }
  set showMoreProInfos(value: boolean) {
    this._showMoreProInfos = value;
  }

  toggleShowMoreInfo() {
    this._showMoreProInfos = !this._showMoreProInfos;
  }
}

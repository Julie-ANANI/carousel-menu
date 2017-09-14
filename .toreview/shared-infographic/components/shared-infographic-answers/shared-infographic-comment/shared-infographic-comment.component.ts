import {Component, HostListener, Input, OnInit, ViewChild} from "@angular/core";

@Component({
  selector: 'app-shared-infographic-comment',
  templateUrl: './shared-infographic-comment.component.html',
  styleUrls: ['./shared-infographic-comment.component.styl']
})
export class SharedInfographicCommentComponent implements OnInit {

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

  constructor() { }

  ngOnInit() {
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

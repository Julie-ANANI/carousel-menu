import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

interface PrincipalObjective {
  category: string;
  objective: string;
}

@Component({
  selector: 'app-market-test-objectives',
  templateUrl: './market-test-objectives.component.html',
  styleUrls: ['./market-test-objectives.component.scss']
})
export class MarketTestObjectivesComponent implements OnInit {

  @Input() set objectiveComment(value: string) {
    this._objectiveComment = value;
  }

  private _selectedCategory = '';

  private _objectivesCategory: Array<string> = ['INNOVATE', 'INNOVATION'];

  private _selectedPrincipal: PrincipalObjective = <PrincipalObjective>{};

  principalObjectives: Array<PrincipalObjective> = [
    {category: 'INNOVATE', objective: 'Detecting market needs'},
    {category: 'INNOVATE', objective: 'Validating market needs'},
    {category: 'INNOVATE', objective: 'Sourcing solutions / suppliers'},
    {category: 'INNOVATION', objective: 'Identifying receptive markets'},
    {category: 'INNOVATION', objective: 'Validating the interest in my project'},
    {category: 'INNOVATION', objective: 'Optimizing my value proposition'},
  ];

  @Output() objectiveCommentChange: EventEmitter<string> = new EventEmitter<string>();

  private _objectiveComment = '';

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
  }

  public onChangeCategory(event: Event, value: string) {
    event.preventDefault();
    if (value !== this._selectedCategory) {
      this._selectedCategory = value;
      this._selectedPrincipal = <PrincipalObjective>{};
    }
  }

  public onChangePrincipal(event: Event, value: PrincipalObjective) {
    event.preventDefault();
    if (this._selectedCategory && this._selectedCategory === value.category) {
      this._selectedPrincipal = value;
    }
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get objectiveComment(): string {
    return this._objectiveComment;
  }

  get selectedPrincipal(): PrincipalObjective {
    return this._selectedPrincipal;
  }

  get selectedCategory(): string {
    return this._selectedCategory;
  }

  get objectivesCategory(): Array<string> {
    return this._objectivesCategory;
  }

}

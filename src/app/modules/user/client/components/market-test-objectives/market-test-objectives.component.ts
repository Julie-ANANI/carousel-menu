import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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

  selectCategory = '';

  objectivesCategory: Array<string> = ['INNOVATE', 'INNOVATION'];

  selectPrincipalObjective: PrincipalObjective = <PrincipalObjective>{};

  principalObjectives: Array<PrincipalObjective> = [
    {category: 'INNOVATE', objective: 'Detecting market needs'},
    {category: 'INNOVATE', objective: 'Validating market needs'},
    {category: 'INNOVATE', objective: 'Sourcing solutions / suppliers'},
    {category: 'INNOVATION', objective: 'Identifying receptive markets'},
    {category: 'INNOVATION', objective: 'Validating the interest in my project'},
    {category: 'INNOVATION', objective: 'Optimizing my value proposition'},
  ];

  @Output() selectedPrincipalObjective: EventEmitter<any> = new EventEmitter<any>();

  @Output() selectedSecondaryObjectives: EventEmitter<any> = new EventEmitter<any>();

  @Output() selectedObjectiveComment: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
  }

  public onChangeCategory(event: Event, value: string) {
    event.preventDefault();
    if (value !== this.selectCategory) {
      this.selectCategory = value;
      this.selectPrincipalObjective = <PrincipalObjective>{};
    }
  }

  public onChangePrincipalObjective(event: Event, value: PrincipalObjective) {
    event.preventDefault();
    if (this.selectCategory && this.selectCategory === value.category) {
      this.selectPrincipalObjective = value;
    }
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

}

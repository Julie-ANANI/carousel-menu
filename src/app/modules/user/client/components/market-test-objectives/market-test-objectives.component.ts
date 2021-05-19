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

  selectedCategory = '';

  objectivesCategory: Array<string> = ['INNOVATE', 'INNOVATION'];

  selectedPrincipal: PrincipalObjective = <PrincipalObjective>{};

  principalObjectives: Array<PrincipalObjective> = [
    {category: 'INNOVATE', objective: 'Detecting market needs'},
    {category: 'INNOVATE', objective: 'Validating market needs'},
    {category: 'INNOVATE', objective: 'Sourcing solutions / suppliers'},
    {category: 'INNOVATION', objective: 'Identifying receptive markets'},
    {category: 'INNOVATION', objective: 'Validating the interest in my project'},
    {category: 'INNOVATION', objective: 'Optimizing my value proposition'},
  ];

  @Output() emitPrincipalObjective: EventEmitter<any> = new EventEmitter<any>();

  @Output() emitSecondaryObjectives: EventEmitter<any> = new EventEmitter<any>();

  @Output() emitObjectiveComment: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
  }

  public onChangeCategory(event: Event, value: string) {
    event.preventDefault();
    if (value !== this.selectedCategory) {
      this.selectedCategory = value;
      this.selectedPrincipal = <PrincipalObjective>{};
    }
  }

  public onChangePrincipal(event: Event, value: PrincipalObjective) {
    event.preventDefault();
    if (this.selectedCategory && this.selectedCategory === value.category) {
      this.selectedPrincipal = value;
    }
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

}

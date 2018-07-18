import {Component, Input, OnInit} from '@angular/core';
import {Section} from '../../../../../../models/section';


@Component({
  selector: 'app-admin-project-questionnaire-section',
  templateUrl: './admin-project-questionnaire-section.component.html',
  styleUrls: ['./admin-project-questionnaire-section.component.scss']
})
export class AdminProjectQuestionnaireSectionComponent implements OnInit {
  @Input() private section: Section;

  constructor() { }

  ngOnInit() {
    console.log(this.section);

  }

}

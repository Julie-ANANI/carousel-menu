import { Component, Input, OnInit } from '@angular/core';
import { Answer } from '../../../../../../../models/answer';

@Component({
  selector: 'app-executive-professional',
  templateUrl: './executive-professional.component.html',
  styleUrls: ['./executive-professional.component.scss']
})

export class ExecutiveProfessionalComponent implements OnInit {

  @Input() set answers(value: Array<Answer>) {
    this.answerReceived = value;
    this.topProfessionals();
  }

  @Input() set mapInitialConfiguration(value: any) {
    this.initialConfigurationReceived = value;
  }

  @Input() set professionalAbstract(value: string) {
    this.profAbstractReceived = value;
  }

  answerReceived: Array<Answer>;

  professionals: Array<any> = [];

  initialConfigurationReceived: any;

  profAbstractReceived: string;

  constructor() { }

  ngOnInit() {
  }

  private topProfessionals() {
    this.answerReceived.forEach((items) => {
      if (items.profileQuality === 2) {
        this.professionals.push(items);
      }
    });

    if (this.professionals.length === 0) {
      this.answerReceived.forEach((items) => {
        this.professionals.push(items);
      });
    }

  }

}

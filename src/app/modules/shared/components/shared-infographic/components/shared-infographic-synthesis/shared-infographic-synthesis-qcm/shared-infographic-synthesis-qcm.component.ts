import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-infographic-synthesis-qcm',
  templateUrl: './shared-infographic-synthesis-qcm.component.html',
  styleUrls: ['./shared-infographic-synthesis-qcm.component.styl']
})
export class SharedInfographicSynthesisQCMComponent implements OnInit {

  @Input() public propositions: string;
  @Input() public answers: string;
  @Input() public secondValue: string;


  constructor() { }

  ngOnInit() {
    console.log(this.answers);
  }

  getQuantityPerProp() {
    const datas: any = [];
    for (const proposition of this.propositions) {

      let cpt = 0;
      for (const answer of this.answers) {
        if (answer === proposition) {
          cpt++;
        }
      }
      datas.push(Math.floor(cpt * 100 / this.answers.length));

    }
    return datas;
  }

}

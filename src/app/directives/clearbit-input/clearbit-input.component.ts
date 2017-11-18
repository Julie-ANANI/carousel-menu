import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Clearbit } from '../../models/clearbit';
import { ClearbitInputService } from './clearbit-input.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'app-clearbit-input',
  templateUrl: 'clearbit-input.component.html',
  styleUrls: ['../input-list/input-list.component.scss']
})

export class ClearbitInputComponent implements OnInit {

  @Output() update = new EventEmitter<any>();
  clearbitCompanies: Observable<Clearbit[]>;
  companyName: FormControl = new FormControl();
  answerList: Array<Clearbit> = [];

  constructor(private service: ClearbitInputService) {}

  ngOnInit() {
    this.companyName.valueChanges.subscribe(x => {
      if (x) {
        this.clearbitCompanies = this.service.getPropositions(x).catch(_ => []);
      }
    });
  }

  addCompany(val: string): void {
    const clearbitObject = {name: val};
    this.answerList.push(clearbitObject);
    this.update.emit({value: this.answerList});
  }

  addClearbit(val: Clearbit): void {
    this.answerList.push(val);
    this.update.emit({value: this.answerList});
  }

  rmProposition(i: number): void {
    this.answerList.splice(i, 1);
    this.update.emit({value: this.answerList});
  }

}

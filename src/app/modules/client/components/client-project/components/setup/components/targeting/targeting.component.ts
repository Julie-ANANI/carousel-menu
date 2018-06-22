import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Innovation } from '../../../../../../../../models/innovation';
import { InnovationSettings } from '../../../../../../../../models/innov-settings';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-project-targeting',
  templateUrl: 'targeting.component.html',
  styleUrls: ['targeting.component.scss']
})

export class TargetingComponent implements OnInit{

  @Input() project: Innovation;
  @Input() showTargetingFieldError: Subject<boolean>;

  @Output() newSettings = new EventEmitter<InnovationSettings>();
  @Output() targetingFormField = new EventEmitter<boolean>();

  showFieldError: Subject<boolean> = new Subject();

  constructor() {}

  public updateSettings(value: InnovationSettings): void {
    this.newSettings.emit(value);
  }

  public targetingFormValidation(value: boolean) {
    this.targetingFormField.emit(value);
  }

  ngOnInit(): void {
    this.showTargetingFieldError.subscribe( value => {
      this.showFieldError.next(value);
    });
  }

}

import {Component, Output, Input, EventEmitter, OnInit} from '@angular/core';
import { Innovation } from '../../../../../../../../models/innovation';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-project-pitch',
  templateUrl: 'pitch.component.html',
  styleUrls: ['pitch.component.scss']
})

export class PitchComponent implements OnInit {

  @Input() project: Innovation;
  @Input() changesSaved: boolean;
  @Input() showPitchFieldError: Subject<boolean>;

  @Output() saveChanges = new EventEmitter<boolean>();

  showFieldError: Subject<boolean> = new Subject();

  constructor() {}

  public saveInnovation(value: boolean) {
    this.saveChanges.emit(value);
  }

  ngOnInit(): void {
    this.showPitchFieldError.subscribe( value => {
      this.showFieldError.next(value);
    });
  }

}

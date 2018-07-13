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
  @Output() innovationToPreview = new EventEmitter<number>();

  showFieldError: Subject<boolean> = new Subject();

  constructor() {}

  public saveInnovation(value: boolean) {
    this.saveChanges.emit(value);
  }

  innovationPreview(value: number) {
    this.innovationToPreview.emit(value);
  }

  ngOnInit(): void {
    this.showPitchFieldError.subscribe( value => {
      this.showFieldError.next(value);
    });
  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveObjective } from '../../../../../models/executive-report';
import { User } from '../../../../../models/user.model';

@Component({
  selector: 'executive-objective',
  templateUrl: './executive-objective.component.html',
  styleUrls: ['./executive-objective.component.scss']
})

export class ExecutiveObjectiveComponent {

  @Input() set config(value: ExecutiveObjective) {
    this._config = {
      objective: value.objective || '',
      owner: {
        name: value.owner && value.owner.name || '',
        email: value.owner && value.owner.email || '',
      },
      umiCommercial: value.umiCommercial || ''
    };
  }

  @Output() configChange: EventEmitter<ExecutiveObjective> = new EventEmitter<ExecutiveObjective>();

  private _config: ExecutiveObjective = <ExecutiveObjective>{};

  // todo uncomment this
  // private readonly _allCommercials: Observable<Array<User>> = call service here;

  // todo remove this
  allCommercials: Array<User> = [];

  private _commercial: User = <User>{};

  constructor() { }

  public emitChanges(event: Event) {
    event.preventDefault();
    this.configChange.emit(this._config);
  }

  public selectCommercial(event: Event) {
    event.preventDefault();
    // todo select commercial.
    console.log(event);
    this.emitChanges(event);
  }

  get config(): ExecutiveObjective {
    return this._config;
  }

  /*get allCommercials(): Observable<Array<User>> {
    return this._allCommercials;
  }*/

  get commercial(): User {
    return this._commercial;
  }

}

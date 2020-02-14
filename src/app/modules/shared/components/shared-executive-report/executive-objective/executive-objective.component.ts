import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveObjective } from '../../../../../models/executive-report';
import { User } from '../../../../../models/user.model';
import { CommonService } from '../../../../../services/common/common.service';

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

  private _objectiveColor = '#2ECC71';

  private _clientNameColor = '#2ECC71';

  private _clientEmailColor = '#2ECC71';

  constructor() { }

  public emitChanges(event: Event, field?: string) {
    event.preventDefault();
    this.configChange.emit(this._config);

    switch (field) {

      case 'objective':
        this._objectiveColor = CommonService.getLimitColor(this._config.objective.length, 120);
        break;

      case 'clientName':
        this._clientNameColor = CommonService.getLimitColor(this._config.owner.name.length, 58);
        break;

      case 'clientEmail':
        this._clientEmailColor = CommonService.getLimitColor(this._config.owner.email.length, 58);
        break;

    }

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

  get objectiveColor(): string {
    return this._objectiveColor;
  }

  get clientNameColor(): string {
    return this._clientNameColor;
  }

  get clientEmailColor(): string {
    return this._clientEmailColor;
  }

}

import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Etherpad, PadType} from '../../../../models/etherpad';
import {AuthService} from '../../../../services/auth/auth.service';
import {UserFrontService} from '../../../../services/user/user-front.service';
import {User} from '../../../../models/user.model';
import {EtherpadService} from '../../../../services/etherpad/etherpad.service';

type Editor = 'ETHERPAD' | 'TINY_MCE';

@Component({
  selector: 'app-shared-editors',
  templateUrl: './shared-editors.component.html'
})
export class SharedEditorsComponent implements OnChanges {

  @Input() set text(value: string) {
    this._text = value;
  }

  @Input() isEditable = true;

  @Input() padHeight = '400px';

  @Input() tinymceHeight = '250px';

  @Input() innovationId = '';

  @Input() elementId = '';

  @Input() type: PadType = 'orphan';

  @Output() textChange: EventEmitter<any> = new EventEmitter<any>();

  private _editor: Editor = 'ETHERPAD';

  private _etherpad: Etherpad = <Etherpad>{};

  private _text = '';

  constructor(private _authService: AuthService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.elementId) {
      this._etherpad = {
        type: this.type,
        elementId: this.elementId,
        authorID: this._authService.etherpadAccesses.authorID,
        innovationId: this.innovationId,
        padID: EtherpadService.buildPadID(this.type, this.elementId),
        userName: UserFrontService.fullName(this.user)
      };
    }
  }

  public onTextChange(value: any) {
    this.textChange.emit(value);
  }

  get editor(): Editor {
    return this._editor;
  }

  get etherpad(): Etherpad {
    return this._etherpad;
  }

  get text(): string {
    return this._text;
  }

  get user(): User {
    return this._authService.user;
  }

}

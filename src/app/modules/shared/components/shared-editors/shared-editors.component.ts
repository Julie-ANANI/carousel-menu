import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {Etherpad, PadType} from '../../../../models/etherpad';
import {AuthService} from '../../../../services/auth/auth.service';
import {UserFrontService} from '../../../../services/user/user-front.service';
import {User} from '../../../../models/user.model';
import {EtherpadService} from '../../../../services/etherpad/etherpad.service';
import {Subject} from 'rxjs';

type Editor = 'ETHERPAD' | 'TINY_MCE';

@Component({
  selector: 'app-shared-editors',
  templateUrl: './shared-editors.component.html'
})
export class SharedEditorsComponent implements OnChanges, OnDestroy {

  @Input() set text(value: string) {
    this._text = value;
  }

  private _isEditable: boolean;

  @Input() set isEditable(value: boolean) {
    this._isEditable = value;
    this._editor = (this.isEditable && this._authService.etherpadAccesses.active) ? 'ETHERPAD' : 'TINY_MCE';
  }

  @Input() padHeight = '400px';

  @Input() tinymceHeight = '250px';

  @Input() innovationId = '';

  @Input() elementId = '';

  @Input() type: PadType = 'orphan';

  @Output() textChange: EventEmitter<any> = new EventEmitter<any>();

  private _editor: Editor = 'TINY_MCE';

  private _etherpad: Etherpad = <Etherpad>{};

  private _text = '';

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _authService: AuthService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.elementId) {
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

  public onChangeEditor() {
    this._editor = (this._editor === 'ETHERPAD') ? 'TINY_MCE' : 'ETHERPAD';
  }

  public onTextChange(value: any) {
    value.content = this.sanitiseEtherpadComments(value.content);
    this.textChange.emit(value);
  }

  public sanitiseEtherpadComments(text: string): string {
    const regex = /<sup><a href="#c-\w+">\*<\/a><\/sup>/gm;
    return text.replace(regex, '').replace(/\*\*/g, '');
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

  get isEditable(): boolean {
    return this._isEditable;
  }

  get isEtherpadUp(): boolean {
    return this._authService.etherpadAccesses.active;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}

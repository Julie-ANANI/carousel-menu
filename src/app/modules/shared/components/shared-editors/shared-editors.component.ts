import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {Etherpad, PadType} from '../../../../models/etherpad';
import {AuthService} from '../../../../services/auth/auth.service';
import {UserFrontService} from '../../../../services/user/user-front.service';
import {User} from '../../../../models/user.model';
import {Subject} from 'rxjs';
import {EtherpadFrontService} from '../../../../services/etherpad/etherpad-front.service';

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
    this.setEditor();
  }

  @Input() padHeight = '400px';

  @Input() tinymceHeight = '250px';

  @Input() set innovationId(value: string) {
    this._innovationId = value;
    this.setEditor();
  }
  private _innovationId = '';

  @Input() elementId = '';

  @Input() isClient = false;

  @Input() type: PadType = 'orphan';

  @Input() lang = 'en';

  @Output() textChange: EventEmitter<any> = new EventEmitter<any>();

  public limitEtherpadAccess = false;

  // Useful when limitEtherpadAccess is set to true
  private _authorizedEtherpadProjects = [
    // Production projects
    '5fc8ac5bdf99326414b0151b', '5f918025d9a0f39747fff6b8', '5f3ce42711bce90bd1dfdb24', '5ffedfcc4f932cf73f01f995',
    '6020f5229f3836de355f3b8a', '6020f5449f3836d0845f3bdb', '6008099af5588b7d341fcfe3', '602a68e042dc1b27799e414d',
    '5f19b6902279890e927f7f83', '603687898642ac3f6f06222d',
    // Dev projects
    '5fbbb492d67f795c1be29e91', '5f7d75250fd29613ef69d99b'
  ];

  private _editor: Editor = 'TINY_MCE';

  private _etherpad: Etherpad = <Etherpad>{};

  private _text = '';

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _authService: AuthService,
              private _etherpadFrontService: EtherpadFrontService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.elementId) {
      this._etherpad = {
        type: this.type,
        elementId: this.elementId,
        authorID: this._authService.etherpadAccesses.authorID,
        innovationId: this._innovationId,
        padID: this._etherpadFrontService.buildPadID(this.type, this.elementId),
        userName: UserFrontService.fullName(this.user),
        noColors: this.isClient,
        lang: this.lang
      };
    }
  }

  private setEditor() {
    if (!this.limitEtherpadAccess || this.isEtherpadAuthorizedForInnovation()) {
      this._editor = (this.isEditable && this._authService.etherpadAccesses.active) ? 'ETHERPAD' : 'TINY_MCE';
    }
  }

  private isEtherpadAuthorizedForInnovation() {
    return this._authorizedEtherpadProjects.includes(this._innovationId);
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

  get showToggle(): boolean {
    return this._isEditable && !this.isEtherpadUp && (!this.limitEtherpadAccess || this.isEtherpadAuthorizedForInnovation());
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}

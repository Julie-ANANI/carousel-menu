import {Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID, ViewChild} from '@angular/core';
import {Etherpad} from '../../../../models/etherpad';
import {isPlatformBrowser} from '@angular/common';
import {EtherpadService} from '../../../../services/etherpad/etherpad.service';
import {first, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../services/translate-notifications/translate-notifications.service';
import {ErrorFrontService} from '../../../../services/error/error-front.service';
import {CommonService} from '../../../../services/common/common.service';
import {UserFrontService} from '../../../../services/user/user-front.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {EtherpadSocketService} from '../../../../services/socket/etherpad.socket.service';
import {EtherpadFrontService} from '../../../../services/etherpad/etherpad-front.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-shared-editor-etherpad',
  templateUrl: './shared-editor-etherpad.component.html'
})
export class SharedEditorEtherpadComponent implements OnInit, OnDestroy {

  @Input() set isEditable(value: boolean) {
    this._isLoading = this._isEditable = value;
  }

  @Input() set text(value: string) {
    this._text = value || '';
  }

  @Input() set etherpad(value: Etherpad) {
    this._initEtherpad(value);
  }

  @Input() minHeight = '400px';

  @Output() textChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('sharedEditorEtherpad', { read: ElementRef, static: true }) sharedEditorEtherpad: ElementRef;

  private _etherpad: Etherpad = <Etherpad>{};

  private _element: any = null;

  private _htmlId = '';

  private _isLoading = true;

  private _isEditable = true;

  private _text = '';

  private _ngUnsubscribe: Subject<any> = new Subject();

  public height = 400;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _etherpadService: EtherpadService,
              private _etherpadFrontService: EtherpadFrontService,
              private _etherpadSocketService: EtherpadSocketService,
              private _authService: AuthService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  ngOnInit() {
    this._detectEtherpadServerDown();
    this._etherpadService.pingServer().subscribe(() => {
      this._authService.etherpadAccesses.active = true;
      this._createEtherpad();
      }, () => {
        this.disableEtherpad();
      });
  }


  isEtherpadUp(): boolean {
    return this._authService.etherpadAccesses.active;
  }

  private _initEtherpad(value: Etherpad) {
    if (isPlatformBrowser(this._platformId)) {
      this._etherpad = {
        type: value.type || 'orphan',
        elementId: value.elementId,
        showChat: value.showChat || false,
        lang: value.lang,
        noColors: value.noColors || false,
        userName: value.userName || 'user',
        padID: value.padID || this._etherpadFrontService.buildPadID(value.type, value.elementId),
        innovationId: value.innovationId || ''
      };
      this._createEtherpad();
    }
  }

  /***
   * making the call to the back to create the pad on the etherpad server after that we select this
   * html element and append the iframe element as child.
   * @private
   */
  private _createEtherpad() {
    if (this.isEtherpadUp() && this._isEditable && isPlatformBrowser(this._platformId)
      && this._etherpad.innovationId && this._etherpad.padID) {
      this._etherpadService.createPad(this._etherpad.innovationId, this._etherpad.padID, this._text)
        .pipe(first()).subscribe((response) => {
          this._etherpad.userName = UserFrontService.fullName(this._authService.user);
          this._etherpad.groupID = response && response.groupID;
          this._htmlId = Math.random().toString(36).substr(2, 10);
          this._createIframe();
          this._detectPadTextChange();
      }, (err: HttpErrorResponse) => {
        this.disableEtherpad();
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        });
    }
  }

  /***
   * this os to create iframe and append to the element.
   * @private
   */
  private _createIframe() {
    this._removeIframe();
    const _iframe = document.createElement('iframe');
    _iframe.setAttribute('src', CommonService.etherpadSrc(this._etherpad));
    _iframe.setAttribute('id', this._etherpad.padID);
    _iframe.style.height = this.minHeight;
    this.sharedEditorEtherpad.nativeElement.appendChild(_iframe);
    this._isLoading = false;
  }

  /***
   * this os to delete iframe and remove it from the element.
   * @private
   */
  private _removeIframe() {
    const iframeElement = this.sharedEditorEtherpad.nativeElement.getElementsByTagName('iframe')[0];
    if (iframeElement) {
      this.sharedEditorEtherpad.nativeElement.removeChild(iframeElement);
    }
  }

  private _detectPadTextChange() {
    const groupPadId = EtherpadFrontService.getGroupPadId(this._etherpad.groupID, this._etherpad.padID);
    this._etherpadSocketService
      .getPadUpdated(groupPadId, this._authService.etherpadAccesses.authorID)
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((data: { text: string }) => {
        if (data.text && data.text.length !== this.text.length) {
          this.textChange.emit({content: data.text});
        }
      });
  }

  private _detectEtherpadServerDown() {
    this._etherpadSocketService.getServerStatusMessages()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((status: { serverUp: boolean }) => {
        if (this.isEtherpadUp() && !status.serverUp) {
          this.disableEtherpad();
        }
      });
  }

  private disableEtherpad() {
    this._authService.etherpadAccesses.active = false;
    this._removeIframe();
  }

  get etherpad(): Etherpad {
    return this._etherpad;
  }

  get element(): any {
    return this._element;
  }

  get htmlId(): string {
    return this._htmlId;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  get text(): string {
    return this._text;
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this._platformId) && this._element) {
      this._removeIframe();
    }
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

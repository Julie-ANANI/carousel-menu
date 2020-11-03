import {Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {Etherpad} from '../../../../models/etherpad';
import {isPlatformBrowser} from '@angular/common';
import {EtherpadService} from '../../../../services/etherpad/etherpad.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../services/error/error-front.service';
import {CommonService} from '../../../../services/common/common.service';
import {TranslateService} from '@ngx-translate/core';
import {UserFrontService} from '../../../../services/user/user-front.service';
import {AuthService} from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-shared-editor-etherpad',
  templateUrl: './shared-editor-etherpad.component.html'
})
export class SharedEditorEtherpadComponent implements OnInit, OnDestroy {

  @Input() set isEditable(value: boolean) {
    this._isLoading = this._isEditable = value;
  }

  @Input() set text(value: string) {
    this._text = value;
  }

  @Input() set etherpad(value: Etherpad) {
    this._initEtherpad(value);
  }

  @Input() minHeight = '400px';

  @Output() textChange: EventEmitter<any> = new EventEmitter<any>();

  private _etherpad: Etherpad = <Etherpad>{};

  private _element: any = null;

  private _htmlId = '';

  private _isLoading = true;

  private _isEditable = true;

  private _text = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _etherpadService: EtherpadService,
              private _translateService: TranslateService,
              private _authService: AuthService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _elementRef: ElementRef) {
    this._element = this._elementRef.nativeElement;
  }

  ngOnInit() {
  }

  private _initEtherpad(value: Etherpad) {
    if (isPlatformBrowser(this._platformId)) {
      this._etherpad = {
        type: value.type || 'orphan',
        elementId: value.elementId,
        showChat: value.showChat || false,
        lang: value.lang || this._translateService.currentLang || 'en',
        noColors: value.noColors,
        userName: value.userName || 'user',
        padID: value.padID || EtherpadService.buildPadID(value.type, value.elementId),
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
    if (isPlatformBrowser(this._platformId) && this._etherpad.innovationId && this._etherpad.padID) {
      this._etherpadService.createPad(this._etherpad.innovationId, this._etherpad.padID, this._text)
        .pipe(first()).subscribe((response) => {
          this._etherpad.userName = UserFrontService.fullName(this._authService.user);
          this._etherpad.groupID = response && response.groupID;
          this._htmlId = Math.random().toString(36).substr(2,10);
          this._element = this._element.querySelector(`.shared-editor-etherpad`);
          this._createIframe();
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          console.error(err);
        });
    }
  }

  /***
   * this os to create iframe and append to the element.
   * @private
   */
  private _createIframe() {
    const _iframe = document.createElement('iframe');
    _iframe.setAttribute('src', CommonService.etherpadSrc(this._etherpad));
    _iframe.setAttribute('id', this._etherpad.padID);
    _iframe.style.height = this.minHeight;
    this._element.appendChild(_iframe);
    this._isLoading = false;
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
      // document.removeChild(this._element);
    }
  }

}

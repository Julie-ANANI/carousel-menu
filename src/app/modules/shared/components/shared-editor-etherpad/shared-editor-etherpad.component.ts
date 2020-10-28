import {Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {Etherpad} from '../../../../models/etherpad';
import {isPlatformBrowser} from '@angular/common';
import {EtherpadService} from '../../../../services/etherpad/etherpad.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../services/error/error-front.service';
import {CommonService} from '../../../../services/common/common.service';

@Component({
  selector: 'app-shared-editor-etherpad',
  templateUrl: './shared-editor-etherpad.component.html'
})
export class SharedEditorEtherpadComponent implements OnInit, OnDestroy {

  @Input() set etherpad(value: Etherpad) {
    this._initEtherpad(value);
  }

  @Input() minHeight = '400px';

  @Input() isEditable = true;

  @Input() text = '';

  private _etherpad: Etherpad = <Etherpad>{};

  private _element: any = null;

  private _htmlId = Math.random().toString(36).substr(2,10);

  private _isLoading = true;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _etherpadService: EtherpadService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _elementRef: ElementRef) { }

  ngOnInit() {
  }

  private _initEtherpad(value: Etherpad) {
    if (isPlatformBrowser(this._platformId)) {
      this._etherpad = {
        showChat: value.showChat || false,
        lang: value.lang || 'en',
        noColors: value.noColors,
        userName: value.userName || 'user',
        padId: value.padId || '',
        groupId: value.groupId || ''
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
    if (isPlatformBrowser(this._platformId) && !this._element && this._etherpad.groupId && this._etherpad.padId) {
      this._etherpadService.createPad(this._etherpad.groupId, this._etherpad.padId).pipe(first()).subscribe(() => {
        this._element = this._elementRef.nativeElement.querySelector(`#${this._htmlId}`);
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
    _iframe.setAttribute('id', this._etherpad.padId);
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

  ngOnDestroy(): void {
    if (isPlatformBrowser(this._platformId)) {
      document.removeChild(this._element);
    }
  }

}

import {Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {EtherpadService} from '../../../../services/etherpad/etherpad.service';
import {isPlatformBrowser} from '@angular/common';
import {first, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Session} from '../../../../models/session';
import {AuthService} from '../../../../services/auth/auth.service';
import {EtherpadFrontService} from '../../../../services/etherpad/etherpad-front.service';
import {EtherpadSocketService} from '../../../../services/socket/etherpad.socket.service';
import {Subject} from 'rxjs';

/***
 * example: admin-project component.
 * http://localhost:4200/user/admin/projects/project/5f03324de410e50c0171fd4a/settings -
 * after the project title in the header.
 */

@Component({
  selector: 'app-shared-activity-modal',
  templateUrl: './shared-activity-modal.component.html',
  styleUrls: ['./shared-activity-modal.component.scss']
})
export class SharedActivityModalComponent implements OnInit, OnDestroy {

  /***
   * based on this id we call the etherpad service in the api
   * @param value
   */
  @Input() set innovationId(value: string) {
    if (value) {
      this._getSubscribedUsers(value);
      this._innovationId = value;
    }
  }

  private _showModal = false;

  private _usersSessions: Array<Session> = [];

  private _isLoading = true;

  private _listenSessionChange = false;

  private _authorId: string;

  private _innovationId: string;

  private _groupId: string;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _etherpadService: EtherpadService,
              private _etherpadSocketService: EtherpadSocketService,
              private _authService: AuthService) {
    this._authorId = this._authService.etherpadAccesses.authorID;
  }

  ngOnInit() {
  }

  /***
   * getting the subscribed users for the provided groupID.
   * @param id
   * @private
   */
  private _getSubscribedUsers(id: string) {
    if (isPlatformBrowser(this._platformId)) {
      this._etherpadService.subscribedUsersSessions(id).pipe(first()).subscribe((sessions) => {
        this._usersSessions = EtherpadFrontService.sortSessions(sessions);
        if (sessions.length && !this._listenSessionChange) {
          this._groupId = sessions[0].groupID;
          this._detectSessionsChange();
        }
        this._isLoading = false;
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  private _detectSessionsChange() {
    this._listenSessionChange = true;
    this._etherpadSocketService
      .getGroupSessionUpdate(this._groupId)
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(() => {
        this._getSubscribedUsers(this._innovationId);
      });
  }

  public openModal(event: Event) {
    event.preventDefault();
    if (!this._isLoading) {
      this._showModal = true;
    }
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get usersSessions(): Array<Session> {
    return this._usersSessions;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get authorId(): string {
    return this._authorId;
  }

  get isEtherpadUp(): boolean {
    return this._authService.etherpadAccesses.active;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}

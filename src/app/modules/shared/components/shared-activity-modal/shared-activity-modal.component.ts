import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {EtherpadService} from '../../../../services/etherpad/etherpad.service';
import {isPlatformBrowser} from '@angular/common';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Session} from '../../../../models/session';
import {AuthService} from '../../../../services/auth/auth.service';
import {EtherpadFrontService} from '../../../../services/etherpad/etherpad-front.service';

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
export class SharedActivityModalComponent implements OnInit {

  /***
   * based on this id we call the etherpad service in the api
   * @param value
   */
  @Input() set innovationId(value: string) {
    if (value) {
      this._getSubscribedUsers(value);
    }
  }

  private _showModal = false;

  private _usersSessions: Array<Session> = [];

  private _isLoading = true;

  private _authorId: string;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _etherpadService: EtherpadService,
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
        this._isLoading = false;
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
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
}

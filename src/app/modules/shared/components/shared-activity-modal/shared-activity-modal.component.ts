import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {EtherpadService} from '../../../../services/etherpad/etherpad.service';
import {isPlatformBrowser} from '@angular/common';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Session} from '../../../../models/session';

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

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _etherpadService: EtherpadService) { }

  ngOnInit() {
    this._isLoading = false;
  }

  /***
   * getting the subscribed users for the provided group.
   * @param id
   * @private
   */
  private _getSubscribedUsers(id: string) {
    if (isPlatformBrowser(this._platformId)) {
      this._etherpadService.subscribedUsersSessions(id).pipe(first()).subscribe((sessions) => {
        this._usersSessions = sessions;
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

}

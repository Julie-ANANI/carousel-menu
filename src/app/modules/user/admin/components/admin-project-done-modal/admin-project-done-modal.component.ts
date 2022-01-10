import {Component, EventEmitter, Inject, Input, Output, PLATFORM_ID} from '@angular/core';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
import {TranslateNotificationsService} from '../../../../../services/translate-notifications/translate-notifications.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../services/error/error-front.service';

@Component({
  selector: 'app-admin-project-done-modal',
  templateUrl: './admin-project-done-modal.component.html',
  styleUrls: ['./admin-project-done-modal.component.scss']
})
export class AdminProjectDoneModalComponent {

  get isSaving(): boolean {
    return this._isSaving;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  @Input() innovationId = '';

  @Input() set showModal(value) {
    this._showModal = value || false;
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() statusUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _isSaving = false;

  private _showModal = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  public closeModal(event: Event) {
    event.preventDefault();
    this._showModal = false;
    this.showModalChange.emit(this._showModal);
  }

  public onConfirm(event: Event) {
    event.preventDefault();

    if (!this._isSaving && this.innovationId) {
      this._isSaving = true;
      this._innovationService.save(this.innovationId, {status: 'DONE'}).pipe(first()).subscribe(() => {
        this.statusUpdated.emit(true);
        this.closeModal(event);
        this._translateNotificationsService.success('Project Status Success...', 'The project status has been updated to Done.');
        this._isSaving = false;
      }, (err: HttpErrorResponse) => {
        this._isSaving = false;
        this._translateNotificationsService.error('Project Status Error...', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

}

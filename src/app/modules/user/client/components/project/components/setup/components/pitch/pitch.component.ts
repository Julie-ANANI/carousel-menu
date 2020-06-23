import {Component, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../../../../models/innovation';
import {PitchHelpFields} from '../../../../../../../../../models/static-data/project-pitch';
import {InnovationFrontService} from '../../../../../../../../../services/innovation/innovation-front.service';
import {first, takeUntil} from 'rxjs/operators';
import {MissionFrontService} from '../../../../../../../../../services/mission/mission-front.service';
import {Mission} from '../../../../../../../../../models/mission';
import {Subject} from 'rxjs';
import {InnovCard} from '../../../../../../../../../models/innov-card';
import {SidebarInterface} from '../../../../../../../../sidebars/interfaces/sidebar-interface';
import {InnovationService} from '../../../../../../../../../services/innovation/innovation.service';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../../../../services/error/error-front.service';
import {Video} from '../../../../../../../../../models/media';

@Component({
  selector: 'app-project-pitch',
  templateUrl: './pitch.component.html',
  styleUrls: ['./pitch.component.scss']
})

export class PitchComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _activeCardIndex = 0;

  private _sidebarValue: SidebarInterface = {
    animate_state: 'inactive'
  };

  private _isSaving = false;

  private _cardContent: any = '';

  constructor(private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
    });

    this._innovationFrontService.activeCardIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((cardIndex) => {
      this._activeCardIndex = cardIndex;
    });
  }

  public isFilled(field: string): boolean {
    switch (field) {

      case 'TITLE':
        return !!this.activeInnovCard.title;

      case 'SUMMARY':
        return !!this.activeInnovCard.summary;

      case 'MEDIA':
        return !!(this.activeInnovCard.media && this.activeInnovCard.media.length);

    }
    return false;
  }

  public openSidebar(field: string) {

    switch (field) {

      case 'TITLE':
        this._cardContent = this.activeInnovCard.title;
        break;

      case 'SUMMARY':
        this._cardContent = this.activeInnovCard.summary;
        break;

      case 'MEDIA':
        this._cardContent = '';
        break;

    }

    this._sidebarValue = {
      animate_state: 'active',
      type: field,
      size: '726px',
      title: 'SIDEBAR.PROJECT_PITCH.' + field
    };

  };

  public onSaveProject(event: {type: string, content: any}) {
    if (event.type) {
      switch (event.type) {

        case 'TITLE':
          this._innovation.innovationCards[this._activeCardIndex].title = event.content;
          this._updateProject();
          break;

        case 'SUMMARY':
          this._innovation.innovationCards[this._activeCardIndex].summary = event.content;
          this._updateProject();
          break;

        case 'IMAGE':
          this._innovation.innovationCards[this._activeCardIndex].media.push(event.content);
          if (!this._innovation.innovationCards[this._activeCardIndex].principalMedia) {
            this._innovation.innovationCards[this._activeCardIndex].principalMedia = event.content;
          }
          this._updateProject();
          break;

        case 'VIDEO':
          this._uploadVideo(event.content);
          break;
      }
    }
  }

  private _updateProject() {
    this._innovationService.save(this._innovation._id, this._innovation).pipe(first()).subscribe((innovation) => {
      this._innovationFrontService.setInnovation(innovation);
      this._isSaving = false;
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._isSaving = false;
      console.error(err);
    });
  }

  private _uploadVideo(video: Video) {
    this._innovationService.addNewMediaVideoToInnovationCard(this._innovation._id, this.activeInnovCard._id, video)
      .pipe(first()).subscribe((video) => {
        this._innovation.innovationCards[this._activeCardIndex].media.push(video);
        this._innovationFrontService.setInnovation(this._innovation);
        this._isSaving = false;
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._isSaving = false;
      console.error(err);
    });
  }

  get activeInnovCard(): InnovCard {
    return InnovationFrontService.activeCard(this._innovation, this._activeCardIndex);
  }

  get imagePostUri(): string {
    return this._innovation._id && this.activeInnovCard._id
      ? `/innovation/${this._innovation._id}/innovationCard/${this.activeInnovCard._id}/media/image` : '';
  }

  get pitchHelp(): PitchHelpFields {
    return MissionFrontService.objectiveInfo(<Mission>this._innovation.mission,
      'PITCH_HELP', this.activeInnovCard.lang);
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  set isSaving(value: boolean) {
    this._isSaving = value;
  }

  get cardContent(): any {
    return this._cardContent;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

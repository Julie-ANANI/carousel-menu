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
import {Media, Video} from '../../../../../../../../../models/media';
import {CardComment, CardSections} from '../../../../../../../../../models/innov-card-comment';

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

  private _isEditable = false;

  private _defaultSections: Array<string> = ['TITLE', 'SUMMARY', 'MEDIA'];

  private _activeSection: CardSections = '';

  constructor(private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      this._isEditable = this._innovation.status && (this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
    });

    this._innovationFrontService.activeCardIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((cardIndex) => {
      this._activeCardIndex = cardIndex;
    });
  }

  public sectionInfo(section: string, type: string): string | boolean | Array<Media> {
    switch (section) {

      case 'TITLE':
        if (type === 'HEADING') {
          return this.activeInnovCard.title ? 'PROJECT_PITCH.DESCRIPTION.TITLE_FILLED' : 'PROJECT_PITCH.DESCRIPTION.TITLE_NOT_FILLED';
        } else if (type === 'CLASS') {
          return !!this.activeInnovCard.title;
        } else if (type === 'CONTENT') {
          return this.activeInnovCard.title;
        } else if (type === 'LABEL') {
          return !!(InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'TITLE').comment
            || InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'TITLE').suggestion);
        }
        break;

      case 'SUMMARY':
        if (type === 'HEADING') {
          return this.activeInnovCard.summary ? 'PROJECT_PITCH.DESCRIPTION.SUMMARY_FILLED' : 'PROJECT_PITCH.DESCRIPTION.SUMMARY_NOT_FILLED';
        } else if (type === 'CLASS') {
          return !!this.activeInnovCard.summary;
        } else if (type === 'CONTENT') {
          return this.activeInnovCard.summary;
        } else if (type === 'LABEL') {
          return !!(InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'SUMMARY').comment
            || InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'SUMMARY').suggestion);
        }
        break;

      case 'MEDIA':
        if (type === 'HEADING') {
          return 'PROJECT_PITCH.DESCRIPTION.MEDIA';
        } else if (type === 'CLASS') {
          return !!(this.activeInnovCard.media && this.activeInnovCard.media.length);
        } else if (type === 'CONTENT') {
          return this.activeInnovCard.media;
        }
        break;

    }
  }

  public openSidebar(section: string) {
    this._activeSection = <CardSections>section;

    switch (section) {

      case 'TITLE':
        this._cardContent = this.activeInnovCard.title;
        break;

      case 'SUMMARY':
        this._cardContent = this.activeInnovCard.summary;
        break;

      case 'MEDIA':
        this._cardContent = this.activeInnovCard.media;
        break;

    }

    this._sidebarValue = {
      animate_state: 'active',
      type: section,
      size: '726px',
      title: 'SIDEBAR.PROJECT_PITCH.' + section
    };

  };

  public mediaSrc(media: Media) {
    return InnovationFrontService.getMedia(media);
  }

  public onSaveProject(event: {type: string, content: any}) {
    if (event.type && this._isEditable && this._isSaving) {
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
          this._cardContent = this.activeInnovCard.media;
          this._updateProject('ERROR.PROJECT.UPDATED_TEXT');
          break;

        case 'VIDEO':
          this._uploadVideo(event.content);
          break;

        case 'MAIN_MEDIA':
          this._setMainMedia(event.content)
          break;

        case 'DELETE_MEDIA':
          this._deleteMedia(event.content)
          break;
      }
    }
  }

  private _updateProject(message = 'ERROR.PROJECT.SAVED_TEXT') {
    this._innovationService.save(this._innovation._id, this._innovation).pipe(first()).subscribe((innovation) => {
      this._innovationFrontService.setInnovation(innovation);
      this._isSaving = false;
      this._translateNotificationsService.success('ERROR.SUCCESS', message);
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
        this._cardContent = this.activeInnovCard.media;
        this._isSaving = false;
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.UPDATED_TEXT');
    }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isSaving = false;
        console.error(err);
    });
  }

  private _setMainMedia(media: Media) {
    this._innovationService.setPrincipalMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, media._id)
      .pipe(first()).subscribe(() => {
        this.activeInnovCard.principalMedia = media;
        this._isSaving = false;
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.UPDATED_TEXT');
    }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isSaving = false;
        console.error(err);
    });
  }

  private _deleteMedia(media: Media) {
    this._innovationService.deleteMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, media._id)
      .pipe(first()).subscribe(() => {
        this.activeInnovCard.media = this.activeInnovCard.media.filter((_media) => _media._id !== media._id);
        this._cardContent = this.activeInnovCard.media;
        this._isSaving = false;
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.UPDATED_TEXT');
    }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isSaving = false;
        console.error(err);
    });
  }

  get activeInnovCard(): InnovCard {
    return InnovationFrontService.activeCard(this._innovation, this._activeCardIndex);
  }

  get operatorComment(): CardComment {
    return InnovationFrontService.cardOperatorComment(this.activeInnovCard, this._activeSection);
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
    if (value.animate_state === 'inactive') {
      this._activeSection = '';
    }
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

  set cardContent(value: any) {
    this._cardContent = value;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  get defaultSections(): Array<string> {
    return this._defaultSections;
  }

  get activeSection(): CardSections {
    return this._activeSection;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

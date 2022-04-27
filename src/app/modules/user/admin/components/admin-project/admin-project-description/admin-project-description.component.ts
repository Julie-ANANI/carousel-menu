import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ElementRef} from '@angular/core';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../../../models/innovation';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { CardSectionTypes, InnovCard, InnovCardSection } from '../../../../../../models/innov-card';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { CommonService } from '../../../../../../services/common/common.service';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { EtherpadFrontService } from '../../../../../../services/etherpad/etherpad-front.service';
import { MediaFrontService } from '../../../../../../services/media/media-front.service';
import {NotificationService} from '../../../../../../services/notification/notification.service';
import {NotificationJob} from '../../../../../../models/notification';
import {isPlatformBrowser} from '@angular/common';
import {UmiusConfigInterface, UmiusMediaInterface, UmiusModalMedia, UmiusVideoInterface} from '@umius/umi-common-component';
import {MediaService} from '../../../../../../services/media/media.service';

const he = require('he');

type modalType = 'NEW_SECTION' | 'DELETE_SECTION' | 'NOTIFY_TEAM' | '';

interface Toggle {
  title: boolean;
  summary: boolean;
  [property: string]: boolean;
}

@Component({
  templateUrl: './admin-project-description.component.html',
  styleUrls: ['./admin-project-description.component.scss'],
})

export class AdminProjectDescriptionComponent implements OnInit, OnDestroy {
  @ViewChild('slider') slider: ElementRef;

  get notificationJobs(): Array<NotificationJob> {
    return this._notificationJobs;
  }

  get isSendingNotification(): boolean {
    return this._isSendingNotification;
  }

  private _innovation: Innovation = <Innovation>{};

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _activeCardIndex = 0;

  private _isEditable = false;

  private _showModal = false;

  private _slideToShow: number = 0;

  private _mediaFitler: any[];

  private _displayUploadOverlay = false;

  private _mediaType: string;

  private _displayMediaSlider = false;

  private _editedMediaIndex: any = undefined;

  private _editedMediaId: string = null;

  private _isMediaAdjusted = false;

  private _mainContainerStyle: any;

  private _mainMediaContainerStyle: any;

  private _secondaryContainerStyle: any;

  private _isBeingEdited = false;

  private _modalType: modalType = '';

  private _newSection: InnovCardSection = <InnovCardSection>{};

  private _deleteSectionIndex: number = null;

  private _contentChanged = true;

  private _toggleComment: Toggle = {
    title: false,
    summary: false
  };

  private _toggleSuggestion: Toggle = {
    title: false,
    summary: false
  };

  private _showComment: Toggle = {
    title: false,
    summary: false
  };

  private _showSuggestion: Toggle = {
    title: false,
    summary: false
  };

  private _togglePreviewMode: Toggle = {
    title: true,
    summary: true
  };

  private _isSavingMedia = false;

  private _isEditableComment = false;

  private _isUploadingVideo = false;

  private _modalMedia = false;

  private _selectedMedia: UmiusModalMedia = <UmiusModalMedia>{};

  private _isSendingNotification = false;

  private _notificationJobs: Array<NotificationJob> = [];

  private _isFetchingJobs = true;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _innovationFrontService: InnovationFrontService,
              private _innovationService: InnovationService,
              private _notificationService: NotificationService,
              private _etherpadFrontService: EtherpadFrontService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _mediaService: MediaService) {
  }

  ngOnInit() {
    this._isEditable = this.canAccess(['edit', 'description']);
    this._innovation = this._innovationFrontService.innovation().value;
    this._getAllJobs();

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      if (innovation && innovation._id) {
        this._innovation = innovation;
        this._contentChanged = false;
        this._isEditableComment = this._isEditable && (this._innovation.status === 'SUBMITTED' || this._innovation.status === 'EDITING');
        this._initToggle();
      }
    });

    this._innovationFrontService.activeCardIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((index) => {
      if (index !== this._activeCardIndex) {
        this._activeCardIndex = index;
      }
    });

    console.log('all medias', this.activeInnovCard.media, 'main', this.activeInnovCard.principalMedia)

    if (this.activeInnovCard.principalMedia) {
      if (this.activeInnovCard.principalMedia.type !== 'VIDEO' && (this.activeInnovCard.principalMedia.cloudinary.width / this.activeInnovCard.principalMedia.cloudinary.height) < 4/3) {
        this._mainContainerStyle = {
          width: 'fit-content',
          height: '408px',
          'align-content': 'flex-start',
          'align-items': 'flex-start',
          'row-gap': '8px'
        };
        this._mainMediaContainerStyle = {
          width: '290px',
          height: '100%'
        };
        if (this.activeInnovCard.media.length > 1) {
          this._secondaryContainerStyle = {
            //'row-gap': '8px',
            'flex-direction': 'column',
            height: '100%',
            'padding-left': '8px'
          };
        }
      } else if (this.activeInnovCard.principalMedia.type === 'VIDEO' || (this.activeInnovCard.principalMedia.cloudinary.width / this.activeInnovCard.principalMedia.cloudinary.height) > 4/3) {
        this._mainContainerStyle = {
          width: '528px',
          height: 'auto',
          'place-items': 'center',
          'box-sizing': 'border-box',
          'column-gap': '8px'
        };
        this._mainMediaContainerStyle = {
          width: '100%',
          height: '290px'
        };
        if (this.activeInnovCard.media.length > 1) {
          this._secondaryContainerStyle = {
            //'column-gap': '8px',
            'flex-direction': 'row',
            width: '100%',
            'padding-top': '8px'
          };
        }
      }
      if (!this._isBeingEdited) {
        this._mainContainerStyle['background-color'] = 'white';
      }
    }


    this._mediaFitler = this.activeInnovCard.media.slice(1, 4);
  }

  private _getAllJobs() {
    if (isPlatformBrowser(this._platformId) && !this._notificationJobs.length && this._isFetchingJobs && this._innovation._id) {
      this._isFetchingJobs = false;

      const config: UmiusConfigInterface = {
        fields: 'updated',
        limit: '',
        offset: '0',
        search: '{"notification.trigger": "TRIGGER_COMMENT_SUGGESTION"}',
        innovationRef: this._innovation._id,
        sort: '{"updated": -1}'
      };

      this._notificationService.getAllJobs(config).pipe(first()).subscribe((response) => {
        this._notificationJobs = response && response.result || [];
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }
  }

  /**
   * this function is to register the notification job to send the
   * emails to the project team.
   * @param event
   */
  public onNotifyTeam(event: Event) {
    event.preventDefault();

    if (!this._isSendingNotification) {
      this._isSendingNotification = true;
      this._notificationService.registerJob(this._innovation, 'TRIGGER_COMMENT_SUGGESTION')
        .pipe(first()).subscribe((res) => {
          this.closeModal();
          this._translateNotificationsService.success('Success', res.message);
          this._isSendingNotification = false;
          this._notificationJobs.unshift(res.job);
          }, (err: HttpErrorResponse) => {
          this._isSendingNotification = false;
          this._translateNotificationsService.error('Notification Error...', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        });
    }
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project', 'settings'];
    return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
  }

  public remaining(property: CardSectionTypes, index?: number): string {
    switch (property) {

      case 'TITLE':
        return CommonService.getLimitColor(this.activeInnovCard.title, 100);

      case 'SUMMARY':
        return CommonService.getLimitColor(this.activeInnovCard.summary, 500);

      case 'ISSUE':
      case 'SOLUTION':
      case 'CONTEXT':
      case 'OTHER':
        return CommonService.getLimitColor(<string>this.activeInnovCard.sections[index].content, 1000);

    }

    return '';
  }

  private _initToggle() {
    this._toggleComment = {
      title: !!(this.activeInnovCard.operatorComment && this.activeInnovCard.operatorComment.title.comment),
      summary: !!(this.activeInnovCard.operatorComment && this.activeInnovCard.operatorComment.summary.comment)
    };

    this._toggleSuggestion = {
      title: !!(this.activeInnovCard.operatorComment && this.activeInnovCard.operatorComment.title.suggestion),
      summary: !!(this.activeInnovCard.operatorComment && this.activeInnovCard.operatorComment.summary.suggestion)
    };

    this._togglePreviewMode = {
      title: true,
      summary: true
    };

    for (let i = 0; i < this.activeInnovCard.sections.length; i++) {
      const etherpadElementId = this.activeInnovCard.sections[i].etherpadElementId;
      const operatorComment = this.activeInnovCard.operatorComment && this.activeInnovCard.operatorComment.sections
        ? this.activeInnovCard.operatorComment.sections.find(s => s.sectionId === etherpadElementId) : null;
      this._toggleComment[i] = (etherpadElementId && operatorComment && !!operatorComment.comment);
      this._toggleSuggestion[i] = (etherpadElementId && operatorComment && !!operatorComment.suggestion);
      this._togglePreviewMode[i] = true;
    }

  }

  public zoneData(property: string, type: 'comment' | 'suggestion', sectionType?: string, etherpadId?: string) {
    if (property !== 'sections') {
      return this.activeInnovCard.operatorComment && this.activeInnovCard.operatorComment[property]
      && this.activeInnovCard.operatorComment[property][type] ? this.activeInnovCard.operatorComment[property][type] : '';
    } else {
      if (this.activeInnovCard.operatorComment && this.activeInnovCard.operatorComment.sections
        && this.activeInnovCard.operatorComment.sections.length && (!!etherpadId || !!sectionType)) {
        const find = this._getOperatorComment(sectionType, etherpadId);
        if (!!find) {
          return find[type];
        }
      }

      return '';
    }
  }

  private _getOperatorComment(sectionType?: string, etherpadId?: string) {
    return this.activeInnovCard.operatorComment.sections.find((_comment) => {
      return !!etherpadId && !!_comment.sectionId ? (_comment.sectionId === etherpadId && sectionType === _comment.type)
        : (sectionType === _comment.type);
    });
  }

  private _getOperatorCommentIndex(sectionType?: string, etherpadId?: string) {
    return this.activeInnovCard.operatorComment.sections.findIndex((_comment) => {
      return !!etherpadId && !!_comment.sectionId ? (_comment.sectionId === etherpadId && sectionType === _comment.type)
        : (sectionType === _comment.type);
    });
  }

  public onToggleComment(event: Event, property: string) {
    this._toggleComment[property] = !this._toggleComment[property];
  }

  public onToggleSuggestion(event: Event, property: string) {
    this._toggleSuggestion[property] = !this._toggleSuggestion[property];
  }

  public onShowSuggestion(event: Event, property: string) {
    this._showSuggestion[property] = !this._showSuggestion[property];
  }

  public onShowComment(event: Event, property: string) {
    this._showComment[property] = !this._showComment[property];
  }

  /**
   *
   * @param event
   * @param property
   * @param type
   * @param sectionIndex
   * @param sectionType
   * @param etherpadId
   */
  public onCommentChange(event: { content: string }, property: string, type: 'comment' | 'suggestion',
                         sectionIndex?: number, sectionType?: string, etherpadId?: string) {
    if (property !== 'sections') {
      this.activeInnovCard.operatorComment[property][type] = event.content;
    } else {
      if (this.activeInnovCard.operatorComment.sections && this.activeInnovCard.operatorComment.sections.length
        && (!!etherpadId || !!sectionType)) {
        const index = this._getOperatorCommentIndex(sectionType, etherpadId);
        if (index !== -1) {
          this.activeInnovCard.operatorComment.sections[index][type] = event.content;
          this.activeInnovCard.operatorComment.sections[index].sectionId =
            this.activeInnovCard.operatorComment.sections[index].sectionId || etherpadId;
        }
      }
    }

    this.updateComment();
  }

  /**
   * now for the new custom section we use etherpadElementId property.
   * If it doesn't exist with use the old one we create one and assign to it..
   *
   * @param event
   * @param property
   * @param index
   */
  public onContentChange(event: { content: string }, property: string, index?: number) {
    // We save real string value, not encoded
    // So we decode the string first
    event.content = he.decode(event.content, {'isAttributeValue': false});
    if (property !== 'sections') {
      this.activeInnovCard[property] = event.content;
    } else {
      this.activeInnovCard.sections[index].content = event.content;
      this.activeInnovCard.sections[index].etherpadElementId = this.activeInnovCard.sections[index].etherpadElementId
        || this._etherpadFrontService.generateElementId(this.activeInnovCard.sections[index].type,
          this.activeInnovCard.lang);
    }
    this.updateInnovation();
    this._contentChanged = true;
  }

  public toggleVisibility(event: Event, index: number) {
    event.preventDefault();
    this.activeInnovCard.sections[index].visibility = !this.activeInnovCard.sections[index].visibility;
    this.updateInnovation();
  }

  public updateInnovation(autoSave = false) {
    this._innovationFrontService.setNotifyChanges({key: 'innovationCards', state: true, autoSave});
  }

  public updateComment() {
    this._innovationFrontService.setCardCommentNotifyChanges(true);
  }

  public toggleDisplayUploadOverlay(id?: string, type?: string) {
    this._displayUploadOverlay = !this._displayUploadOverlay;
    this._mediaType = type;
    this._editedMediaId = id;
  }

  public toggleDisplayMediaSlider(action?: string, index?: number) {
    if (action && index) {
      this.slideMedia('showSelected', index);
    }
    if (action === 'closeSlider') {
      this._slideToShow = 0;
    }
    this._displayMediaSlider = !this._displayMediaSlider;
  }

  public setEditedMediaIndex(index: any) {
    this._editedMediaIndex = index;
  }

  public adjustMedia(media: UmiusMediaInterface, action: string) {
    if (action === 'crop') {
      this._isMediaAdjusted = false;
    } else if (action === 'adjust') {
      this._isMediaAdjusted = true;
    }
  }

  public slideMedia(action: string, index?: number, event?: KeyboardEvent) {
    if (event && event.key === 'ArrowLeft') {
      action = 'showPrevious';
    } else if (event && event.key === 'ArrowRight') {
      action = 'showNext';
    }
    if (action === 'showSelected') {
      this._slideToShow = index;
    } else if (action === 'showPrevious') {
      if (!this.activeInnovCard.media[this._slideToShow-1]) {
        this._slideToShow = this.activeInnovCard.media.length-1;
      } else {
        this._slideToShow = this._slideToShow -1;
      }
    } else if (action === 'showNext') {
      if (!this.activeInnovCard.media[this._slideToShow + 1]) {
        this._slideToShow = 0;
      } else {
        this._slideToShow = this._slideToShow + 1;
      }
    }
  }

  private _updateMediaFilter() {
    if (this._isBeingEdited) {
      this._mediaFitler = this.activeInnovCard.media.slice(1, this.activeInnovCard.media.length);
    } else {
      this._mediaFitler = this.activeInnovCard.media.slice(1, 4);
    }
  }

  public editMedias() {
    this._isBeingEdited = !this._isBeingEdited;
    if (this.activeInnovCard.principalMedia) {
      this.activeInnovCard.principalMedia.isMediaAdjusted = this._isMediaAdjusted;
      if (!this._isBeingEdited && this.activeInnovCard.principalMedia) {
        this._mediaService.update(this.activeInnovCard.principalMedia.id, this.activeInnovCard.principalMedia).subscribe((data: any) => {
          console.log(data);
        }, (err: HttpErrorResponse) => {
          console.error(err);
        });
      }
      this._isMediaAdjusted = false;
      this._updateMediaFilter();
    }
    if (!this._isBeingEdited) {
      this._mainContainerStyle['background-color'] = 'white';
    } else {
      this._mainContainerStyle['background-color'] = 'transparent';
    }
  }

  public openModal(event: Event, type: modalType, index?: number) {
    event.preventDefault();
    this._modalType = type;
    switch (type) {

      case 'NOTIFY_TEAM':
        this._showModal = true;
        break;

      case 'NEW_SECTION':
        this._newSection = {
          title: 'New section',
          content: '',
          visibility: true,
          type: 'OTHER',
          etherpadElementId: this._etherpadFrontService.generateElementId('OTHER', this.activeInnovCard.lang)
        };
        this._showModal = true;
        break;

      case 'DELETE_SECTION':
        this._deleteSectionIndex = index;
        this._showModal = true;
        break;

    }
  }

  public closeModal() {
    this._showModal = false;
  }

  public createNewSection(event: Event) {
    event.preventDefault();
    this.activeInnovCard.sections.push(this._newSection);
    const _comment = {
      comment: '',
      suggestion: '',
      type: this._newSection.type,
      sectionId: this._newSection.etherpadElementId
    };
    this.activeInnovCard.operatorComment.sections.push(_comment);
    this._newSection = <InnovCardSection>{};
    this._initToggle();
    this.closeModal();
    this.updateInnovation();
    this.updateComment();
  }

  public deleteSection(event: Event) {
    event.preventDefault();
    this.activeInnovCard.sections.splice(this._deleteSectionIndex, 1);

    if (this.activeInnovCard.operatorComment && this.activeInnovCard.operatorComment.sections) {
      this.activeInnovCard.operatorComment.sections.splice(this._deleteSectionIndex, 1);
    }

    this._deleteSectionIndex = null;
    this._initToggle();
    this.closeModal();
    this.updateInnovation();
    this.updateComment();
  }

  public uploadImage(media: UmiusMediaInterface): void {
    if (this._editedMediaIndex !== undefined) { // check if we are editing a media or not
      if (this._editedMediaIndex === 0) { // check of the edited media is the main media
        this.activeInnovCard.principalMedia = media;
        this.onSetPrincipal(media);
      }
      this.activeInnovCard.media[this._editedMediaIndex] = media;
    } else {
      this.activeInnovCard.media.push(media);
      if (!this._innovation.innovationCards[this._activeCardIndex].principalMedia) {
        this._innovation.innovationCards[this._activeCardIndex].principalMedia = media;
        this.onSetPrincipal(media);
      }
    }
    if (this.activeInnovCard.principalMedia.type !== 'VIDEO' && ((this.activeInnovCard.principalMedia.cloudinary.width / this.activeInnovCard.principalMedia.cloudinary.height) < 4/3) && this.activeInnovCard.media.length > 1) {
        this._secondaryContainerStyle = {
          'flex-direction': 'column',
          height: '100%',
          'padding-left': '8px'
        };
    } else if (this.activeInnovCard.principalMedia.type === 'VIDEO' || ((this.activeInnovCard.principalMedia.cloudinary.width / this.activeInnovCard.principalMedia.cloudinary.height) > 4/3) && this.activeInnovCard.media.length > 1) {
        this._secondaryContainerStyle = {
          'flex-direction': 'row',
          width: '100%',
          'padding-top': '8px'
        };
      }

    this._updateMediaFilter();
    this._emitUpdatedInnovation();
    this._translateNotificationsService.success('Success', 'The media has been uploaded.');
    this.toggleDisplayUploadOverlay();
  }

  public uploadVideo(video: UmiusVideoInterface): void {
    this._isUploadingVideo = true;
    if (this._editedMediaIndex !== undefined) {
      this._innovationService.updateVideo(this._innovation._id, this._innovation.innovationCards[this._activeCardIndex]._id, this._innovation.innovationCards[this._activeCardIndex].principalMedia.id, video).pipe(first())
        .subscribe((res) => {
          console.log(res)
        }, (err: HttpErrorResponse) => {
          this._isUploadingVideo = false;
          this._translateNotificationsService.error('Media Uploading Error...', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        });
    }
    this._innovationService.addNewMediaVideoToInnovationCard(this._innovation._id,
      this._innovation.innovationCards[this._activeCardIndex]._id, video)
      .pipe(first())
      .subscribe((res) => {
        this._isUploadingVideo = false;
        if (this._editedMediaIndex !== undefined) {
          if (this._editedMediaIndex === 0) {
            this.activeInnovCard.principalMedia = res;
            this.onSetPrincipal(res);
          }
          this.activeInnovCard.media[this._editedMediaIndex] = res;
        } else {
          this.activeInnovCard.media.push(res);
          this._updateMediaFilter();
        }
        if (!this._innovation.innovationCards[this._activeCardIndex].principalMedia) {
          this.onSetPrincipal(res);
        }
        this._emitUpdatedInnovation();
        this._translateNotificationsService.success('Success', 'The media has been uploaded.');
        this.toggleDisplayUploadOverlay();
      }, (err: HttpErrorResponse) => {
        this._isUploadingVideo = false;
        this._translateNotificationsService.error('Media Uploading Error...', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
  }

  public onSetPrincipal(media: UmiusMediaInterface, index?: number) {
    if (media.type !== 'VIDEO' && (media.cloudinary.width / media.cloudinary.height) < 4/3) {
      this._mainContainerStyle = {
        width: 'fit-content',
        height: '408px',
        'align-content': 'flex-start',
        'align-items': 'flex-start',
        'row-gap': '8px'
      };
      this._mainMediaContainerStyle = {
        width: '290px',
        height: '100%'
      };
      if (this.activeInnovCard.media.length > 1) {
        this._secondaryContainerStyle = {
          //'row-gap': '8px',
          'flex-direction': 'column',
          height: '100%',
          'padding-left': '8px'
        };
      }
    } else if (media.type === 'VIDEO' || (media.cloudinary.width / media.cloudinary.height) > 4/3) {
      this._mainContainerStyle = {
        width: '528px',
        height: 'auto',
        'place-items': 'center',
        'box-sizing': 'border-box',
        'column-gap': '8px'
      };
      this._mainMediaContainerStyle = {
        width: '100%',
        height: '290px'
      };
      if (this.activeInnovCard.media.length > 1) {
        this._secondaryContainerStyle = {
          //'column-gap': '8px',
          'flex-direction': 'row',
          width: '100%',
          'padding-top': '8px'
        };
      }
    }

    if (!this._isSavingMedia) {
      this._isSavingMedia = true;
      // delete video if main media was a video because videos can't be secondary medias
      if (this.activeInnovCard.principalMedia && this.activeInnovCard.principalMedia.type === 'VIDEO' && media.type !== 'VIDEO') {
        const mainVideoId = this.activeInnovCard.principalMedia._id;
        this._innovationService.deleteMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, mainVideoId)
          .pipe(first())
          .subscribe(() => {
            this.activeInnovCard.media = this.activeInnovCard.media.filter((_media) => _media._id !== mainVideoId);
            this._innovation.innovationCards[this._activeCardIndex].media = this.activeInnovCard.media;
            this._updateMediaFilter(); // Mise à jour de la liste des medias filtrés
            console.log('medias left', this.activeInnovCard.media);
            this._translateNotificationsService.success('Success', 'The video has been deleted.');
          }, (err: HttpErrorResponse) => {
            this._translateNotificationsService.error('Media Deleting Error...', ErrorFrontService.getErrorKey(err.error));
            this._isSavingMedia = false;
            console.error(err);
          });
      }
      this._innovationService.setPrincipalMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, media._id)
        .pipe(first())
        .subscribe(() => {
          this._isSavingMedia = false;
          // when a secondary media is set as main media, switch their places in the medias array
          if (index) {
          this.activeInnovCard.media[index] = this.activeInnovCard.principalMedia;
          this.activeInnovCard.media[0] = media;
          }
          this.activeInnovCard.principalMedia = media;
          this._emitUpdatedInnovation();
          this._translateNotificationsService.success('Success', 'The media has been set as a principal media.');
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Principal Media Error...', ErrorFrontService.getErrorKey(err.error));
          this._isSavingMedia = false;
          console.error(err);
        });
    }
  }

  private _emitUpdatedInnovation() {
    this._innovationFrontService.setInnovation(this._innovation);
  }

  public onDeleteMedia(media: UmiusMediaInterface) {
    if (!this._isSavingMedia) {
      this._isSavingMedia = true;
      this._innovationService.deleteMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, media._id)
        .pipe(first())
        .subscribe(() => {
          this.activeInnovCard.media = this.activeInnovCard.media.filter((_media) => _media._id !== media._id);
          this._innovation.innovationCards[this._activeCardIndex].media = this.activeInnovCard.media;
          this._emitUpdatedInnovation();
          this._updateMediaFilter(); // Mise à jour de la liste des medias filtrées
          this._isSavingMedia = false;
          this._verifyPrincipal(media);
          this._translateNotificationsService.success('Success', 'The media has been deleted.');
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Media Deleting Error...', ErrorFrontService.getErrorKey(err.error));
          this._isSavingMedia = false;
          console.error(err);
        });
    }
  }

  /***
   * if we already set the deleted media as principal media then we set the next media as principal media and if no media
   * available then set principal media null
   * @private
   */
  private _verifyPrincipal(deleteMedia: UmiusMediaInterface) {
    if (this.activeInnovCard.media.length === 0 && this.activeInnovCard.principalMedia && this.activeInnovCard.principalMedia._id) {
      this._innovation.innovationCards[this._activeCardIndex].principalMedia = null;
      this._emitUpdatedInnovation();
    } else if (this.activeInnovCard.principalMedia && this.activeInnovCard.principalMedia._id === deleteMedia._id
      && this.activeInnovCard.media && this.activeInnovCard.media[0]) {
      this.onSetPrincipal(this.activeInnovCard.media[0]);
    }
  }

  public mediaSrc(media: UmiusMediaInterface, type: 'IMAGE' | 'VIDEO') {
    if (media && type === 'IMAGE') {
       if (media.url) {
        return media.url + '?a=' + Math.floor(Math.random() * 999999).toString();
      } else {
        return MediaFrontService.imageSrc(media);
      }
      //return MediaFrontService.imageSrc(media);
    } else if (media && type === 'VIDEO') {
      return this._innovationFrontService.videoSrc(media);
    }
}


  public getPadPreviewMode(value: string) {
    return this._togglePreviewMode[value];
  }

  public isNotMainMedia(media: any): boolean {
    if (this.activeInnovCard.principalMedia && this.activeInnovCard.principalMedia._id && media && media['_id']) {
      return this.activeInnovCard.principalMedia._id !== media['_id'];
    }
    return true;
  }

  padPreviewModeOnChange(title: string) {
    this._togglePreviewMode[title] = !this._togglePreviewMode[title];
    this._isBeingEdited = !this._isBeingEdited;
    if(this._togglePreviewMode[title] && this._contentChanged){
      this.updateInnovation(true)
    }
  }

  mediaToShow(mediaSrc: any) {
    this._modalMedia = true;
    this._selectedMedia = {
      active: true,
      src: mediaSrc
    };
  }

  get activeInnovCard(): InnovCard {
    return InnovationFrontService.activeCard(this._innovation, this._activeCardIndex);
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get displayUploadOverlay(): boolean {
    return this._displayUploadOverlay;
  }

  get displayMediaSlider(): boolean {
    return this._displayMediaSlider;
  }

  get mediaFilter(): Array<UmiusMediaInterface> {
    return this._mediaFitler;
  }

  get slideToShow(): number {
    return this._slideToShow;
  }

  get mainContainerStyle(): any {
    return this._mainContainerStyle;
  }

  get mainMediaContainerStyle(): any {
    return this._mainMediaContainerStyle;
  }

  get secondaryContainerStyle(): any {
    return this._secondaryContainerStyle;
  }

  get mediaType(): string {
    return this._mediaType;
  }

  get modalType(): modalType {
    return this._modalType;
  }

  get newSection(): InnovCardSection {
    return this._newSection;
  }

  get toggleComment(): Toggle {
    return this._toggleComment;
  }

  get toggleSuggestion(): Toggle {
    return this._toggleSuggestion;
  }

  get isSavingMedia(): boolean {
    return this._isSavingMedia;
  }

  get isEditableComment(): boolean {
    return this._isEditableComment;
  }

  get isUploadingVideo(): boolean {
    return this._isUploadingVideo;
  }

  get currentLang(): string {
    return this.activeInnovCard.lang;
  }


  get modalMedia(): boolean {
    return this._modalMedia;
  }

  set modalMedia(value: boolean) {
    this._modalMedia = value;
  }

  get editedMediaIndex(): any {
    return this._editedMediaIndex;
  }

  get editedMediaId(): string {
    return this._editedMediaId;
  }

  get selectedMedia(): UmiusModalMedia {
    return this._selectedMedia;
  }

  get showComment(): Toggle {
    return this._showComment;
  }

  get showSuggestion(): Toggle {
    return this._showSuggestion;
  }

  get isBeingEdited(): boolean {
    return this._isBeingEdited;
  }

  get isMediaAdjusted(): boolean {
    return this._isMediaAdjusted;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { PitchHelpFields } from '../../../../models/static-data/project-pitch';
import { CommonService } from '../../../../services/common/common.service';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import {CardComment, CardSectionTypes} from '../../../../models/innov-card';
import { CollaborativeComment } from '../../../../models/collaborative-comment';
import { picto } from '../../../../models/static-data/picto';
import {first, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SocketService } from '../../../../services/socket/socket.service';
import { EtherpadFrontService } from '../../../../services/etherpad/etherpad-front.service';
import { MediaFrontService } from '../../../../services/media/media-front.service';
import {UmiusMediaInterface, UmiusModalMedia, UmiusVideoInterface} from '@umius/umi-common-component';
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorFrontService} from "../../../../services/error/error-front.service";
import { InnovationService } from '../../../../services/innovation/innovation.service';
import {TranslateNotificationsService} from "../../../../services/translate-notifications/translate-notifications.service";
import {Innovation} from "../../../../models/innovation";
// import {HttpErrorResponse} from "@angular/common/http";

/***
 * It involves the edition of the Innovation Card fields.
 *
 * Inputs:
 * 1. isSaving: to disabled/enabled the save button when the parent component
 * is saving the project in the back.
 * 2. imagePostUri: url to save the image media.
 * 3. mainMedia: principal media of the card.
 * 4. pitchHelp: based on the mission objective pass the help/example for the different
 * Type.
 * 5. comment: pass the UMI team comment and suggestion to show.
 * 6. cardContent: can be of any type like 'string' | 'Array<Media>'.
 * 7. type: based on it we show the template and the functionality. They are
 * 'TITLE' | 'SUMMARY' | 'ISSUE' | 'SOLUTION' | 'MEDIA'.
 * 8. isEditable: possibility to edit the card field.
 *
 * Outputs:
 * 1. saveProject: format: {type: string, content: any}. You receive the object in the parent component
 * and based on the type ('TITLE' | 'SUMMARY' | 'ISSUE' | 'SOLUTION' | 'IMAGE' | 'VIDEO' | 'MAIN_MEDIA' | 'DELETE_MEDIA')
 * you can perform the logic. The type are passed based on the functionality used in the sidebar.
 * 2. isSavingChange: to listen in the parent component to execute the functionality and disabled the Save button in
 * the sidebar.
 * 3. tobeSavedChanges: there are some changes to be saved before closing sidebar.
 */

@Component({
  selector: 'app-sidebar-project-pitch',
  templateUrl: './sidebar-project-pitch.component.html',
  styleUrls: ['./sidebar-project-pitch.component.scss']
})

export class SidebarProjectPitchComponent implements OnInit, OnChanges, OnDestroy {

  @Input() set isSaving(value: boolean) {
    this._isSaving = value;
    if (!this._isSaving && this._toBeSaved) {
      this._toBeSaved = false;
    }
  }

  @Input() isUploadingVideo = false;

  @Input() isEditable = false;

  @Input() imagePostUri = '';

  @Input() mainMedia: UmiusMediaInterface = <UmiusMediaInterface>{};

  @Input() pitchHelp: PitchHelpFields = <PitchHelpFields>{};

  @Input() set comment(value: CardComment) {
    this._comment = value;
    if (this._comment && (this._comment.comment || this._comment.suggestion)) {
      this._showComment = !!this._comment.comment;
      this._showSuggestion = !!this._comment.suggestion;
      this._showExample = false;
      this._showHelp = false;
    }
  }

  @Input() set collaborativesComments(value: CollaborativeComment[]) {
    this._collaborativesComments = value;
    this._showComment = true;
    this._showSuggestion = !!this._comment.suggestion;
    this._showExample = false;
    this._showHelp = false;
  }

  @Input() innovationId: string;
  @Input() activeInnovCardId: string;
  @Input() activeCardIndex: number;
  @Input() innovation: Innovation;
  @Input() sectionId: string;

  @Input() cardContent: any = '';

  @Input() inputFromParent: any;

  @Output() newCardContent : EventEmitter<[]> = new EventEmitter();
  content : [] = this.cardContent;

  @Output() mediaIndex = new EventEmitter<number>();

  @Output() saveAdjustedMedia =  new EventEmitter<boolean>();

  // 'TITLE' | 'SUMMARY' | 'ISSUE' | 'SOLUTION' | 'MEDIA' | 'OTHER' | 'CONTEXT'
  @Input() type: CardSectionTypes = '';

  @Output() saveProject: EventEmitter<{ type: string, content: any }> = new EventEmitter<{ type: string, content: any }>();

  @Output() isSavingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() tobeSavedChanges: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _comment: CardComment = <CardComment>{};

  private _collaborativesComments: CollaborativeComment[] = [];

  private _isSaving = false;

  private _showHelp = true;

  private _showExample = true;

  private _showComment = false;

  private _showSuggestion = false;

  private _toBeSaved = false;

  private _badgeUmi = picto.badgeUmi;

  private _padID: string;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _modalMedia = false;

  private _selectedMedia: UmiusModalMedia = <UmiusModalMedia>{};

  private _mainContainerStyle: any;

  private _mainMediaContainerStyle: any;

  private _secondaryContainerStyle: any;

  private _mediaFitler: any[];

  private _displayUploadOverlay = false;

  private _isMediaAdjusted = false;

  private _editedMediaIndex: any = undefined;

  private _editedMediaId: string = null;

  private _updateMediaFilter() {
    this._mediaFitler = this.cardContent.slice(1, 4);
  }

  constructor(private _innovationFrontService: InnovationFrontService,
              private _etherpadFrontService: EtherpadFrontService,
              private _socketService: SocketService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  ngOnInit(): void {
    // Listen on save from another user

    // If there is comment or suggestion, we hide help/example section by default
    // If there is no comment and no suggestion, we display help/example section by default;
    this._showHelp = !((this.collaborativesComments && this.collaborativesComments.length > 0)
      || (this.comment && this.comment.comment)
      || this.comment && this.comment.suggestion);

    this._showExample = !((this.collaborativesComments && this.collaborativesComments.length > 0)
      || (this.comment && this.comment.comment)
      || this.comment && this.comment.suggestion);
    this._socketService.getProjectFieldUpdates(this.innovationId, 'innovationCards')
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(() => {
        this._toBeSaved = false;
      }, (error) => {
        console.error(error);
      });

    if (this.cardContent[0]) {
      if (this.cardContent[0].type !== 'VIDEO' && (this.cardContent[0].cloudinary.width / this.cardContent[0].cloudinary.height) < 4/3) {
        this._mainContainerStyle = {
          width: 'fit-content',
          height: '408px',
          'align-content': 'flex-start',
          'align-items': 'flex-start',
          'column-gap': '8px'
        };
        this._mainMediaContainerStyle = {
          width: '290px',
          height: '100%'
        };
        if (this.cardContent.length > 1) {
          this._secondaryContainerStyle = {
            'flex-direction': 'column',
            height: '100%',
            'row-gap': '8px'
            //'padding-left': '8px'
          };
        }
      } else if (this.cardContent[0].type === 'VIDEO' || (this.cardContent[0].cloudinary.width / this.cardContent[0].cloudinary.height) > 4/3) {
        this._mainContainerStyle = {
          width: '528px',
          height: 'auto',
          'place-items': 'center',
          'box-sizing': 'border-box',
          'row-gap': '8px'
        };
        this._mainMediaContainerStyle = {
          width: '100%',
          height: '290px'
        };
        if (this.cardContent.length > 1) {
          this._secondaryContainerStyle = {
            'flex-direction': 'row',
            width: '100%',
            'column-gap': '8px'
            //'padding-top': '8px'
          };
        }
      }
      this._mediaFitler = this.cardContent.slice(1, 4);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.type && changes.type.currentValue !== changes.type.previousValue) {
      this.cardContent = changes.cardContent && changes.cardContent.currentValue || '';
      this._isSaving = false;
      this._toBeSaved = false;
      this._padID = this._etherpadFrontService.buildPadID('pitch', this.sectionId);
    }
  }


  /*public addNewMedia(uploadedMedia: UmiusMediaInterface): void {
    if (this.cardContent.length > 0) {
      if (this._editedMediaIndex > 0) { // we are editing a secondary media
        console.log(1)
        this.cardContent[this._editedMediaIndex] = uploadedMedia;
      } else if (this._editedMediaIndex === undefined) { // we are creating a secondary media
        console.log(2)
        this.cardContent.push(uploadedMedia);
      } else if (this._editedMediaIndex === 0) {
        console.log(3)
        this.cardContent[0] = uploadedMedia;
        this.onSetPrincipal(uploadedMedia);
      }
    } else if (!this.cardContent.length || this._editedMediaIndex === 0){  // there are no main media or the main media is being edited
      console.log(4)
      this.cardContent[0] = uploadedMedia;
      this.onSetPrincipal(uploadedMedia);
    }

    console.log('medias', this.cardContent)

    this._updateMediaFilter();
    console.log('media filter', this.mediaFilter)
    this.isSavingChange.emit(true);
    const mediaType = (uploadedMedia.type === 'PHOTO') ? 'IMAGE' : 'VIDEO';
    this.saveProject.emit({type: mediaType, content: uploadedMedia});
    //this._emitUpdatedInnovation();
    //this._translateNotificationsService.success('Success', 'The new media has been added.');
    this.toggleDisplayUploadOverlay();

    if (this.cardContent[0].type !== 'VIDEO' && ((this.cardContent[0].cloudinary.width / this.cardContent[0].cloudinary.height) < 4/3) && this.cardContent.length > 1) {
      this._secondaryContainerStyle = {
        'flex-direction': 'column',
        height: '100%',
        'padding-left': '8px'
      };
    } else if (this.cardContent[0].type === 'VIDEO' || ((this.cardContent[0].cloudinary.width / this.cardContent[0].cloudinary.height) > 4/3) && this.cardContent.length > 1) {
      this._secondaryContainerStyle = {
        'flex-direction': 'row',
        width: '100%',
        'padding-top': '8px'
      };
    }
  }*/

  /***
   * when the user clicks on the Save button
   * @param event
   */
  public onSave(event: Event) {
    event.preventDefault();
    if (this.isEditable) {
      this.tobeSavedChanges.emit(false);
      this.isSavingChange.emit(true);
      this.saveProject.emit({type: this.type, content: this.cardContent});
    }
  }

  /***
   * when we change the value of the form-input or text-zone.
   */
  public onChangeValue() {
    if (this.isEditable) {
      this.tobeSavedChanges.emit(true);
      this._toBeSaved = true;
    }
  }

  /***
   * when the user writes in the text-zone to edit the text.
   * @param event
   */
  public onTextChange(event: { content: string }) {
    if (this.isEditable) {
      this.cardContent = event.content;
      this.onChangeValue();
    }
  }

  /***
   * when the user upload Image or Video.
   * @param media
   * @param type
   */
  public onUploadMedia(media: UmiusMediaInterface | UmiusVideoInterface, type: 'IMAGE' | 'VIDEO') {
    if (media && type && this.isEditable) {
      this.isSavingChange.emit(true);
      this.saveProject.emit({type: type, content: media});
    }
    if (this._editedMediaIndex === 0 || this._editedMediaIndex > 0) {
      this.cardContent[this._editedMediaIndex] = media;
    }
    this.toggleDisplayUploadOverlay();
    this._updateMediaFilter();
    if (type !== 'VIDEO' && (this.cardContent[0]['cloudinary'].width / this.cardContent[0]['cloudinary'].height) < 4/3) {
      this._mainContainerStyle = {
        width: 'fit-content',
        height: '408px',
        'align-content': 'flex-start',
        'align-items': 'flex-start',
        'column-gap': '8px'
      };
      this._mainMediaContainerStyle = {
        width: '290px',
        height: '100%'
      };
      if (this.cardContent.length > 1) {
        this._secondaryContainerStyle = {
          'flex-direction': 'column',
          height: '100%',
          'row-gap': '8px'
        };
      }
    } else if (type === 'VIDEO' || (this.cardContent[0]['cloudinary'].width / this.cardContent[0]['cloudinary'].height) > 4/3) {
      this._mainContainerStyle = {
        width: '528px',
        height: 'auto',
        'place-items': 'center',
        'box-sizing': 'border-box',
        'row-gap': '8px'
      };
      this._mainMediaContainerStyle = {
        width: '100%',
        height: '290px'
      };
      if (this.cardContent.length > 1) {
        this._secondaryContainerStyle = {
          'flex-direction': 'row',
          width: '100%',
          'column-gap': '8px'
        };
      }
    }

  }

  /***
   * to get the Image or Video source for the respective media. TODO
   * @param media
   * @param type
   */
  public mediaSrc(media: any, type: 'IMAGE' | 'VIDEO') {
    if (media && type === 'IMAGE') {
      return MediaFrontService.imageSrc(media);
    } else if (media && type === 'VIDEO') {
      return this._innovationFrontService.videoSrc(media);
    }
  }

  /***
   * checking the media shown is not the main media.
   * @param media
   */
  public isNotMainMedia(media: any): boolean {
    if (this.mainMedia && this.mainMedia._id && media && media['_id']) {
      return this.mainMedia._id !== media['_id'];
    }
    return true;
  }

  /***
   * when the user clicks on the Set as main media button to set the media as a main media
   * @param media
   */

  public updateCardContent() {
    this.content = this.cardContent;
    this.newCardContent.emit(this.content);
  }

  public onSetPrincipal(media: UmiusMediaInterface, index?: number) {
    if (media.type !== 'VIDEO' && (media.cloudinary.width / media.cloudinary.height) < 4/3) {
      this._mainContainerStyle = {
        width: 'fit-content',
        height: '408px',
        'align-content': 'flex-start',
        'align-items': 'flex-start',
        'column-gap': '8px'
      };
      this._mainMediaContainerStyle = {
        width: '290px',
        height: '100%'
      };
      if (this.cardContent.length > 1) {
        this._secondaryContainerStyle = {
          'row-gap': '8px',
          'flex-direction': 'column',
          height: '100%',
          //'padding-left': '8px'
        };
      }
    } else if (media.type === 'VIDEO' || (media.cloudinary.width / media.cloudinary.height) > 4/3) {
      this._mainContainerStyle = {
        width: '528px',
        height: 'auto',
        'place-items': 'center',
        'box-sizing': 'border-box',
        'row-gap': '8px'
      };
      this._mainMediaContainerStyle = {
        width: '100%',
        height: '290px'
      };
      if (this.cardContent.length > 1) {
        this._secondaryContainerStyle = {
          'column-gap': '8px',
          'flex-direction': 'row',
          width: '100%',
          //'padding-top': '8px'
        };
      }
    }

      this._innovationService.setPrincipalMediaOfInnovationCard(this.innovationId, this.activeInnovCardId, media._id, index)
        .pipe(first())
        .subscribe((data: any) => {
         /* if (index) {   // when a secondary media is set as main media, switch their places in the medias array
            this.cardContent[0] = media; // place new media at index 0
            // delete video if main media was a video because videos can't be secondary medias
            if (this.mainMedia && this.mainMedia.type === 'VIDEO' && media.type !== 'VIDEO') {
              const mainVideoId = this.mainMedia._id;
              this._innovationService.deleteMediaOfInnovationCard(this.innovationId, this.activeInnovCardId, mainVideoId)
                .pipe(first())
                .subscribe(() => {*/
                  const previousMainMedia = this.mainMedia;
                  this.cardContent = data.innovationCards[0].media;
                  this.mainMedia = media;
                  this._updateMediaFilter();
                  this.updateCardContent();
                  this.isSavingChange.emit(true);
                  this.saveProject.emit({type: 'MAIN_MEDIA', content: <UmiusMediaInterface>media});
                  this._translateNotificationsService.success('Success', 'The media has been set as a principal media.');
                  if (previousMainMedia['type'] === 'VIDEO' && media['type'] !== 'VIDEO') {
                    this._translateNotificationsService.success('Success', 'The video has been deleted.');
                  }
                 /* this.cardContent = this.cardContent.filter((_media: UmiusMediaInterface) => _media._id !== mainVideoId);
                  this.cardContent.splice(index, 1);
                  this.innovation.innovationCards[this.activeCardIndex].media = this.cardContent;
                  this._translateNotificationsService.success('Success', 'The video has been deleted.');
                }, (err: HttpErrorResponse) => {
                  this._translateNotificationsService.error('Media Deleting Error...', ErrorFrontService.getErrorKey(err.error));
                  console.error(err);
                });*/
           /* } else {
              this.cardContent[index] = this.cardContent[0];
            }
          }
          this.cardContent[0] = media;
          this._updateMediaFilter();
          this.isSavingChange.emit(true);
          this.saveProject.emit({type: 'MAIN_MEDIA', content: <UmiusMediaInterface>media});
          //this._emitUpdatedInnovation();
          this._translateNotificationsService.success('Success', 'The media has been set as a principal media.');*/
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('Principal Media Error...', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        });
    }

  /*public onSetPrincipal(media: any, index?: number) {
    if (media && this.isNotMainMedia(media) && !this._isSaving && this.isEditable) {
      const previousMainMedia = this.cardContent[0];
      this.cardContent[0] = media;
      this.cardContent[index] = previousMainMedia;
      this.isSavingChange.emit(true);
      this.saveProject.emit({type: 'MAIN_MEDIA', content: <UmiusMediaInterface>media});
      if (media.type !== 'VIDEO' && (media.cloudinary.width / media.cloudinary.height) < 4/3) {
        this._mainContainerStyle = {
          width: 'fit-content',
          height: '408px',
          'align-content': 'flex-start',
          'align-items': 'flex-start',
          'gap': '8px'
        };
        this._mainMediaContainerStyle = {
          width: '290px',
          height: '100%'
        };
        if (this.cardContent.length > 1) {
          this._secondaryContainerStyle = {
            'flex-direction': 'column',
            height: '100%',
          };
        }
      } else if (media.type === 'VIDEO' || (media.cloudinary.width / media.cloudinary.height) > 4/3) {
        this._mainContainerStyle = {
          width: '528px',
          height: 'auto',
          'place-items': 'center',
          'box-sizing': 'border-box',
          'gap': '8px'
        };
        this._mainMediaContainerStyle = {
          width: '100%',
          height: '290px'
        };
        if (this.cardContent.length > 1) {
          this._secondaryContainerStyle = {
            'flex-direction': 'row',
            width: '100%',
          };
        }
      }
    }
  }*/

  /***
   * when the user clicks on the Delete media button
   * @param media
   */
  public onDeleteMedia(media: any) {
    if (media && !this._isSaving && this.isEditable) {
      this.isSavingChange.emit(true);
      this.saveProject.emit({type: 'DELETE_MEDIA', content: <UmiusMediaInterface>media});
    }
    this.cardContent = this.cardContent.filter((_media:UmiusMediaInterface) => _media.id !== media.id)
  }

  /***
   * to toggle the different sections
   * @param event
   * @param type
   */
  public toggle(event: Event, type: string) {
    event.preventDefault();
    switch (type) {

      case 'HELP':
        this._showHelp = !this._showHelp;
        break;

      case 'COMMENT':
        this._showComment = !this._showComment;
        break;

      case 'SUGGESTION':
        this._showSuggestion = !this._showSuggestion;
        break;

      case 'EXAMPLE':
        this._showExample = !this._showExample;
        break;

    }
  }

  /***
   * returns the character limit and color of the field
   * @param type
   */
  public remaining(type: string): any {
    if (this.type && type) {
      switch (this.type) {

        case 'TITLE':
          if (type === 'COLOR') {
            return CommonService.getLimitColor(this.cardContent, 100);
          } else if (type === 'CHAR') {
            return 100;
          }
          break;

        case 'SUMMARY':
          if (type === 'COLOR') {
            return CommonService.getLimitColor(this.cardContent, 500);
          } else if (type === 'CHAR') {
            return 500;
          }
          break;


        case 'ISSUE':
        case 'SOLUTION':
        case 'CONTEXT':
        case 'OTHER':
          if (type === 'COLOR') {
            return CommonService.getLimitColor(this.cardContent, 500);
          } else if (type === 'CHAR') {
            return 1000;
          }
          break;

      }
    }

    return '';
  }

  mediaToShow(mediaSrc: any) {
    this._modalMedia = true;
    this._selectedMedia = {
      src: mediaSrc,
      active: true
    };
  }

  public toggleDisplayUploadOverlay(id?: string, type?: string) {
    this._displayUploadOverlay = !this._displayUploadOverlay;
    //this._mediaType = type;
    this._editedMediaId = id;
  }

  public adjustMedia(media: UmiusMediaInterface, action: string) {
    if (action === 'crop') {
      this._isMediaAdjusted = false;
      this.saveAdjustedMedia.emit(false);
    } else if (action === 'adjust') {
      this._isMediaAdjusted = true;
      this.saveAdjustedMedia.emit(true);
    }
    this.cardContent[0].isMediaAdjusted = this._isMediaAdjusted;
    /* if (!this._isBeingEdited && this.activeInnovCard.principalMedia) {
       this._mediaService.update(this.activeInnovCard.principalMedia.id, this.activeInnovCard.principalMedia).subscribe((data: any) => {
         console.log(data);
       }, (err: HttpErrorResponse) => {
         console.error(err);
       });
     }*/
  }

  public setEditedMediaIndex(index: any) {
    this._editedMediaIndex = index;
    this.mediaIndex.emit(index);
  }


  public help(type: string): string {
    if (this.pitchHelp && this.type) {
      switch (this.type) {

        case 'TITLE':
          if (type === 'TEXT') {
            return this.pitchHelp.title;
          } else if (type === 'EXAMPLE') {
            return this.pitchHelp.example.title;
          }
          break;

        case 'SUMMARY':
          if (type === 'TEXT') {
            return this.pitchHelp.summary;
          } else if (type === 'EXAMPLE') {
            return this.pitchHelp.example.summary;
          }
          break;

        case 'ISSUE':
          if (type === 'TEXT') {
            return this.pitchHelp.issue;
          } else if (type === 'EXAMPLE') {
            return this.pitchHelp.example.issue;
          }
          break;

        case 'SOLUTION':
          if (type === 'TEXT') {
            return this.pitchHelp.solution;
          } else if (type === 'EXAMPLE') {
            return this.pitchHelp.example.solution;
          }
          break;

        case 'CONTEXT':
          if (type === 'TEXT') {
            return this.pitchHelp.context;
          } else if (type === 'EXAMPLE') {
            return this.pitchHelp.example.issue;
          }
          break;

      }
    }
    return '';
  }

  get comment(): CardComment {
    return this._comment;
  }

  get collaborativesComments(): CollaborativeComment[] {
    return this._collaborativesComments;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  get showHelp(): boolean {
    return this._showHelp;
  }

  get showExample(): boolean {
    return this._showExample;
  }

  get showComment(): boolean {
    return this._showComment;
  }

  get showSuggestion(): boolean {
    return this._showSuggestion;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  get badgeUmi(): string {
    return this._badgeUmi;
  }

  get padID(): string {
    return this._padID;
  }


  get modalMedia(): boolean {
    return this._modalMedia;
  }

  set modalMedia(value: boolean) {
    this._modalMedia = value;
  }


  get selectedMedia(): UmiusModalMedia {
    return this._selectedMedia;
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

  get mediaFilter(): Array<UmiusMediaInterface> {
    return this._mediaFitler;
  }

  get displayUploadOverlay(): boolean {
    return this._displayUploadOverlay;
  }

  get isMediaAdjusted(): boolean {
    return this._isMediaAdjusted;
  }

  get editedMediaIndex(): any {
    return this._editedMediaIndex;
  }

  get editedMediaId(): string {
    return this._editedMediaId;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}

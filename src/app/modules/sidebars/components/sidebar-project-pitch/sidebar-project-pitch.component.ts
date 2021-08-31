import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { PitchHelpFields } from '../../../../models/static-data/project-pitch';
import { CommonService } from '../../../../services/common/common.service';
import { Media, Video } from '../../../../models/media';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import { CardComment, CardSectionTypes } from '../../../../models/innov-card';
import { CollaborativeComment } from '../../../../models/collaborative-comment';
import { picto } from '../../../../models/static-data/picto';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SocketService } from '../../../../services/socket/socket.service';
import { EtherpadFrontService } from '../../../../services/etherpad/etherpad-front.service';
import { MediaFrontService } from '../../../../services/media/media-front.service';

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

  @Input() mainMedia: Media = <Media>{};

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
  @Input() sectionId: string;

  @Input() cardContent: any = '';

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

  private _selectedMedia: string;

  constructor(private _innovationFrontService: InnovationFrontService,
              private _etherpadFrontService: EtherpadFrontService,
              private _socketService: SocketService) {
  }

  ngOnInit(): void {
    // Listen on save from another user
    this._socketService.getProjectFieldUpdates(this.innovationId, 'innovationCards')
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(() => {
        this._toBeSaved = false;
      }, (error) => {
        console.error(error);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.type && changes.type.currentValue !== changes.type.previousValue) {
      this.cardContent = changes.cardContent && changes.cardContent.currentValue || '';
      this._isSaving = false;
      this._toBeSaved = false;
      this._padID = this._etherpadFrontService.buildPadID('pitch', this.sectionId);
    }
  }

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
  public onUploadMedia(media: Media | Video, type: 'IMAGE' | 'VIDEO') {
    if (media && type && this.isEditable) {
      this.isSavingChange.emit(true);
      this.saveProject.emit({type: type, content: media});
    }
  }

  /***
   * to get the Image or Video source for the respective media.
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
  public onSetPrincipal(media: any) {
    if (media && this.isNotMainMedia(media) && !this._isSaving && this.isEditable) {
      this.isSavingChange.emit(true);
      this.saveProject.emit({type: 'MAIN_MEDIA', content: <Media>media});
    }
  }

  /***
   * when the user clicks on the Delete media button
   * @param media
   */
  public onDeleteMedia(media: any) {
    if (media && !this._isSaving && this.isEditable) {
      this.isSavingChange.emit(true);
      this.saveProject.emit({type: 'DELETE_MEDIA', content: <Media>media});
    }
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


  get selectedMedia(): string {
    return this._selectedMedia;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  mediaToShow(mediaSrc: any) {
    this._modalMedia = true;
    this._selectedMedia = mediaSrc;
  }
}

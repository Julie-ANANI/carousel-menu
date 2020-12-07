import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PitchHelpFields} from '../../../../models/static-data/project-pitch';
import {CommonService} from '../../../../services/common/common.service';
import {Media, Video} from '../../../../models/media';
import {InnovationFrontService} from '../../../../services/innovation/innovation-front.service';
import {CardComment, CardSectionTypes} from '../../../../models/innov-card';
import {CollaborativeComment} from '../../../../models/collaborative-comment';
import {picto} from '../../../../models/static-data/picto';
import {EtherpadService} from '../../../../services/etherpad/etherpad.service';

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

export class SidebarProjectPitchComponent implements OnChanges {

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

  // 'TITLE' | 'SUMMARY' | 'ISSUE' | 'SOLUTION' | 'MEDIA' | 'OTHER'
  @Input() type: CardSectionTypes = '';

  @Output() saveProject: EventEmitter<{type: string, content: any}> = new EventEmitter<{type: string, content: any}>();

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

  constructor(private _innovationFrontService: InnovationFrontService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.type && changes.type.currentValue !== changes.type.previousValue) {
      this.cardContent = changes.cardContent && changes.cardContent.currentValue || '';
      this._isSaving = false;
      this._toBeSaved = false;
      this._padID = EtherpadService.buildPadID('pitch', this.sectionId);
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
      return InnovationFrontService.imageSrc(media);
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
   * returns the remaining Char and Color of the field
   * @param type
   */
  public remaining(type: string): string {
    if (this.type && type) {
      const text = this.cardContent.replace(/<img .*?>/g, '');
      switch (this.type) {

        case 'TITLE':
          if (type === 'COLOR') {
            return CommonService.getLimitColor(this.cardContent, 100);
          } else if (type === 'CHAR') {
            return (100 - text.length).toString(10);
          }
          break;

        case 'SUMMARY':
          if (type === 'COLOR') {
            return CommonService.getLimitColor(this.cardContent, 500);
          } else if (type === 'CHAR') {
            return (500 - text.length).toString(10);
          }
          break;


        case 'ISSUE':
        case 'SOLUTION':
        case 'OTHER':
          if (type === 'COLOR') {
            return CommonService.getLimitColor(this.cardContent, 500);
          } else if (type === 'CHAR') {
            return (1000 - text.length).toString(10);
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
}

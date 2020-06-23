import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardComment} from '../../../../models/innov-card-comment';
import {PitchHelpFields} from '../../../../models/static-data/project-pitch';
import {SidebarInterface} from '../../interfaces/sidebar-interface';
import {CommonService} from '../../../../services/common/common.service';
import {Media, Video} from '../../../../models/media';

@Component({
  selector: 'app-sidebar-project-pitch',
  templateUrl: './sidebar-project-pitch.component.html',
  styleUrls: ['./sidebar-project-pitch.component.scss']
})

export class SidebarProjectPitchComponent {

  @Input() set sidebarValue(value: SidebarInterface) {
    this.cardContent = '';
    this._isSaving = false;
    this._toBeSaved = false;
  }

  @Input() set isSaving(value: boolean) {
    this._isSaving = value;
    if (!this._isSaving && this._toBeSaved) {
      this._toBeSaved = false;
    }
  }

  @Input() imagePostUri = '';

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

  @Input() cardContent = '';

  // 'TITLE' | 'SUMMARY' | 'ISSUE' | 'SOLUTION' | 'MEDIA'
  @Input() type = '';

  @Output() saveProject: EventEmitter<{type: string, content: any}> = new EventEmitter<{type: string, content: any}>();

  @Output() isSavingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _comment: CardComment = <CardComment>{};

  private _isSaving = false;

  private _showHelp = true;

  private _showExample = true;

  private _showComment = false;

  private _showSuggestion = false;

  private _toBeSaved = false;

  public onSave(event: Event) {
    event.preventDefault();
    this.isSavingChange.emit(true);
    this.saveProject.emit({type: this.type, content: this.cardContent});
  }

  public onChangeValue() {
    this._toBeSaved = true;
  }

  public onTextChange(event: { content: string }) {
    this.cardContent = event.content;
    this.onChangeValue();
  }

  public uploadMedia(media: Media | Video, type: string) {
    if (media) {
      this.isSavingChange.emit(true);
      if (type === 'IMAGE') {
        this.saveProject.emit({type: 'MEDIA', content: <Media>media});
      } else if (type === 'VIDEO') {
        this.saveProject.emit({type: 'VIDEO', content: <Video>media});
      }
    }
  }

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

  public remaining(type: string): string {
    if (this.type && type) {
      switch (this.type) {

        case 'TITLE':
          if (type === 'COLOR') {
            return CommonService.getLimitColor(this.cardContent.length, 150);
          } else if (type === 'CHAR') {
            return (150 - this.cardContent.length).toString(10);
          }
          break;

        case 'SUMMARY':
        case 'ISSUE':
        case 'SOLUTION':
          if (type === 'COLOR') {
            return CommonService.getLimitColor(this.cardContent.length, 500);
          } else if (type === 'CHAR') {
            return (500 - this.cardContent.length).toString(10);
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

}

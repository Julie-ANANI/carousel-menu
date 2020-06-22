import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardComment} from '../../../../models/innov-card-comment';
import {PitchHelpFields} from '../../../../models/static-data/project-pitch';
import {SidebarInterface} from '../../interfaces/sidebar-interface';

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

  // 'TITLE' | 'SUMMARY' | 'ISSUE' | 'SOLUTION'
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

  get helpText(): string {
    if (this.pitchHelp && this.type) {
      switch (this.type) {

        case 'TITLE':
          return this.pitchHelp.title;

        case 'SUMMARY':
          return this.pitchHelp.summary;

        case 'ISSUE':
          return this.pitchHelp.issue;

        case 'SOLUTION':
          return this.pitchHelp.solution;

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

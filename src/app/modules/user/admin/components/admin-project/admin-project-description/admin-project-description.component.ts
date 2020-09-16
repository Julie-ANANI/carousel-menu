import {Component, OnDestroy, OnInit} from '@angular/core';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {Innovation} from '../../../../../../models/innovation';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {CardSectionTypes, InnovCard, InnovCardSection} from '../../../../../../models/innov-card';
import {Media, Video} from '../../../../../../models/media';
import {InnovationService} from '../../../../../../services/innovation/innovation.service';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {CommonService} from '../../../../../../services/common/common.service';
import {TranslationService} from '../../../../../../services/translation/translation.service';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';

type modalType = 'NEW_SECTION' | 'DELETE_SECTION' | '';

interface Toggle {
  title: boolean;
  summary: boolean;
  [property: string]: boolean;
}

@Component({
  templateUrl: './admin-project-description.component.html',
  styleUrls: ['./admin-project-description.component.scss']
})

export class AdminProjectDescriptionComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _activeCardIndex = 0;

  private _isEditable = false;

  private _showModal = false;

  private _modalType: modalType = '';

  private _newSection: InnovCardSection = <InnovCardSection>{};

  private _deleteSectionIndex: number = null;

  private _toggleComment: Toggle = {
    title: false,
    summary: false
  };

  private _toggleSuggestion: Toggle = {
    title: false,
    summary: false
  };

  private _isSavingMedia = false;

  constructor(private _innovationFrontService: InnovationFrontService,
              private _innovationService: InnovationService,
              private _translationService: TranslationService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,) { }

  ngOnInit() {

    this._isEditable = this.canAccess(['edit', 'description']);

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation || <Innovation>{};
      this._initToggle();
    });

    this._innovationFrontService.activeCardIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((index) => {
      if (index !== this._activeCardIndex) {
        this._activeCardIndex = index;
      }
    });

  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project', 'settings'];
    return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
  }

  public remaining(type: string, property: CardSectionTypes, index?: number): string {
    switch (property) {

      case 'TITLE':
        if (type === 'COLOR') {
          return CommonService.getLimitColor(this.activeInnovCard.title.length, 100);
        } else if (type === 'CHAR') {
          return (100 - this.activeInnovCard.title.length).toString(10);
        }
        break;

      case 'SUMMARY':
        if (type === 'COLOR') {
          return CommonService.getLimitColor(this.activeInnovCard.summary.length, 500);
        } else if (type === 'CHAR') {
          return (500 - this.activeInnovCard.summary.length).toString(10);
        }
        break;

      case 'ISSUE':
      case 'SOLUTION':
      case 'OTHER':
        if (type === 'COLOR') {
          return CommonService.getLimitColor(this.activeInnovCard.sections[index].content.length, 1000);
        } else if (type === 'CHAR') {
          return (1000 - this.activeInnovCard.sections[index].content.length).toString(10);
        }
        break;

    }
    return '';
  }

  public importTranslation(event: Event, model: CardSectionTypes, index?: number) {
    event.preventDefault();
    const from_card = this._innovation.innovationCards[this._activeCardIndex === 0 ? 1 : 0];
    const _model = model.toLowerCase();
    let _text = '';

    if (model === 'TITLE' || model === 'SUMMARY') {
      _text = from_card[_model].replace(/<[^>]*>/g, '');
    } else if (model === 'ISSUE' || model === 'SOLUTION' || model === 'OTHER') {
      _text = (<String>from_card.sections[index].content).replace(/<[^>]*>/g, '');
    }

    if (_text) {
      this._translationService.translate(_text, this.activeInnovCard.lang).pipe(first()).subscribe((o: any) => {
        switch (model) {

          case 'TITLE':
          case 'SUMMARY':
            this.activeInnovCard[_model] = o.translation;
            break;

          case 'ISSUE':
          case 'SOLUTION':
          case 'OTHER':
            this.activeInnovCard.sections[index].content = o.translation;
            break;

        }
        this.updateInnovation();
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    } else {
      this._translateNotificationsService.error('Error', 'The text is empty in another project language.');
    }

  }

  private _initToggle() {
    this._toggleComment = {
      title: !!this.activeInnovCard.operatorComment.title.comment,
      summary: !!this.activeInnovCard.operatorComment.summary.comment
    };

    this._toggleSuggestion = {
      title: !!this.activeInnovCard.operatorComment.title.suggestion,
      summary: !!this.activeInnovCard.operatorComment.summary.suggestion
    };

    for (let i = 0; i < this.activeInnovCard.sections.length; i++) {
      this._toggleComment[i] = !!this.activeInnovCard.operatorComment.sections[i].comment;
      this._toggleSuggestion[i] = !!this.activeInnovCard.operatorComment.sections[i].suggestion;
    }

  }

  public onToggleComment(event: Event, property: string) {
    this._toggleComment[property] = !this._toggleComment[property];
  }

  public onToggleSuggestion(event: Event, property: string) {
    this._toggleSuggestion[property] = !this._toggleSuggestion[property];
  }

  public onCommentChange(event: { content: string }, property: string, type: 'comment' | 'suggestion', index?: number) {
    if (property !== 'sections') {
      this.activeInnovCard.operatorComment[property][type] = event.content;
    } else {
      this.activeInnovCard.operatorComment.sections[index][type] = event.content;
    }
    this.updateInnovation();
  }

  public onContentChange(event: { content: string }, property: string, index?: number) {
    if (property !== 'sections') {
      this.activeInnovCard[property] = event.content;
    } else {
      this.activeInnovCard.sections[index].content = event.content;
    }
    this.updateInnovation();
  }

  public toggleVisibility(event: Event, index: number) {
    event.preventDefault();
    this.activeInnovCard.sections[index].visibility = !this.activeInnovCard.sections[index].visibility;
    this.updateInnovation();
  }

  public updateInnovation() {
    this._innovationFrontService.setNotifyChanges(true);
  }

  public openModal(event: Event, type: modalType, index?: number) {
    event.preventDefault()
    this._modalType = type;
    switch (type) {

      case 'NEW_SECTION':
        this._newSection = {
          title: 'New section',
          content: '',
          visibility: true,
          type: 'OTHER'
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
    this.activeInnovCard.operatorComment.sections.push({
      comment: '',
      suggestion: '',
      type: this._newSection.type
    });
    this._newSection = <InnovCardSection>{};
    this._initToggle();
    this.closeModal();
    this.updateInnovation();
  }

  public deleteSection(event: Event) {
    event.preventDefault();
    this.activeInnovCard.sections.splice(this._deleteSectionIndex, 1);
    this.activeInnovCard.operatorComment.sections.splice(this._deleteSectionIndex, 1);
    this._deleteSectionIndex = null;
    this._initToggle();
    this.closeModal();
    this.updateInnovation();
  }

  public uploadImage(media: Media): void {
    this.activeInnovCard.media.push(media);
    if (!this._innovation.innovationCards[this._activeCardIndex].principalMedia) {
      this._innovation.innovationCards[this._activeCardIndex].principalMedia = media;
    }
    this.updateInnovation();
  }

  public uploadVideo(video: Video): void {
    this._innovationService.addNewMediaVideoToInnovationCard(this._innovation._id,
      this._innovation.innovationCards[this._activeCardIndex]._id, video)
      .pipe(first())
      .subscribe((res) => {
        this.activeInnovCard.media.push(res);
        this._innovation.innovationCards[this._activeCardIndex].principalMedia = res;
        this.updateInnovation();
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
  }

  public onSetPrincipal(media: Media) {
    if (!this._isSavingMedia) {
      this._isSavingMedia = true;
      this._innovationService.setPrincipalMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, media._id)
        .pipe(first())
        .subscribe(() => {
          this._isSavingMedia = false;
          this.activeInnovCard.principalMedia = media;
          this._innovation.innovationCards[this._activeCardIndex].principalMedia = media;
          this._translateNotificationsService.success('Success', 'The media has been set as a principal media.');
          }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          this._isSavingMedia = false;
          console.error(err);
        });
    }
  }

  public onDeleteMedia(media: Media) {
    if (!this._isSavingMedia) {
      this._isSavingMedia = true;
      this._innovationService.deleteMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, media._id)
        .pipe(first())
        .subscribe(() => {
          this.activeInnovCard.media = this.activeInnovCard.media.filter((_media) => _media._id !== media._id);
          this._innovation.innovationCards[this._activeCardIndex].media = this.activeInnovCard.media;
          this._isSavingMedia = false;
          this._translateNotificationsService.success('Success', 'The media has been deleted.');
          }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          this._isSavingMedia = false;
          console.error(err);
      });
    }
  }

  public mediaSrc(media: Media, type: 'IMAGE' | 'VIDEO') {
    if (media && type === 'IMAGE') {
      return InnovationFrontService.imageSrc(media);
    } else if (media && type === 'VIDEO') {
      return this._innovationFrontService.videoSrc(media);
    }
  }

  public isNotMainMedia(media: any): boolean {
    if (this.activeInnovCard.principalMedia && this.activeInnovCard.principalMedia._id && media && media['_id']) {
      return this.activeInnovCard.principalMedia._id !== media['_id'];
    }
    return true;
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

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

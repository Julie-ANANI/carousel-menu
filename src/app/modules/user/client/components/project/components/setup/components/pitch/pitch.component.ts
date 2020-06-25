import {Component, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../../../../models/innovation';
import {PitchHelpFields} from '../../../../../../../../../models/static-data/project-pitch';
import {InnovationFrontService} from '../../../../../../../../../services/innovation/innovation-front.service';
import {first, takeUntil} from 'rxjs/operators';
import {MissionFrontService} from '../../../../../../../../../services/mission/mission-front.service';
import {Mission} from '../../../../../../../../../models/mission';
import {Subject} from 'rxjs';
import {CardSectionTypes, InnovCard, InnovCardSection} from '../../../../../../../../../models/innov-card';
import {SidebarInterface} from '../../../../../../../../sidebars/interfaces/sidebar-interface';
import {InnovationService} from '../../../../../../../../../services/innovation/innovation.service';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../../../../services/error/error-front.service';
import {Media, Video} from '../../../../../../../../../models/media';
import {CardComment} from '../../../../../../../../../models/innov-card-comment';

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

  private _activeSection: CardSectionTypes = '';

  private _sections: Array<InnovCardSection> = []

  constructor(private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      this._isEditable = this._innovation.status && (this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
      this._initDefaultSections();
    });

    this._innovationFrontService.activeCardIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((cardIndex) => {
      this._activeCardIndex = cardIndex;
      this._initDefaultSections();
    });
  }

  private _initDefaultSections() {
    const _defaultSections: Array<InnovCardSection> = [
      {
        title: this.activeInnovCard.title ? this.activeInnovCard.lang === 'fr' ? 'Titre' : 'Title' : this.activeInnovCard.lang === 'fr'
          ? 'Remplir le titre' : 'Fill in the title',
        content: this.activeInnovCard.title,
        visibility: true,
        type: 'TITLE'
      },
      {
        title: this.activeInnovCard.summary ? this.activeInnovCard.lang === 'fr' ? 'Résumé' : 'Summary' : this.activeInnovCard.lang === 'fr'
          ? 'Remplir le résumé' : 'Fill in the summary',
        content: this.activeInnovCard.summary,
        visibility: true,
        type: 'SUMMARY'
      },
      {
        title: this.activeInnovCard.lang === 'fr' ? 'Ajouter des médias' : 'Add medias',
        content: this.activeInnovCard.media,
        visibility: true,
        type: 'MEDIA'
      }
    ];

    this._sections = this.activeInnovCard.sections && this.activeInnovCard.sections.length
      ? this.activeInnovCard.sections.concat(_defaultSections) : _defaultSections;
  }

  public sectionCommentLabel(section: string): boolean {
    switch (section) {

      case 'TITLE':
        return !!(InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'TITLE').comment
          || InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'TITLE').suggestion);

      case 'SUMMARY':
        return !!(InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'SUMMARY').comment
          || InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'SUMMARY').suggestion);

      case 'ISSUE':
        return !!(InnovationFrontService.cardDynamicOperatorComment(this.activeInnovCard, 'ISSUE').comment
          || InnovationFrontService.cardDynamicOperatorComment(this.activeInnovCard, 'ISSUE').suggestion);

      case 'SOLUTION':
        return !!(InnovationFrontService.cardDynamicOperatorComment(this.activeInnovCard, 'SOLUTION').comment
          || InnovationFrontService.cardDynamicOperatorComment(this.activeInnovCard, 'SOLUTION').suggestion);

    }
  }

  public openSidebar(section: string, content: string | Array<Media>) {
    this._activeSection = <CardSectionTypes>section;
    this._cardContent = content;

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

        case 'ISSUE':
          const _indexIssue = InnovationFrontService.cardDynamicSectionIndex(this.activeInnovCard, 'ISSUE')
          this._innovation.innovationCards[this._activeCardIndex].sections[_indexIssue].content = event.content;
          this._updateProject();
          break;

        case 'SOLUTION':
          const _indexSolution = InnovationFrontService.cardDynamicSectionIndex(this.activeInnovCard, 'SOLUTION')
          this._innovation.innovationCards[this._activeCardIndex].sections[_indexSolution].content = event.content;
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
          this._setMainMedia(event.content);
          break;

        case 'DELETE_MEDIA':
          this._deleteMedia(event.content);
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
    if (this._sidebarValue.animate_state === 'inactive') {
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

  get isEditable(): boolean {
    return this._isEditable;
  }

  get activeSection(): CardSectionTypes {
    return this._activeSection;
  }

  get sections(): Array<InnovCardSection> {
    return this._sections;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

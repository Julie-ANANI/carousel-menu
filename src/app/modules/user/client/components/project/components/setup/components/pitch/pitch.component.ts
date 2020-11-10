import {Component, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../../../../models/innovation';
import {PitchHelpFields} from '../../../../../../../../../models/static-data/project-pitch';
import {InnovationFrontService} from '../../../../../../../../../services/innovation/innovation-front.service';
import {first, takeUntil} from 'rxjs/operators';
import {MissionFrontService} from '../../../../../../../../../services/mission/mission-front.service';
import {Mission} from '../../../../../../../../../models/mission';
import {Subject} from 'rxjs';
import {CardComment, CardSectionTypes, InnovCard, InnovCardSection} from '../../../../../../../../../models/innov-card';
import {SidebarInterface} from '../../../../../../../../sidebars/interfaces/sidebar-interface';
import {InnovationService} from '../../../../../../../../../services/innovation/innovation.service';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../../../../services/error/error-front.service';
import {Media, Video} from '../../../../../../../../../models/media';
import {Preset} from '../../../../../../../../../models/preset';
import {MissionService} from '../../../../../../../../../services/mission/mission.service';
import {CollaborativeComment} from '../../../../../../../../../models/collaborative-comment';
import {EtherpadService} from '../../../../../../../../../services/etherpad/etherpad.service';

@Component({
  templateUrl: './pitch.component.html',
  styleUrls: ['./pitch.component.scss']
})

export class PitchComponent implements OnInit, OnDestroy {

  private _ngUnsubscribe: Subject<any> = new Subject();
  private _activeCardIndex = 0;
  private _activeSectionCode = '';
  private _toBeSaved = false;

  constructor(private _innovationService: InnovationService,
              private _missionService: MissionService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService,
              private _etherpadService: EtherpadService) {
  }

  private _innovation: Innovation = <Innovation>{};

  get innovation(): Innovation {
    return this._innovation;
  }

  private _sidebarValue: SidebarInterface = {
    animate_state: 'inactive'
  };

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    if (!this._toBeSaved) {
      this._sidebarValue = value;
      if (this._sidebarValue.animate_state === 'inactive') {
        this._activeSection = '';
      }
    } else if (this._toBeSaved) {
      this._changesToSave();
    }
  }

  private _isSaving = false;

  get isSaving(): boolean {
    return this._isSaving;
  }

  set isSaving(value: boolean) {
    this._isSaving = value;
  }

  private _cardContent: any = '';

  get cardContent(): any {
    return this._cardContent;
  }

  private _isEditable = false;

  get isEditable(): boolean {
    return this._isEditable;
  }

  private _activeSection: CardSectionTypes = '';

  get activeSection(): CardSectionTypes {
    return this._activeSection;
  }

  private _sections: Array<InnovCardSection> = [];

  get sections(): Array<InnovCardSection> {
    return this._sections;
  }

  private _isRequesting = false;

  get isRequesting(): boolean {
    return this._isRequesting;
  }

  private _isSubmitting = false;

  get isSubmitting(): boolean {
    return this._isSubmitting;
  }

  private _showModal = false;

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  private _isSendingMessage = false;

  get isSendingMessage(): boolean {
    return this._isSendingMessage;
  }

  private _preset: Preset = <Preset>{};

  get preset(): Preset {
    return this._preset;
  }

  private _newMessage = false;

  get newMessage(): boolean {
    return this._newMessage;
  }

  private _mission: Mission = <Mission>{};

  get mission(): Mission {
    return this._mission;
  }

  private _authorisation: Array<string> = ['SOCIAL', 'UMI', 'COMMUNITY'];

  get authorisation(): Array<string> {
    return this._authorisation;
  }

  private _currentSectionComments: CollaborativeComment[] = [];

  get currentSectionComments(): any[] {
    return this._currentSectionComments;
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

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      if (this._innovation.preset) {
        this._preset = this._innovation.preset;
      }
      if (this._innovation.mission) {
        this._mission = <Mission>this._innovation.mission;
      }
      this._isEditable = this._innovation.status && (this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
      this._initDefaultSections();
      this._fetchCommentsOfSections();
    });

    this._innovationFrontService.activeCardIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((cardIndex) => {
      this._activeCardIndex = cardIndex;
      this._initDefaultSections();
    });
  }

  public sectionCommentLabel(section: string): boolean {
    let comments;
    switch (section) {

      case 'TITLE':
        comments = this._sections.find((cardSection: InnovCardSection) => cardSection.type === 'TITLE').comments;
        return (!!comments && comments.length > 0)
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'TITLE').suggestion;

      case 'SUMMARY':
        comments = this._sections.find((cardSection: InnovCardSection) => cardSection.type === 'SUMMARY').comments;
        return (!!comments && comments.length > 0)
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'SUMMARY').suggestion;

      case 'ISSUE':
        comments = this._sections.find((cardSection: InnovCardSection) => cardSection.type === 'ISSUE').comments;
        return (!!comments && comments.length > 0)
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'ISSUE').suggestion;

      case 'SOLUTION':
        comments = this._sections.find((cardSection: InnovCardSection) => cardSection.type === 'SOLUTION').comments;
        return (!!comments && comments.length > 0)
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'SOLUTION').suggestion;

      default:
        return false;
    }
  }

  public openSidebar(section: string, content: string | Array<Media>) {
    if (!this._toBeSaved) {
      this._activeSectionCode = this._computeSectionCode(section);
      this._getPadAllComments(section);
      this._activeSection = <CardSectionTypes>section;
      this._cardContent = content;

      this._sidebarValue = {
        animate_state: 'active',
        type: section,
        size: '726px',
        title: 'SIDEBAR.PROJECT_PITCH.' + (this._isEditable ? 'EDIT.' : 'VIEW.') + section
      };
    } else {
      this._changesToSave();
    }
  }

  private _getPadAllComments(section: string) {
    this._etherpadService.getAllCommentsOfPad(this.innovation._id, EtherpadService.buildPadID('pitch', this.activeSectionCode))
      .pipe(first())
      .subscribe((result) => {
        this._currentSectionComments = result;
        }, (err: HttpErrorResponse) => {
        console.error(err);
      });
  }

  public mediaSrc(media: Media) {
    return InnovationFrontService.getMedia(media);
  }

  public onRequestProofreading(event: Event) {
    event.preventDefault();
    if (this._innovation.status === 'EDITING' && !this._isRequesting && !this._isSaving) {
      this._isRequesting = true;
      this._innovation['proofreading'] = true;
      this._updateProject('proofreading');
    }
  }

  public onOpenModal(event: Event) {
    event.preventDefault();
    if (this._innovation.status === 'EDITING' && !this._isSubmitting && !this._isSaving && !this._isRequesting) {
      this._showModal = true;
    }
  }

  public onCloseModal() {
    this._showModal = false;
  }

  public onSubmitProject(event: Event) {
    event.preventDefault();
    if (this._innovation.status === 'EDITING' && !this._isSubmitting && !this._isSaving && !this._isRequesting && this._showModal) {
      this._isSubmitting = true;
      this._innovation.status = 'SUBMITTED';
      this._updateProject('submit');
    }
  }

  private _computeSectionCode(section: string): string {
    let sectionCode = section.toLowerCase();

    switch (section) {
      case 'ISSUE':
        const _indexIssue = InnovationFrontService.cardDynamicSectionIndex(this.activeInnovCard, 'ISSUE');
        sectionCode = section.toLowerCase() + '-' + _indexIssue + 3;
        break;

      case 'SOLUTION':
        const _indexSolution = InnovationFrontService.cardDynamicSectionIndex(this.activeInnovCard, 'SOLUTION');
        sectionCode = section.toLowerCase() + '-' + _indexSolution + 3;
        break;

    }

    return sectionCode;
  }

  public onSaveProject(event: { type: string, content: any }) {
    if (event.type && this._isEditable && this._isSaving && !this._isSubmitting) {

      // TODO when case 'OTHER' will be implemented : this._activeSectionCode should be unique for each other section

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
          const _indexIssue = InnovationFrontService.cardDynamicSectionIndex(this.activeInnovCard, 'ISSUE');
          this._innovation.innovationCards[this._activeCardIndex].sections[_indexIssue].content = event.content;
          this._updateProject();
          break;

        case 'SOLUTION':
          const _indexSolution = InnovationFrontService.cardDynamicSectionIndex(this.activeInnovCard, 'SOLUTION');
          this._innovation.innovationCards[this._activeCardIndex].sections[_indexSolution].content = event.content;
          this._updateProject();
          break;

        case 'IMAGE':
          this._innovation.innovationCards[this._activeCardIndex].media.push(event.content);
          if (!this._innovation.innovationCards[this._activeCardIndex].principalMedia) {
            this._innovation.innovationCards[this._activeCardIndex].principalMedia = event.content;
          }
          this._cardContent = this.activeInnovCard.media;
          this._updateProject('image');
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

  public onChangeMessage(event: Event) {
    this._newMessage = ((event.target) as HTMLInputElement).value === this._innovation.questionnaireComment;
  }

  public onSendMessage(event: Event) {
    event.preventDefault();
    if (!this._isSendingMessage && this._innovation.status !== 'DONE') {
      this._isSendingMessage = true;
      this._updateProject('sendMessage');
    }
  }

  /***
   * when the user toggles the authorisation value.
   * @param event
   * @param type
   */
  public onChangeAuthorisation(event: Event, type: string) {
    this._mission.externalDiffusion[type] = ((event.target) as HTMLInputElement).checked;
    this._updateMission();
  }

  public onChangesToBeSaved(value: boolean) {
    this._toBeSaved = value;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  private _initDefaultSections() {
    const _defaultSections: Array<InnovCardSection> = [
      {
        title: this.activeInnovCard.title ? this.activeInnovCard.lang === 'fr' ? 'Titre' : 'Title'
          : this.activeInnovCard.lang === 'fr' ? 'Remplir le titre' : 'Fill in the title',
        content: this.activeInnovCard.title,
        visibility: true,
        type: 'TITLE'
      },
      {
        title: this.activeInnovCard.summary ? this.activeInnovCard.lang === 'fr' ? 'Résumé' : 'Summary'
          : this.activeInnovCard.lang === 'fr' ? 'Remplir le résumé' : 'Fill in the summary',
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

  private _fetchCommentsOfSections() {
    this._sections.forEach(
      (section) => this._etherpadService.getAllCommentsOfPad(this.innovation._id, EtherpadService.buildPadID('pitch', this._computeSectionCode(section.type))).subscribe(
        (result) => {
          section.comments = result;
        }));
  }

  private _changesToSave() {
    if (this._toBeSaved) {
      const _msg = this.activeInnovCard.lang === 'fr'
        ? 'Souhaitez vous vraiment quitter sans savegarder? Tous vos changements seront perdus.'
        : 'Do you really want to leave without saving? All the changes will be lost.';
      if (window.confirm(_msg)) {
        this._toBeSaved = false;
        this._sidebarValue = {
          animate_state: 'inactive'
        };
      }
    }
  }

  private _updateProject(type?: string) {
    let saveObject: any = {innovationCards: this._innovation.innovationCards};
    let message = 'ERROR.PROJECT.SAVED_TEXT';
    switch (type) {
      case 'submit':
        message = 'ERROR.PROJECT.SUBMITTED_TEXT';
        saveObject = {status: this._innovation.status};
        break;
      case 'proofreading':
        message = 'ERROR.PROJECT.REQUEST_PROOFREADING';
        saveObject = {proofreading: this._innovation.proofreading};
        break;
      case 'sendMessage':
        message = 'ERROR.PROJECT.SEND_MESSAGE';
        saveObject = {questionnaireComment: this._innovation.questionnaireComment};
        break;
      case 'image':
        message = 'ERROR.PROJECT.UPDATED_TEXT';
        break;
    }
    this._innovationService.save(this._innovation._id, saveObject).pipe(first()).subscribe((innovation) => {
      this._resetVariables();
      this._translateNotificationsService.success('ERROR.SUCCESS', message);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._resetVariables();
      console.error(err);
    });
  }

  private _resetVariables() {
    if (this._isSubmitting && this._innovation.status === 'SUBMITTED' && this._showModal) {
      this.onCloseModal();
    }
    if (this._isSendingMessage) {
      this._newMessage = false;
    }
    this._isSaving = false;
    this._isRequesting = false;
    this._isSubmitting = false;
    this._isSendingMessage = false;
  }

  private _uploadVideo(video: Video) {
    this._innovationService.addNewMediaVideoToInnovationCard(this._innovation._id, this.activeInnovCard._id, video)
      .pipe(first()).subscribe((video) => {
      this.activeInnovCard.media.push(video);
      this._cardContent = this.activeInnovCard.media;
      this._resetVariables();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.UPDATED_TEXT');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._resetVariables();
      console.error(err);
    });
  }

  private _setMainMedia(media: Media) {
    this._innovationService.setPrincipalMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, media._id)
      .pipe(first()).subscribe(() => {
      this.activeInnovCard.principalMedia = media;
      this._resetVariables();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.UPDATED_TEXT');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._resetVariables();
      console.error(err);
    });
  }

  private _deleteMedia(media: Media) {
    this._innovationService.deleteMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, media._id)
      .pipe(first()).subscribe(() => {
      this.activeInnovCard.media = this.activeInnovCard.media.filter((_media) => _media._id !== media._id);
      this._cardContent = this.activeInnovCard.media;
      this._resetVariables();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.UPDATED_TEXT');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._resetVariables();
      console.error(err);
    });
  }

  /***
   * this updates the mission object external diffusion.
   * @private
   */
  private _updateMission() {
    this._missionService.save(
      this._mission._id,
      {externalDiffusion: this._mission.externalDiffusion}).pipe(first()).subscribe((mission) => {
    }, (err: HttpErrorResponse) => {
      console.error(err);
    });
  }

  get activeSectionCode(): string {
    return this._activeSectionCode;
  }

}

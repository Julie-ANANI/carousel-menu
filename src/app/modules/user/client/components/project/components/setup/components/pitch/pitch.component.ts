import {Component, Inject, OnDestroy, OnInit, AfterViewChecked, PLATFORM_ID} from '@angular/core';
import {Innovation} from '../../../../../../../../../models/innovation';
import {PitchHelpFields} from '../../../../../../../../../models/static-data/project-pitch';
import {InnovationFrontService} from '../../../../../../../../../services/innovation/innovation-front.service';
import {first, takeUntil} from 'rxjs/operators';
import {MissionFrontService} from '../../../../../../../../../services/mission/mission-front.service';
import {Mission} from '../../../../../../../../../models/mission';
import {Subject} from 'rxjs';
import {CardComment, CardSectionTypes, InnovCard, InnovCardSection} from '../../../../../../../../../models/innov-card';
import {InnovationService} from '../../../../../../../../../services/innovation/innovation.service';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../../../../../services/translate-notifications/translate-notifications.service';
import {ErrorFrontService} from '../../../../../../../../../services/error/error-front.service';
import {Preset} from '../../../../../../../../../models/preset';
import {CollaborativeComment} from '../../../../../../../../../models/collaborative-comment';
import {EtherpadFrontService} from '../../../../../../../../../services/etherpad/etherpad-front.service';
import {isPlatformBrowser} from '@angular/common';
import {EtherpadService} from '../../../../../../../../../services/etherpad/etherpad.service';
import {MediaFrontService} from '../../../../../../../../../services/media/media-front.service';
import {TranslateService} from '@ngx-translate/core';
import {UmiusMediaInterface, UmiusModalMedia, UmiusSidebarInterface, UmiusVideoInterface} from '@umius/umi-common-component';

@Component({
  templateUrl: './pitch.component.html',
  styleUrls: ['./pitch.component.scss']
})

export class PitchComponent implements OnInit, OnDestroy, AfterViewChecked {

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _activeCardIndex = 0;

  private _toBeSaved = false;

  private _isUploadingVideo = false;

  private _innovation: Innovation = <Innovation>{};

  private _activeSectionIndex = 0;

  private _sidebarValue: UmiusSidebarInterface = {
    animate_state: 'inactive'
  };

  private _isSaving = false;

  private _cardContent: any = '';

  private _activeSection: InnovCardSection = <InnovCardSection>{};

  private _sections: Array<InnovCardSection> = [];

  private _isRequesting = false;

  private _isSubmitting = false;

  private _showModal = false;

  private _isSendingMessage = false;

  private _preset: Preset = <Preset>{};

  private _newMessage = false;

  private _mission: Mission = <Mission>{};

  private _currentSectionComments: CollaborativeComment[] = [];

  private _modalMedia = false;

  private _mainContainerStyle: any = {};

  private _mainMediaContainerStyle: any = {};

  private _secondaryContainerStyle: any = {};

  private _secondaryMedia: any = {};

  private _mediaFilter: any[];

  private _selectedMedia: UmiusModalMedia = <UmiusModalMedia>{};

  private _slideToShow: number = 0;

  private _displayMediaSlider = false;

  private _editedMediaIndex: number | undefined  = undefined;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _etherpadService: EtherpadService,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _etherpadFrontService: EtherpadFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) {
  }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      if (innovation && innovation._id) {
        this._innovation = innovation;

        if (this._innovation.preset) {
          this._preset = this._innovation.preset;
        }

        if (this._innovation.mission && (<Mission>this._innovation.mission)._id) {
          this._mission = <Mission>this._innovation.mission;
        }

        this._initDefaultSections();
        this._fetchCommentsOfSections();
      }
    });

    this._innovationFrontService.activeCardIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((cardIndex) => {
      this._activeCardIndex = cardIndex;
      this._initDefaultSections();
    });

  }

  ngAfterViewChecked() {
    if (this.activeInnovCard.principalMedia) {
      if (this.activeInnovCard.principalMedia.type !== 'VIDEO' && (this.activeInnovCard.principalMedia.cloudinary.width / this.activeInnovCard.principalMedia.cloudinary.height) < 4/3) {
        this._mainContainerStyle = {
          height: '408px',
          'align-content': 'flex-start',
          'align-items': 'flex-start',
          'row-gap': '8px'
        };
        this._mainMediaContainerStyle = {
          width: '272px',
          height: '100%'
        };
        if (this.activeInnovCard.media.length > 1) {
          this._secondaryContainerStyle = {
            'flex-direction': 'column',
            height: '100%',
            'padding-left': '8px'
          };
        };
        this._secondaryMedia = {
          width: '160px',
          height: '120px'
        }
      } else if (this.activeInnovCard.principalMedia.type === 'VIDEO' || (this.activeInnovCard.principalMedia.cloudinary.width / this.activeInnovCard.principalMedia.cloudinary.height) > 4/3) {
        this._mainContainerStyle = {
          height: 'auto',
          'place-items': 'center',
          'box-sizing': 'border-box',
          'column-gap': '8px'
        };
        this._mainMediaContainerStyle = {
          width: '100%',
          height: '272px'
        };
        if (this.activeInnovCard.media.length > 1) {
          this._secondaryContainerStyle = {
            'flex-direction': 'row',
            width: '100%',
            'padding-top': '8px'
          };
        };
        this._secondaryMedia = {
          width: 'calc(424px/3)',
          height: '104px'
        }
      }
      this._mediaFilter = this.activeInnovCard.media.slice(1, 4);
    }

  }

  public updateMedias(data: any){
    this.activeInnovCard.media = data;
    this._mediaFilter = data.slice(1, 4);
    console.log('new media array', this.activeInnovCard.media, 'filter', this._mediaFilter);
  }


  public sectionCommentLabel(section: string, etherpadElementId = ''): boolean {
    let comments;
    switch (section) {

      case 'TITLE':
        comments = this._sections.find((cardSection: InnovCardSection) => cardSection.type === 'TITLE').comments;
        return (!!comments && comments.length > 0)
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'TITLE').comment
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'TITLE').suggestion;

      case 'SUMMARY':
        comments = this._sections.find((cardSection: InnovCardSection) => cardSection.type === 'SUMMARY').comments;
        return (!!comments && comments.length > 0)
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'SUMMARY').comment
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'SUMMARY').suggestion;

      case 'ISSUE':
        comments = this._sections.find((cardSection: InnovCardSection) => cardSection.type === 'ISSUE').comments;
        return (!!comments && comments.length > 0)
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'ISSUE').comment
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'ISSUE').suggestion;

      case 'SOLUTION':
        comments = this._sections.find((cardSection: InnovCardSection) => cardSection.type === 'SOLUTION').comments;
        return (!!comments && comments.length > 0)
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'SOLUTION').comment
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'SOLUTION').suggestion;

      case 'CONTEXT':
        comments = this._sections.find((cardSection: InnovCardSection) => cardSection.type === 'CONTEXT').comments;
        return (!!comments && comments.length > 0)
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'CONTEXT').comment
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'CONTEXT').suggestion;

      case 'OTHER':
        comments = this._sections.find((cardSection: InnovCardSection) => cardSection.type === 'OTHER' &&
          cardSection.etherpadElementId === etherpadElementId).comments;
        return (!!comments && comments.length > 0)
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'OTHER', etherpadElementId).comment
          || !!InnovationFrontService.cardOperatorComment(this.activeInnovCard, 'OTHER', etherpadElementId).suggestion;

      default:
        return false;
    }
  }

  private _editText() {
    return this._translateService.currentLang === 'fr' ? 'Éditer' : 'Edit';
  }

  public openSidebar(section: InnovCardSection, index: number) {
    if (!this._toBeSaved) {
      this._activeSectionIndex = index;
      this._activeSection = section;
      this._cardContent = section.content;
      this._getPadAllComments();

      let _title = '';

      if (section.type !== 'TITLE' && section.type !== 'SUMMARY' && section.type !== 'MEDIA') {
        if (section.title) {
          _title = this.isEditable ? `${this._editText()} ${section.title.toLowerCase()}` : section.title;
        } else {
          _title = this.isEditable ? `${this._editText()} ${section.type.toLocaleLowerCase()}` : section.type;
        }
      } else {
        _title = 'SIDEBAR.PROJECT_PITCH.' + (this.isEditable ? 'EDIT.' : 'VIEW.') + section.type;
      }

      this._sidebarValue = {
        animate_state: 'active',
        type: section.type,
        size: '726px',
        title: _title
      };
    } else {
      this._changesToSave();
    }
  }

  private _getPadAllComments() {
    this._etherpadService.getAllCommentsOfPad(
      this._innovation._id,
      this._etherpadFrontService.buildPadID('pitch', this._activeSection.etherpadElementId))
      .pipe(first())
      .subscribe((result) => {
        this._currentSectionComments = result;
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
  }

  public mediaSrc(media: UmiusMediaInterface) {
    return MediaFrontService.getMedia(media);
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

  private _computeSectionCode(sectionType: CardSectionTypes, sectionIndex: number): string {
    let _sectionIndex = sectionIndex;

    switch (sectionType) {
      // Fixed sections
      case 'SUMMARY':
        _sectionIndex = null;
        break;
      case 'TITLE':
        _sectionIndex = null;
        break;

      // Dynamic sections
      case 'ISSUE':
        _sectionIndex = InnovationFrontService.cardDynamicSectionIndex(this.activeInnovCard, 'ISSUE');
        break;

      case 'SOLUTION':
        _sectionIndex = InnovationFrontService.cardDynamicSectionIndex(this.activeInnovCard, 'SOLUTION');
        break;

      case 'CONTEXT':
        _sectionIndex = InnovationFrontService.cardDynamicSectionIndex(this.activeInnovCard, 'CONTEXT');
        break;
    }

    return this._etherpadFrontService.buildPadIdOldInnovation(sectionType, _sectionIndex, this.activeInnovCard.lang);
  }

  public getMediaIndex(event: number) {
    this._editedMediaIndex = event;
  }

  public onSaveProject(event: { type: string, content: any }) {
    if (event.type && this.isEditable && this._isSaving && !this._isSubmitting) {

      switch (event.type) {

        case 'OTHER':
          const _indexOther = InnovationFrontService.cardDynamicSectionIndex(
            this.activeInnovCard, 'OTHER', this._activeSection.etherpadElementId
          );
          this._innovation.innovationCards[this._activeCardIndex].sections[_indexOther].content = event.content;
          this._updateProject();
          break;

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

        case 'CONTEXT':
          const _indexContext = InnovationFrontService.cardDynamicSectionIndex(this.activeInnovCard, 'CONTEXT');
          this._innovation.innovationCards[this._activeCardIndex].sections[_indexContext].content = event.content;
          this._updateProject();
          break;

        case 'IMAGE':
          if (this._editedMediaIndex === 0 || this._editedMediaIndex > 0) {
            console.log('index', this._editedMediaIndex);
            this._innovation.innovationCards[this._activeCardIndex].media[this._editedMediaIndex] = event.content;
          } else {
            this._innovation.innovationCards[this._activeCardIndex].media.push(event.content);
          }
          if (!this._innovation.innovationCards[this._activeCardIndex].principalMedia) {
            this._innovation.innovationCards[this._activeCardIndex].principalMedia = event.content;
          }
          this._cardContent = this.activeInnovCard.media;
          console.log('card content', this._cardContent)
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

  public onChangesToBeSaved(value: boolean) {
    this._toBeSaved = value;
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
    this._initEtherpadElementId();
  }

  /**
   * we are still using it for the old innovation.
   * @private
   */
  private _initEtherpadElementId() {
    this._sections.forEach((section, index) => {
      if (!section.etherpadElementId) {
        section.etherpadElementId = this._computeSectionCode(section.type, index);
      }
    });
  }

  private _fetchCommentsOfSections() {
    if (isPlatformBrowser(this._platformId)) {
      this._sections.forEach((section) => {
        this._etherpadService.getAllCommentsOfPad(this.innovation._id,
          this._etherpadFrontService.buildPadID('pitch', section.etherpadElementId)).pipe(first()).subscribe(
          (result: Array<CollaborativeComment>) => {
            section.comments = result;
          });
      });
    }
  }

  public mediaToShow(src: string) {
    this._modalMedia = true;
    this._selectedMedia = {
      active: true,
      src: src
    };
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

  public slideMedia(action: string, index?: number, event?: KeyboardEvent) {
    if (event && event.key === 'ArrowLeft') {
      action = 'showPrevious';
    } else if (event && event.key === 'ArrowRight') {
      action = 'showNext';
    }
    if (action === 'showSelected') {
      this._slideToShow = index;
    } else if (action === 'showPrevious') {
      if (!this.activeInnovCard.media[this._slideToShow - 1]) {
        this._slideToShow = this.activeInnovCard.media.length - 1;
      } else {
        this._slideToShow = this._slideToShow - 1;
      }
    } else if (action === 'showNext') {
      if (!this.activeInnovCard.media[this._slideToShow + 1]) {
        this._slideToShow = 0;
      } else {
        this._slideToShow = this._slideToShow + 1;
      }
    }
  }


  private _changesToSave() {
    if (this._toBeSaved) {
      const _msg = this.activeInnovCard.lang === 'fr'
        ? 'Souhaitez vous vraiment quitter sans sauvegarder? Tous vos changements seront perdus.'
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

    this._innovationService.save(this._innovation._id, saveObject).pipe(first()).subscribe((_) => {
      this._resetVariables();
      this._translateNotificationsService.success('ERROR.SUCCESS', message);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
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

  private _emitUpdatedInnovation() {
    this._innovationFrontService.setInnovation(JSON.parse(JSON.stringify(this._innovation)));
  }

  private _uploadVideo(video: UmiusVideoInterface) {
    this._isUploadingVideo = true;
    this._innovationService.addNewMediaVideoToInnovationCard(this._innovation._id, this.activeInnovCard._id, video)
      .pipe(first())
      .subscribe((_video) => {
        this._isUploadingVideo = false;
        this._innovation.innovationCards[this._activeCardIndex].media.push(_video);
        this._cardContent = this._innovation.innovationCards[this._activeCardIndex].media;

        if (!this._innovation.innovationCards[this._activeCardIndex].principalMedia) {
          this._innovation.innovationCards[this._activeCardIndex].principalMedia = _video;
          this._setMainMedia(_video);
        } else {
          this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.UPDATED_TEXT');
          this._resetVariables();
        }

        this._emitUpdatedInnovation();
      }, (err: HttpErrorResponse) => {
        this._isUploadingVideo = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        this._resetVariables();
        console.error(err);
      });
  }

  private _setMainMedia(media: UmiusMediaInterface) {
    this._innovationService.setPrincipalMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, media._id)
      .pipe(first()).subscribe(() => {
      this.activeInnovCard.principalMedia = media;
      this._resetVariables();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.UPDATED_TEXT');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      this._resetVariables();
      console.error(err);
    });
  }

  private _deleteMedia(media: UmiusMediaInterface) {
    this._innovationService.deleteMediaOfInnovationCard(this._innovation._id, this.activeInnovCard._id, media._id)
      .pipe(first())
      .subscribe(() => {
        this.activeInnovCard.media = this.activeInnovCard.media.filter((_media) => _media._id !== media._id);
        this._cardContent = this.activeInnovCard.media;
        this._verifyPrincipal(media);
        this._resetVariables();
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.UPDATED_TEXT');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        this._resetVariables();
        console.error(err);
      });
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
      this._setMainMedia(this.activeInnovCard.media[0]);
    }
  }

  get isUploadingVideo(): boolean {
    return this._isUploadingVideo;
  }

  get selectedMedia(): UmiusModalMedia {
    return this._selectedMedia;
  }

  set modalMedia(value: boolean) {
    this._modalMedia = value;
  }

  get modalMedia(): boolean {
    return this._modalMedia;
  }


  get activeSectionIndex(): number {
    return this._activeSectionIndex;
  }

  get isEditable(): boolean {
    return this._innovation.status && (this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
  }

  get currentSectionComments(): any[] {
    return this._currentSectionComments;
  }

  get activeInnovCard(): InnovCard {
    return InnovationFrontService.activeCard(this._innovation, this._activeCardIndex);
  }

  get operatorComment(): CardComment {
    return InnovationFrontService.cardOperatorComment(
      this.activeInnovCard, this._activeSection.type, this._activeSection.etherpadElementId);
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

  get sidebarValue(): UmiusSidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: UmiusSidebarInterface) {
    if (!this._toBeSaved) {
      this._sidebarValue = value;
      if (this._sidebarValue.animate_state === 'inactive') {
        this._activeSection = <InnovCardSection>{};
      }
    } else if (this._toBeSaved) {
      this._changesToSave();
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

  get activeSection(): InnovCardSection {
    return this._activeSection;
  }

  get sections(): Array<InnovCardSection> {
    return this._sections;
  }

  get isRequesting(): boolean {
    return this._isRequesting;
  }

  get isSubmitting(): boolean {
    return this._isSubmitting;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get isSendingMessage(): boolean {
    return this._isSendingMessage;
  }

  get preset(): Preset {
    return this._preset;
  }

  get newMessage(): boolean {
    return this._newMessage;
  }

  get mission(): Mission {
    return this._mission;
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

  get secondaryMedia(): any {
    return this._secondaryMedia;
  }

  get mediaFilter(): Array<UmiusMediaInterface> {
    return this._mediaFilter;
  }

  get slideToShow(): number {
    return this._slideToShow;
  }

  get displayMediaSlider(): boolean {
    return this._displayMediaSlider;
  }

  get editedMediaIndex(): number  {
    return this._editedMediaIndex;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {InnovCard} from '../../../../../../../models/innov-card';
import {Community, CommunityCircle, CommunityUser, PublicationType} from '../../../../../../../models/community';
import {InnovationFrontService} from '../../../../../../../services/innovation/innovation-front.service';
import {Innovation} from '../../../../../../../models/innovation';
import {Mission} from '../../../../../../../models/mission';
import {Tag} from '../../../../../../../models/tag';
import {isPlatformBrowser} from '@angular/common';
import {CommunityService} from '../../../../../../../services/community/community.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../../../services/translate-notifications/translate-notifications.service';
import {ErrorFrontService} from '../../../../../../../services/error/error-front.service';
import {cloudinaryImageRegEx, videoDomainRegEx} from '../../../../../../../utils/regex';
import {MissionFrontService} from '../../../../../../../services/mission/mission-front.service';
import {LangEntryService} from '../../../../../../../services/lang-entry/lang-entry.service';

interface PubType {
  key: string;
  name: string;
}

interface PubMedia {
  url: string;
  type: string;
  actualContent: any; // in case of type 'FILE' we store the File object otherwise same as url.
}

@Component({
  selector: 'app-admin-project-settings-modal',
  templateUrl: './admin-project-settings-modal.component.html',
  styleUrls: ['./admin-project-settings-modal.component.scss']
})
export class AdminProjectSettingsModalComponent implements OnInit {

  @Input() innovation: Innovation = <Innovation>{};

  @Input() mission: Mission = <Mission>{};

  @Input() set showModal(value: boolean) {
    this._showModal = value;
    this._emitModal();
    this._getCircles();
  }

  @Input() set isPublishingCommunity(value: boolean) {
    this._isPublishingCommunity = value;
    this.isPublishingCommunityChange.emit(this._isPublishingCommunity);
  }

  @Output() showModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() isPublishingCommunityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() communityChange: EventEmitter<Community> = new EventEmitter<Community>();

  private _innovCard: InnovCard = <InnovCard>{};

  private _publicationType: Array<PubType> = [
    {key: 'pain_point', name: 'Validate the relevance of a pain point'},
    {key: 'sourcing', name: 'Find a technology'},
    {key: 'innovation', name: 'Share my own innovation project'}
  ];

  private _community: Community = <Community>{};

  private _showModal = false;

  private _circles: Array<CommunityCircle> = [];

  private _owners: Array<CommunityUser> = [
    {_id: '', email: 'community@umi.us', firstName: 'Community', lastName: 'Team'}
  ];

  private _allMedias: Array<PubMedia> = [<PubMedia>{}, <PubMedia>{}, <PubMedia>{}];

  private _totalMedias = 3;

  private _isPublishingCommunity = false;

  private _tagsError: Array<Tag> = [];

  private _projectError: Array<any> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateNotificationsService: TranslateNotificationsService,
              private _langEntryService: LangEntryService,
              private _communityService: CommunityService) { }

  ngOnInit() {
    this._innovCard = InnovationFrontService.currentLangInnovationCard(this.innovation, 'en', 'CARD');
    this._initPublicationType();
    this._community.owner = 'community@umi.us';
    this._community.sectors = this._community.sectors || this.innovation.tags;
    this._checkTagsError();
    this._checkProjectError();
    this._initDefaultMedias();
    this._setCommunityMedias();
  }

  private _checkTagsError() {
    this._tagsError = this._community.sectors.filter((tag) => {
      return !this._langEntryService.tagEntry(tag, 'label', 'en', false);
    });
  }

  private _checkProjectError() {
    this._projectError = this.innovation.innovationCards.filter((lang) => lang.lang === 'en');
  }

  public _initPublicationType() {
    let objective = '';

    if (this.hasMissionTemplate) {
      objective = MissionFrontService.objectiveName(this.mission.template);
    } else if (this.mission.objective && this.mission.objective.principal && this.mission.objective.principal['en']) {
      objective = this.mission.objective.principal['en'];
    }

    this._community.publicationType = this._community.publicationType || InnovationFrontService.publicationType(objective) || '';

    const issueId = this._innovCard.sections && this._innovCard.sections.length
      ? InnovationFrontService.cardDynamicSection(this._innovCard, 'ISSUE')._id : '';

    const solutionId = this._innovCard.sections && this._innovCard.sections.length
      ? InnovationFrontService.cardDynamicSection(this._innovCard, 'SOLUTION')._id : '';

    switch (this._community.publicationType) {
      case 'sourcing':
      case 'pain_point':
        this._community.sections = [{type: 'SUMMARY', id: issueId}];
        break;

      case 'innovation':
        this._community.sections = [
          {type: 'ISSUE', id: issueId},
          {type: 'SOLUTION', id: solutionId},
        ];
        break;
    }

  }

  private _getCircles() {
    if (isPlatformBrowser(this._platformId) && this._showModal) {
      this._communityService.getAllCircles().pipe(first()).subscribe((response) => {
        this._circles = response;
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Circles Error...', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

  private _initDefaultMedias() {
    if (!this._community.media) {
      const _cardMedias = this._innovCard.media.filter((media) => media.type === 'PHOTO');
      for (let i = 0; i < this._totalMedias; i++) {
        if (_cardMedias[i] && _cardMedias[i].url) {
          this._allMedias[i] = {
            url: _cardMedias[i].url,
            actualContent: _cardMedias[i],
            type: _cardMedias[i].type
          };
        }
      }
    }
  }

  private _setCommunityMedias() {
    if (!this._community.media) {
      this._community.media = [];
    }

    this._community.media = this._allMedias.filter((value) => !!value.url).map((value) => value.actualContent);
  }

  public onChangePubType(value: PublicationType) {
    this._community.publicationType = value;
    this._initPublicationType();
  }

  public onChangeCircle(value: string) {
    this._community.visibility = value;
  }

  /**
   * for the moment we are assigning the email but once we finalized
   * it will assign the _id.
   * @param value
   */
  public onChangeOwner(value: string) {
    this._community.owner = value;
  }

  public onChangePubSection(value: string, index: number) {
    this._community.sections[index].id = value;
  }

  public addHashtags(value: string) {
    if (!this._community.tags) {
      this._community.tags = [];
    }
    this._community.tags.push(value);
  }

  public removeHashtags(value: string) {
    this._community.tags = this._community.tags.filter((tag) => tag !== value);
  }

  public removeMedia(index: number) {
    this._allMedias.splice(index, 1);
    this._allMedias.push({
      url: '',
      actualContent: '',
      type: ''
    });
    this._setCommunityMedias();
  }

  public setMainMedia(index: number) {
    this._allMedias.unshift(this._allMedias[index]);
    this.removeMedia(index);
  }

  /**
   * we send the raw file to the back instead of uploading directly
   * to the cloud.
   * @param value
   */
  public mediaToUpload(value: File) {
    for (let i = 0; i < this._totalMedias; i++) {
      if (!this._allMedias[i].url) {
        const reader = new FileReader();
        reader.readAsDataURL(value);
        reader.onload = (_event) => {
          if (reader.result) {
            this._allMedias[i] = {
              url: reader.result.toString(),
              actualContent: value,
              type: 'FILE'
            };
            this._setCommunityMedias();
          }
        };
        break;
      }
    }
  }

  /**
   * will check first are there any medias of instance File if yes then send the
   * object as FormData otherwise normal way.
   * @param event
   */
  public publishCommunity(event: Event) {
    event.preventDefault();
    const mediaFiles = this._community.media.filter((value) => value instanceof File).length;

    if (mediaFiles) {
      const communityData = new FormData();

      for (let i = 0; i < this._community.media.length; i++) {
        const value = this._community.media[i];
        if (value && value instanceof File) {
          communityData.append('medias', value, value.name);
          if (this._community.media && this._community.media.length > i) {
            delete this._community.media[i];
          }
        }
      }

      communityData.append('body', JSON.stringify(this._community));
      this._emitCommunityData(communityData);
    } else {
      this._emitCommunityData(this._community);
    }
  }

  private _emitCommunityData(data: any) {
    this.communityChange.emit(data);
    this._isPublishingCommunity = true;
  }

  public closeModal() {
    this._showModal = false;
  }

  private _emitModal() {
    this.showModalChange.emit(this._showModal);
  }

  public removeSector(sector: Tag) {
    this._community.sectors = this._community.sectors.filter((value) => value._id !== sector._id);
    this._checkTagsError();
  }

  public hasError(sector: Tag): boolean {
    return !this._langEntryService.tagEntry(sector, 'label', 'en', false);
  }

  public hasMedia(index: number): boolean {
    if (!this._community.sections[index] || !this._community.sections[index].id) {
      return false;
    }
    const section = InnovationFrontService.cardDynamicSectionById(this._innovCard, this._community.sections[index].id);
    return !!(<string>section.content).match(cloudinaryImageRegEx) || !!((<string>section.content).match(videoDomainRegEx));
  }

  get canBePublished(): boolean {

    if (!(this._community.sectors && this._community.sectors.length) || !(this._community.visibility)
      || !(this._community.owner) || !(this._community.media && this._community.media.length)) {
      return false;
    }

    if (this._community.sections && this._community.sections.length) {
      for (let i = 0; i < this._community.sections.length; i++) {
        if (!this._community.sections[i].id) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  get hasMissionTemplate(): boolean {
    return this.mission.template && this.mission.template.entry && this.mission.template.entry.length > 0;
  }

  get innovCard(): InnovCard {
    return this._innovCard;
  }

  get community(): Community {
    return this._community;
  }

  get publicationType(): Array<PubType> {
    return this._publicationType;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  get owners(): Array<CommunityUser> {
    return this._owners;
  }

  get circles(): Array<CommunityCircle> {
    return this._circles;
  }

  get allMedias(): Array<PubMedia> {
    return this._allMedias;
  }

  get isPublishingCommunity(): boolean {
    return this._isPublishingCommunity;
  }

  get tagsError(): Array<Tag> {
    return this._tagsError;
  }

  get projectError(): boolean {
    return this._projectError.length === 0;
  }
}

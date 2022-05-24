import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TagsService } from '../../../../../../services/tags/tags.service';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { Tag } from '../../../../../../models/tag';
import { first } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import {Table, UmiusConfigInterface, UmiusConfigService, UmiusSidebarInterface} from '@umius/umi-common-component';
import {LangEntryService} from '../../../../../../services/lang-entry/lang-entry.service';

@Component({
  templateUrl: 'admin-project-tags-pool.component.html',
})

export class AdminProjectTagsPoolComponent implements OnInit {

  private _localConfig: UmiusConfigInterface = {
    fields: '',
    limit: this._configService.configLimit('admin-project-tags-pool-limit'),
    offset: '0',
    search: '{}',
    sort: '{"created": "-1"}'
  };

  private _innovation: Innovation = <Innovation>{};

  private _tags: Array<Tag> = [];

  private _total = -1;

  private _fetchingError = false;

  private _sidebarValue: UmiusSidebarInterface = <UmiusSidebarInterface>{};

  private _table: Table = <Table>{};

  private _tagToEdit: Tag = <Tag>{};

  private _isLoading = true;

  private _isEditable = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: UmiusConfigService,
              private _rolesFrontService: RolesFrontService,
              private _innovationFrontService: InnovationFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _tagsService: TagsService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._innovation = this._innovationFrontService.innovation().value;
      this._isLoading = false;
      this._initializeTable();
      this._getTagsFromPool();
    }
  }

  // TODO multiling update
  private _initializeTable() {
    this._table = {
      _selector: 'admin-project-tags-pool-limit',
      _title: 'tags',
      _isTitle: true,
      _content: this._tags,
      _total: this._total,
      _isLocal: true,
      _isPaginable: true,
      _paginationTemplate: 'TEMPLATE_1',
      _isNoMinHeight: this._total < 11,
      _isDeletable: this.canAccess(['delete']),
      _isSelectable: this.canAccess(['delete']),
      _clickIndex: (this.canAccess(['view']) || this.canAccess(['edit'])) ? 1 : null,
      _columns: [
        { _attrs: ['label'], _name: 'Label', _type: 'MULTILING' },
        { _attrs: ['description'], _name: 'Description', _type: 'MULTILING' },
        { _attrs: ['type'], _name: 'Type', _type: 'TEXT' },
        { _attrs: ['state'], _name: 'State', _type: 'MULTI-CHOICES',
          _choices: [
            {_name: 'To Tag', _class: 'label is-danger'},
            {_name: 'Tagged', _class: 'label is-success'}
          ]
        }
      ],
    };
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'answerTags'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['projects', 'project', 'answerTags']);
    }
  }

  private _getTagsFromPool() {
    this._tagsService.getTagsFromPool(this._innovation._id).pipe(first()).subscribe((tags: Array<Tag>) => {
      this._tags = tags;
      this._sortTags();
      this._total = this._tags.length;

      // TODO remove this multiling
      this._tags.forEach((_tag: Tag) => {
        const enIndex = LangEntryService.entryIndex(_tag.entry, 'lang', 'en');
        const frIndex = LangEntryService.entryIndex(_tag.entry, 'lang', 'fr');
        _tag.label = {
          en: enIndex !== -1 ? _tag.entry[enIndex].label : '',
          fr: frIndex !== -1 ? _tag.entry[frIndex].label : '',
        };
        _tag.description = {
          en: enIndex !== -1 ? _tag.entry[enIndex].description : '',
          fr: frIndex !== -1 ? _tag.entry[frIndex].description : '',
        };
      })

      this._initializeTable();
    }, (err: HttpErrorResponse) => {
      this._fetchingError = true;
      this._translateNotificationsService.error('Tags Fetching Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  private _sortTags() {
    this._tags = this._tags.map(x => {
      return {...x, state: x.originalTagId ? 'Tagged' : 'To Tag'};
    }).sort((a, b) => !a.originalTagId && b.originalTagId ? -1 : 1);
  }

  /***
   * when the user clicks on the Add tag button.
   */
  public onClickAdd() {
    this._isEditable = true;
    this._openTagSidebar('ADD_TAGS', 'Add Tags');
  }

  private _openTagSidebar(type: string, title: string) {
    this._sidebarValue = {
      animate_state: 'active',
      type: type,
      title: title
    };
  }

  /***
   * when the user adds the tags in the sidebar and clicks the Save button.
   * @param value
   */
  public onNewTags(value: Array<Tag>) {
    if (value && value.length > 0) {
      value.forEach((tag: Tag, index) => {
        this._tagsService.addTagToPool(this._innovation._id, tag._id).pipe(first()).subscribe(() => {
          this._translateNotificationsService.success('Success' , 'The tag is added.');
          if (index === (value.length - 1)) {
            this._getTagsFromPool();
          }
        }, (err: HttpErrorResponse) => {
          if (this._tags.length > 0 && this._tags.find((existTag) => existTag.originalTagId === tag._id)) {
            this._translateNotificationsService.error('Tag Adding Error...', 'The tag is already exists.');
          } else {
            this._translateNotificationsService.error('Tag Adding Error...', ErrorFrontService.getErrorKey(err.error));
          }
        });
      });
    }
  }

  public onClickDelete(value: Array<Tag>) {
    value.forEach((tag: Tag, index) => {
      this._tagsService.removeTagFromPool(this._innovation._id, tag).pipe(first()).subscribe(() => {
        this._translateNotificationsService.success('Success' , 'The tag is removed.');
        if (index === (value.length - 1)) {
          this._getTagsFromPool();
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Tag Deleting Error...', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    });
  }

  public onClickEdit(tag: Tag) {
    this._isEditable = this.canAccess(['edit']);
    this._tagToEdit = tag;
    this._openTagSidebar('EDIT_TAG', this.canAccess(['edit']) ? 'Edit Tag' : 'View Tag');
  }

  /***
   * when the user edit the tag in the sidebar and clicks on the Save button.
   * @param tag
   */
  public onUpdateTag(tag: Tag): void {
    console.log(tag);
    this._tagsService.updateTagInPool(this._innovation._id, tag).pipe(first()).subscribe((_) => {
      console.log(_);
      this._getTagsFromPool();
      this._translateNotificationsService.success('Success' , 'The tag is updated.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Tag Updating Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  get localConfig(): UmiusConfigInterface {
    return this._localConfig;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get tags(): Array<Tag> {
    return this._tags;
  }

  get total(): number {
    return this._total;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get sidebarValue(): UmiusSidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: UmiusSidebarInterface) {
    this._sidebarValue = value;
  }

  get table(): Table {
    return this._table;
  }

  get tagToEdit(): Tag {
    return this._tagToEdit;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

}

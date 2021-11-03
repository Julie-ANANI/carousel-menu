import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TagsService } from '../../../../../../services/tags/tags.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { Table, Config } from '@umius/umi-common-component/models';
import { Tag } from '../../../../../../models/tag';
import { SidebarInterface } from '../../../../../sidebars/interfaces/sidebar-interface';
import { first, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import {ConfigService} from '@umius/umi-common-component/services/config';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { Subject } from 'rxjs';

@Component({
  templateUrl: 'admin-project-tags-pool.component.html',
  styleUrls: ['admin-project-tags-pool.component.scss']
})

export class AdminProjectTagsPoolComponent implements OnInit, OnDestroy {

  private _localConfig: Config = {
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

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  private _table: Table = <Table>{};

  private _tagToEdit: Tag = <Tag>{};

  private _isLoading = true;

  private _isEditable = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _rolesFrontService: RolesFrontService,
              private _innovationFrontService: InnovationFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _tagsService: TagsService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._initializeTable();

      this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
        this._innovation = innovation || <Innovation>{};
        this._getTagsFromPool();
      });

    }
  }

  private _initializeTable() {
    this._table = {
      _selector: 'admin-project-tags-pool-limit',
      _title: 'tags',
      _isTitle: true,
      _content: this._tags,
      _total: this._total,
      _isLocal: true,
      _isPaginable: true,
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
      this._initializeTable();
    }, (err: HttpErrorResponse) => {
      this._fetchingError = true;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
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
            this._translateNotificationsService.error('Error', 'The tag is already exists.');
          } else {
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
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
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
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
    this._tagsService.updateTagInPool(this._innovation._id, tag).pipe(first()).subscribe(() => {
      this._getTagsFromPool();
      this._translateNotificationsService.success('Success' , 'The tag is updated.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  get localConfig(): Config {
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

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
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

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

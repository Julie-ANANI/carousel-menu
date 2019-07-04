import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TagsService } from '../../../../../../services/tags/tags.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { Table } from '../../../../../table/models/table';
import { Tag } from '../../../../../../models/tag';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';
import { Config } from '../../../../../../models/config';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-project-tags-pool',
  templateUrl: 'admin-project-tags-pool.component.html',
  styleUrls: ['admin-project-tags-pool.component.scss']
})

export class AdminProjectTagsPoolComponent implements OnInit {

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created": "-1"}'
  };

  private _innovation: Innovation;

  private _tags: Array<Tag> = [];

  private _total: number;

  private _noResult: boolean;

  private _fetchingError: boolean;

  private _sidebarValue: SidebarInterface = {};

  private _table: Table;

  private _tag: Tag;


  constructor(private _activatedRoute: ActivatedRoute,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _tagsService: TagsService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.ANSWER_TAGS');

    if (this._activatedRoute.snapshot.parent.data['innovation']) {
      this._innovation = this._activatedRoute.snapshot.parent.data['innovation'];
    }

  }

  ngOnInit(): void {

    if (this._activatedRoute.snapshot.parent.data.project_tags_pool && Array.isArray(this._activatedRoute.snapshot.parent.data.project_tags_pool)) {
      this._tags = this._activatedRoute.snapshot.parent.data.project_tags_pool;
      this._sortTags();
      this._total = this._tags.length;
      this._noResult = this._total === 0;
      this._initializeTable();
    } else {
      this._fetchingError = true;
    }

  }

  private _getTagsFromPool() {
    this._tagsService.getTagsFromPool(this._innovation._id).pipe(first()).subscribe((response: Array<Tag>) => {
      this._tags = response;
      this._sortTags();
      this._total = this._tags.length;
      this._noResult = this._total === 0;
      this._initializeTable();
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.FETCHING_ERROR');
    });
  }

  private _sortTags() {
    this._tags = this._tags.map(x => {
      return {...x, state: x.originalTagId ? 'Tagged' : 'To Tag'};
    }).sort((a, b) => !a.originalTagId && b.originalTagId ? -1 : 1);
  }

  private _initializeTable() {
    this._table = {
      _selector: 'admin-project-tags-pool-limit',
      _title: 'tag(s)',
      _isTitle: true,
      _content: this._tags,
      _total: this._total,
      _isLocal: true,
      _isPaginable: true,
      _isDeletable: true,
      _isSelectable: true,
      _editIndex: 1,
      _columns: [
        {_attrs: ['label'], _name: 'Label', _type: 'MULTILING'},
        {_attrs: ['description'], _name: 'Description', _type: 'MULTILING'},
        {_attrs: ['type'], _name: 'Type', _type: 'TEXT'},
        {_attrs: ['state'], _name: 'State', _type: 'MULTI-CHOICES',
          _choices: [
            {_name: 'To Tag', _class: 'label label-alert'},
            {_name: 'Tagged', _class: 'label label-success'}
            ]
        }
      ],
    }
  }

  public onClickAdd() {
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      type: 'addTags',
      title: 'SIDEBAR.TITLE.ADD_TAGS'
    }
  }

  public onNewTags(value: Array<Tag>) {
    if (value && value.length > 0) {

      value.forEach((newTag: Tag) => {
        this._addTagToPool(newTag);
      });

      this._getTagsFromPool();

    }
  }

  private _addTagToPool(value: Tag) {
    this._tagsService.addTagToPool(this._innovation._id, value._id).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.ADDED');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    })
  }

  public onRemoveTags(value: Array<Tag>) {
    value.forEach((tag: Tag) => {
      this._tagsService.removeTagFromPool(this._innovation._id, tag).pipe(first()).subscribe(() => {
        this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.REMOVED');
        this._getTagsFromPool();
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
      });
    });
  }

  public updateTag(tag: Tag): void {
    this._tagsService
      .updateTagInPool(this._innovation._id, tag)
      .subscribe((data: any) => {
        //this.updateTable(data);
        this._translateNotificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.UPDATED');
      }, (err: any) => {
        this._translateNotificationsService.error('ERROR.ERROR', err.message);
      });
  }

  public editTag(tag: Tag) {
    this._tag = tag;
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'COMMON.TAG.EDIT_TAG',
    };
  }

/*  public onRemoveTags(tags: Array<Tag>): void {
    tags.forEach((tag) => {
      this._tagsService
        .removeTagFromPool(this._innovation._id, tag)
        .subscribe((data: any) => {
          //this.updateTable(data);
          this._translateNotificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
        }, (err: any) => {
          this._translateNotificationsService.error('ERROR.ERROR', err);
        });
    });
  }*/

  get config(): Config {
    return this._config;
  }

  /*set config(value: Config) {
    this._config = value;
  }*/

  get innovation(): Innovation {
    return this._innovation;
  }

  get tags(): Array<Tag> {
    return this._tags;
  }

  get total(): number {
    return this._total;
  }

  get noResult(): boolean {
    return this._noResult;
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

  get tag() { return this._tag; }


}

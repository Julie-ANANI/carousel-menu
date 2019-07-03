import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TagsService } from '../../../../../../services/tags/tags.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { Table } from '../../../../../table/models/table';
import { Tag } from '../../../../../../models/tag';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';
import { Config } from '../../../../../../models/config';
import { TranslateTitleService } from '../../../../../../services/title/title.service';

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

  private _tag: Tag;
  private _tagForm: FormGroup;


  private _tableInfos: Table = {
    _selector: 'admin-user',
    _title: 'tag(s)',
    _isTitle: true,
    _content: [],
    _total: -1,
    _isDeletable: true,
    _isSelectable: true,
    _columns: [
      {_attrs: ['label'], _name: 'Label', _type: 'MULTILING', _isSortable: true},
      {_attrs: ['description'], _name: 'Description', _type: 'MULTILING'},
      {_attrs: ['type'], _name: 'Type', _type: 'TEXT', _isSortable: true},
      {
        _attrs: ['state'], _name: 'State', _type: 'MULTI-CHOICES', _isSortable: true,
        _choices: [{_name: 'To Tag', _class: 'label label-alert'}, {_name: 'Tagged', _class: 'label label-success'}]
      }
    ],
  };



  constructor(private _activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private _translateTitleService: TranslateTitleService,
              private notificationsService: TranslateNotificationsService,
              private tagService: TagsService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.ANSWER_TAGS');

    if (this._activatedRoute.snapshot.parent.data['innovation']) {
      this._innovation = this._activatedRoute.snapshot.parent.data['innovation'];
    }

  }

  ngOnInit(): void {

    if (this._activatedRoute.snapshot.parent.data.project_tags_pool && Array.isArray(this._activatedRoute.snapshot.parent.data.project_tags_pool)) {
      this._tags = this._activatedRoute.snapshot.parent.data.project_tags_pool;
      this._total = this._tags.length;
      this._noResult = this._total === 0;
    } else {
      this._fetchingError = true;
    }

    this._tagForm = this.formBuilder.group({
      tag: null,
    });
    this.tagService.getTagsFromPool(this._innovation._id).subscribe((data: any) => {
      this.updateTable(data);
    });
  }

  public onClickAdd() {
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      type: 'addTags',
      title: 'SIDEBAR.TITLE.ADD_TAGS'
    }
  }

  public addNewTags(value: Array<Tag>) {
    console.log(value);
  }

  private updateTable(tags: Array<Tag>) {
    const tagsList = tags
      .map(x => {
        return {...x, state: x.originalTagId ? 'Tagged' : 'To Tag'};
      })
      .sort((a, b) => !a.originalTagId && b.originalTagId ? -1 : 1);
    this._tableInfos = {...this._tableInfos, _content: tagsList, _total: tagsList.length};
  }

  public addTag(event: Event): void {
    event.preventDefault();
    this.tagService
      .addTagToPool(this._innovation._id, this._tagForm.get('tag').value._id)
      .subscribe((data: any) => {
        this.updateTable(data);
        this.notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, (err: any) => {
        this.notificationsService.error('ERROR.ERROR', err.message);
      });
    this._tagForm.get('tag').reset();
  }

  public updateTag(tag: Tag): void {
    this.tagService
      .updateTagInPool(this._innovation._id, tag)
      .subscribe((data: any) => {
        this.updateTable(data);
        this.notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.UPDATED');
      }, (err: any) => {
        this.notificationsService.error('ERROR.ERROR', err.message);
      });
  }

  public editTag(tag: Tag) {
    this._tag = tag;
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'COMMON.TAG.EDIT_TAG',
    };
  }

  public deleteTags(tags: Array<Tag>): void {
    tags.forEach((tag) => {
      this.tagService
        .removeTagFromPool(this._innovation._id, tag)
        .subscribe((data: any) => {
          this.updateTable(data);
          this.notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
        }, (err: any) => {
          this.notificationsService.error('ERROR.ERROR', err);
        });
    });
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
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

  get tag() { return this._tag; }
  get tagForm() { return this._tagForm; }
  get tableInfos() { return this._tableInfos; }

  get canAddTag(): boolean {
    const tag = this._tagForm.get('tag').value;
    return tag && tag._id;
  }
}

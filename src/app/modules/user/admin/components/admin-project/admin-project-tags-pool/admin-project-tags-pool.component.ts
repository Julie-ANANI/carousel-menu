import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AutocompleteService } from '../../../../../../services/autocomplete/autocomplete.service';
import { TagsService } from '../../../../../../services/tags/tags.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../../../models/innovation';
import { Table } from '../../../../../table/models/table';
import { Tag } from '../../../../../../models/tag';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';
import { Observable } from 'rxjs';
import { MultilingPipe } from '../../../../../../pipe/pipes/multiling.pipe';
import { Multiling } from '../../../../../../models/multiling';

@Component({
  selector: 'app-admin-project-tags-pool',
  templateUrl: 'admin-project-tags-pool.component.html',
  styleUrls: ['admin-project-tags-pool.component.scss']
})
export class AdminProjectTagsPoolComponent implements OnInit {

  private _project: Innovation;
  private _tag: Tag;
  private _tagForm: FormGroup;
  private _sidebarTemplateValue: SidebarInterface = {};

  private _tableInfos: Table = {
    _selector: 'admin-user',
    _content: [],
    _total: 0,
    _isDeletable: true,
    _isSelectable: true,
    _isFiltrable: false,
    _columns: [
      {_attrs: ['label'], _name: 'Label', _type: 'MULTILING'},
      {_attrs: ['description'], _name: 'Description', _type: 'MULTILING'},
      {_attrs: ['type'], _name: 'Type', _type: 'TEXT'},
      {
        _attrs: ['state'], _name: 'State', _type: 'MULTI-CHOICES',
        _choices: [{_name: 'To Tag', _class: 'label label-alert'}, {_name: 'Tagged', _class: 'label label-success'}]
      }
    ],
  };

  private _config = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private translateService: TranslateService,
              private autocompleteService: AutocompleteService,
              private notificationsService: TranslateNotificationsService,
              private tagService: TagsService) {}

  ngOnInit(): void {
    this._project = this.route.snapshot.parent.data['innovation'];
    this._tagForm = this.formBuilder.group({
      tag: null,
    });
    this.tagService.getTagsFromPool(this._project._id).subscribe((data: any) => {
      this.updateTable(data);
    });
  }

  private updateTable(tags: Array<Tag>) {
    const tagsList = tags
      .map(x => {
        return {...x, state: x.originalTagId ? 'Tagged' : 'To Tag'};
      })
      .sort((a, b) => !a.originalTagId && b.originalTagId ? -1 : 1);
    this._tableInfos = {...this._tableInfos, _content: tagsList, _total: tagsList.length};
  }

  public suggestions(query: string): Observable<Array<any>> {
    const queryConf = {
      query: query,
      type: 'tags'
    };
    return this.autocompleteService.get(queryConf);
  }

  public autocompleListFormatter = (data: {name: Multiling, _id: string}) : SafeHtml => {
    const text = this.autocompleValueFormatter(data);
    return this.sanitizer.bypassSecurityTrustHtml(`<span>${text}</span>`);
  };

  public autocompleValueFormatter = (data: {name: Multiling, _id: string}) : string => {
      return MultilingPipe.prototype.transform(data.name, this.translateService.currentLang);
  };

  public addTag(event: Event): void {
    event.preventDefault();
    this.tagService
      .addTagToPool(this._project._id, this._tagForm.get('tag').value._id)
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
      .updateTagInPool(this._project._id, tag)
      .subscribe((data: any) => {
        this.updateTable(data);
        this.notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.UPDATED');
      }, (err: any) => {
        this.notificationsService.error('ERROR.ERROR', err.message);
      });
  }

  public editTag(tag: Tag) {
    this._tag = tag;
    this._sidebarTemplateValue = {
      animate_state: this.sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'COMMON.TAG_LABEL.EDIT_TAG',
    };
  }

  public closeSidebar(state: SidebarInterface) {
    this._sidebarTemplateValue.animate_state = state.animate_state;
  }

  public deleteTags(tags: Array<Tag>): void {
    tags.forEach((tag) => {
      this.tagService
        .removeTagFromPool(this._project._id, tag)
        .subscribe((data: any) => {
          this.updateTable(data);
          this.notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
        }, (err: any) => {
          this.notificationsService.error('ERROR.ERROR', err);
        });
    });
  }

  get config() { return this._config; }
  get project() { return this._project; }
  get sidebarTemplateValue() { return this._sidebarTemplateValue; }
  get tag() { return this._tag; }
  get tagForm() { return this._tagForm; }
  get tableInfos() { return this._tableInfos; }

  get canAddTag(): boolean {
    const tag = this._tagForm.get('tag').value;
    return tag && tag._id;
  }
}

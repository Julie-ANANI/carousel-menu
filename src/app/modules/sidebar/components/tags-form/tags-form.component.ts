import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TagsService} from '../../../../services/tags/tags.service';
import {Subject} from 'rxjs/Subject';
import {Tag} from '../../../../models/tag';
import {Innovation} from '../../../../models/innovation';

@Component({
  selector: 'app-tags-form',
  templateUrl: './tags-form.component.html',
  styleUrls: ['./tags-form.component.scss']
})
export class TagsFormComponent implements OnInit {

  @Input() set type(type: string) {
    this._type = type;
  }

  @Input() set tags(tags: Array<Tag>) {
    this._tags = [...tags];
  }

  @Input() set tag(tag: Tag) {
    this._tag = {...tag};
  }

  @Input() set project(value: Innovation) {
    this._projectId = value._id;
  }

  @Input() sidebarState: Subject<string>;

  @Output() newTags = new EventEmitter<Tag[]>();
  @Output() updateTag = new EventEmitter<Tag>();

  private _tags: Tag[] = [];
  private _tag: Tag;
  private _projectId = '';

  private _type = '';

  constructor(private _tagsService: TagsService) {}

  ngOnInit() {
    if (this.sidebarState) {
      this.sidebarState.subscribe((state) => {
        if (state === 'inactive') {
          setTimeout (() => {
            this._tags = [];
          }, 500);
        }
      })
    }
  }


  onSubmit() {
    switch (this._type) {
      case 'addTags':
        this.newTags.emit(this._tags);
        break;
      case 'editTag':
        this.updateTag.emit(this._tag);
        break;
    }
  }

  addTag(tag: any) {
    const id = tag.tag ? tag.tag : tag._id;
    this._tagsService.get(id).first().subscribe(res => {
      this._tags.push(res.tags[0]);
    });
  }

  removeTag(tag: any) {
    this._tags.splice(this._tags.findIndex(value => value._id === tag._id), 1);
  }

  get tag(): Tag {
    return this._tag;
  }

  get tags(): Tag[] {
    return this._tags;
  }

  get type(): string {
    return this._type;
  }

  get projectId(): string {
    return this._projectId;
  }
}

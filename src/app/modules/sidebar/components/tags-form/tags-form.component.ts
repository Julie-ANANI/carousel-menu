import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TagsService} from '../../../../services/tags/tags.service';
import {Subject} from 'rxjs/Subject';
import {Tag} from '../../../../models/tag';

@Component({
  selector: 'app-tags-form',
  templateUrl: './tags-form.component.html',
  styleUrls: ['./tags-form.component.scss']
})
export class TagsFormComponent implements OnInit {

  @Input() set type(type: string) {
    this._type = type;
    this.loadTypes();
  }

  @Input() sidebarState: Subject<string>;

  @Output() newTags = new EventEmitter<Tag[]>();

  addTags = false;

  private _tags: Tag[] = [];

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

  reinitialiseForm() {
    this.addTags = false;
  }

  loadTypes() {
    this.reinitialiseForm();
    if (this._type === 'addTag') {
      this.addTags = true;
    }

  }

  onSubmit() {
    if (this.addTags) {
      this.newTags.emit(this._tags);
    }
  }

  addTag(tag: any) {
    this._tagsService.get(tag._id).first().subscribe(res => {
      this._tags.push(res.tags[0]);
    });
  }

  removeTag(tag: any) {
    this._tags.splice(this._tags.findIndex(value => value._id === tag._id), 1);
  }

  get tags(): Tag[] {
    return this._tags;
  }
}

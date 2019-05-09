import {Component, Input, OnInit} from '@angular/core';
import { Tag } from '../../../../../../models/tag';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  @Input() set tags(value: Array<Tag>) {
    this._tags = value;
  }

  @Input() set tagColor(value: string) {
    this._tagColor = value;
  }

  private _tags: Array<Tag> = [];

  private _tagColor = '#4F5D6B';

  constructor(private _translateService: TranslateService) { }

  ngOnInit() { }

  get userLang(): string {
    return this._translateService.currentLang;
  }

  get tags(): Array<Tag> {
    return this._tags;
  }

  get tagColor(): string {
    return this._tagColor;
  }

}

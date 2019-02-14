import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Tag } from '../../models/tag';

@Component({
  selector: 'app-commercial',
  templateUrl: './commercial.component.html',
  // styleUrls: ['./commercial.component.scss']
})

export class CommercialComponent implements OnInit {

  private _sectorTags: Array<Tag> = [];
  private _selectedTags: Array<Tag> = [];
  public tagForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.tagForm = this.formBuilder.group({
      selectedTag: ['', Validators.required],
    });
    if (Array.isArray(this.activatedRoute.snapshot.data.tags)) {
      this._sectorTags = this.activatedRoute.snapshot.data.tags;
      if (this._sectorTags.length > 0) {
        this.tagForm.setValue({selectedTag: this._sectorTags[0]._id});
      }
    }
  }

  public selectTag() {
    const selectedTagId = this.tagForm.get('selectedTag').value;
    const selectedTag = this._sectorTags.find((t) => t._id === selectedTagId);
    if (selectedTag && this._selectedTags.findIndex((t) => t === selectedTag) === -1) {
      this._selectedTags.push(selectedTag);
    }
  }

  public removeTag(event: Event, tag: Tag) {
    event.preventDefault();
    this._selectedTags = this._selectedTags.filter((t) => t !== tag);
  }

  get lang(): string { return this.translateService.currentLang; }

  get sectorTags(): Array<Tag> {
    return this._sectorTags;
  }

  get selectedTags(): Array<Tag> {
    return this._selectedTags;
  }

}

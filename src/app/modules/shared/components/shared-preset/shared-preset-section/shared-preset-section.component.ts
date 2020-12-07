import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PresetFrontService } from '../../../../../services/preset/preset-front.service';
import { Section } from '../../../../../models/section';
import {Picto, picto} from '../../../../../models/static-data/picto';

@Component({
  selector: 'app-shared-preset-section',
  templateUrl: './shared-preset-section.component.html',
  styleUrls: ['./shared-preset-section.component.scss']
})
export class SharedPresetSectionComponent {

  /***
   * the preset is editable or not.
   */
  @Input() isEditable = false;

  @Input() set section(value: Section) {
    this._section = value;
  }

  @Input() set sectionIndex(value: number) {
    this._sectionIndex = value;
  }

  private _section: Section;
  private _sectionIndex = 0;
  public editSection = false;

  private _picto: Picto = picto;

  private _isCollapsed = false;

  constructor(private presetFrontService: PresetFrontService,
              private translateService: TranslateService) {}

  public addNewQuestion(event: Event) {
    event.preventDefault();
    this.presetFrontService.addQuestion(this._sectionIndex);
    this.notifyChanges();
  }

  public up(event: Event): void {
    event.preventDefault();
    this.presetFrontService.moveSection(this._sectionIndex, -1);
    this.notifyChanges();
  }

  public down(event: Event): void {
    event.preventDefault();
    this.presetFrontService.moveSection(this._sectionIndex, 1);
    this.notifyChanges();
  }

  public removeSection(event: Event): void {
    event.preventDefault();
    const res = confirm('Are you sure you want to delete this section ?');
    if (res) {
      this.presetFrontService.removeSection(this._sectionIndex);
      this.notifyChanges();
    }
  }

  public isNumber(value: string) {
    return /^\d+$/.test(value);
  }

  public notifyChanges() {
    if (this.isEditable) {
      this.presetFrontService.setNotifyChanges(true);
    }
  }

  get sectionIndex(): number { return this._sectionIndex; }
  get section(): Section { return this._section; }
  get sectionsNames(): Array< string> { return this.presetFrontService.sectionsNames; }
  get lang() { return this.translateService.currentLang; }

  get picto(): Picto {
    return this._picto;
  }

  get isCollapsed(): boolean {
    return this._isCollapsed;
  }

  set isCollapsed(value: boolean) {
    this._isCollapsed = value;
  }

}

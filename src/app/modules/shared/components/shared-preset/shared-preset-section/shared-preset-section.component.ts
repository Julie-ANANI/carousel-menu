import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PresetService } from '../services/preset.service';
import { Section } from '../../../../../models/section';

@Component({
  selector: 'app-shared-preset-section',
  templateUrl: './shared-preset-section.component.html',
  styleUrls: ['./shared-preset-section.component.scss']
})
export class SharedPresetSectionComponent {

  @Input() set section(value: Section) {
    this._section = value;
  }

  @Input() set sectionIndex(value: number) {
    this._sectionIndex = value;
  }

  private _section: Section;
  private _sectionIndex: number;
  public editSection = false;

  constructor(private presetService: PresetService,
              private translateService: TranslateService) {}

  public addNewQuestion(event: Event) {
    event.preventDefault();
    this.presetService.addQuestion(this._sectionIndex);
  }

  public up(event: Event): void {
    event.preventDefault();
    this.presetService.moveSection(this._sectionIndex, -1);
  }

  public down(event: Event): void {
    event.preventDefault();
    this.presetService.moveSection(this._sectionIndex, 1);
  }

  public removeSection(event: Event): void {
    event.preventDefault();
    const res = confirm('Are you sure you want to delete this section ?');
    if (res) {
      this.presetService.removeSection(this._sectionIndex);
    }
  }

  get sectionIndex(): number { return this._sectionIndex; }
  get section(): Section { return this._section; }
  get lang() { return this.translateService.currentLang; }
}

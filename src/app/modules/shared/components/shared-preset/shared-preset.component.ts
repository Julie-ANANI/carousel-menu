import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Preset } from '../../../../models/preset';
import { Section } from '../../../../models/section';

@Component({
  selector: 'app-shared-preset',
  templateUrl: './shared-preset.component.html',
  styleUrls: ['./shared-preset.component.scss']
})
export class SharedPresetComponent {

  @Input() preset: Preset;

  @Output() save = new EventEmitter<Preset>();

  private savePreset(): void {
    this.save.emit(this.preset);
  }

  public updateSection(event: Section, index: number) {
    if (event) {
      // Update section
      this.preset.sections[index] = event;
    } else {
      // delete section
      this.preset.sections.splice(index, 1);
    }
    this.savePreset();
  }

  public addSection() {
    let name = 'Section';
    if (this.preset && Array.isArray(this.preset.sections)) {
      name += this.preset.sections.length;
    }
    this.preset.sections.push({
      questions: [],
      description: 'nothing',
      label: {
        en: name,
        fr: name
      }
    });
    this.savePreset();
  }

  public moveSection(move: number, index: number) {
    const new_place = index + move;
    const sections = this.preset.sections;
    if (new_place >= 0 && new_place < sections.length) {
      sections[new_place] = sections.splice(index, 1, sections[new_place])[0];
      this.savePreset();
    }
  }

}

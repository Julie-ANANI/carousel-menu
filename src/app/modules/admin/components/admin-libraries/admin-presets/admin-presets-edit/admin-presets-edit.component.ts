import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PresetService } from '../../../../../../services/preset/preset.service';
import { Preset } from '../../../../../../models/preset';
import { Section } from '../../../../../../models/section';

@Component({
  selector: 'app-admin-presets-edit',
  templateUrl: './admin-presets-edit.component.html',
  styleUrls: ['./admin-presets-edit.component.scss']
})
export class AdminPresetsEditComponent implements OnInit {

  private _preset: Preset;

  constructor(private _activatedRoute: ActivatedRoute,
              private _presetService: PresetService) {}

  ngOnInit(): void {
    this._preset = this._activatedRoute.snapshot.data['preset'];
  }

  private savePreset(): void {
    this._presetService.save(this._preset._id, this._preset).first().subscribe( result => {
      this._preset = result;
    });
  }

  public updateSection(event: Section, index: number) {
    if (event) {
      // Update section
      this._preset.sections[index] = event;
    } else {
      // delete section
      this._preset.sections.splice(index, 1);
    }
    this.savePreset();
  }

  public addSection() {
    let name = 'Section';
    if (this._preset && Array.isArray(this._preset.sections)) {
      name += this._preset.sections.length;
    }
    this._preset.sections.push({
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
    const sections = this._preset.sections;
    if (new_place >= 0 && new_place < sections.length) {
      sections[new_place] = sections.splice(index, 1, sections[new_place])[0];
      this.savePreset();
    }
  }

  get preset() { return this._preset; }
}

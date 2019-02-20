import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PresetService } from './services/preset.service';
import { Preset } from '../../../../models/preset';

@Component({
  selector: 'app-shared-preset',
  templateUrl: './shared-preset.component.html',
  styleUrls: ['./shared-preset.component.scss']
})
export class SharedPresetComponent {

  @Input() set preset(value: Preset) {
    this.presetService.preset = value;
  }

  @Output() save = new EventEmitter<Preset>();

  constructor(private presetService: PresetService) {}

  public addSection() {
    this.presetService.addSection();
  }

  public savePreset(event: Event): void {
    event.preventDefault();
    this.save.emit(this.presetService.preset);
  }

  get preset() { return this.presetService.preset; }

}

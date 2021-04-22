import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { PresetFrontService } from '../../../../services/preset/preset-front.service';
import { Preset } from '../../../../models/preset';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-shared-preset',
  templateUrl: './shared-preset.component.html'
})
export class SharedPresetComponent implements OnInit {

  /***
   * the preset can be edit by the user or not.
   */
  @Input() isEditable = false;

  @Input() set preset(value: Preset) {
    this.presetService.preset = value;
  }

  @Input() set sectionsNames(value: Array<string>) {
    this.presetService.sectionsNames = value;
  }

  @Output() save = new EventEmitter<Preset>();

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private presetService: PresetFrontService) {}

  ngOnInit(): void {
    this.presetService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((changes) => {
      if (changes) {
        this.save.emit(this.presetService.preset);
      }
    });
  }

  public addSection(event: Event) {
    event.preventDefault();
    if (this.isEditable) {
      this.presetService.addSection();
      this._savePreset();
    }
  }

  private _savePreset() {
    if (this.isEditable) {
      this.save.emit(this.presetService.preset);
    }
  }

  get preset() { return this.presetService.preset; }

}

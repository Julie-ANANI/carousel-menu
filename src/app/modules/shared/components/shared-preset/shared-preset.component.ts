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
   * the preset can be edited by the user or not.
   */
  @Input() isEditable = false;

  /**
   * provide the lang of the innovation cards.
   */
  @Input() presetLanguages: Array<string> = [];

  @Input() set preset(value: Preset) {
    this._presetFrontService.preset = value;
  }

  @Input() set sectionsNames(value: Array<string>) {
    this._presetFrontService.sectionsNames = value;
  }

  @Output() save: EventEmitter<Preset> = new EventEmitter<Preset>();

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _presetFrontService: PresetFrontService) {}

  ngOnInit(): void {
    this._presetFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((changes) => {
      if (changes) {
        this.save.emit(this._presetFrontService.preset);
      }
    });
  }

  public addSection(event: Event) {
    event.preventDefault();
    if (this.isEditable) {
      this._presetFrontService.addSection();
      this._savePreset();
    }
  }

  private _savePreset() {
    if (this.isEditable) {
      this.save.emit(this._presetFrontService.preset);
    }
  }

  get preset() { return this._presetFrontService.preset; }

}

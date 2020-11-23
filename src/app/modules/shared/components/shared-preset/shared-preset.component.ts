import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { PresetFrontService } from '../../../../services/preset/preset-front.service';
import { Preset } from '../../../../models/preset';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-shared-preset',
  templateUrl: './shared-preset.component.html'
})
export class SharedPresetComponent implements OnInit, OnDestroy {

  @Input() set preset(value: Preset) {
    this.presetService.preset = value;
  }

  @Input() set sectionsNames(value: Array<string>) {
    this.presetService.sectionsNames = value;
  }

  @Output() save = new EventEmitter<Preset>();

  private _toBeSaved = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private presetService: PresetFrontService) {}

  ngOnInit(): void {
    this.presetService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((changes) => {
      this._toBeSaved = changes;
    });
  }

  public addSection(event: Event) {
    event.preventDefault();
    this.presetService.addSection();
  }

  public savePreset(event: Event): void {
    event.preventDefault();
    this.save.emit(this.presetService.preset);
  }

  get preset() { return this.presetService.preset; }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

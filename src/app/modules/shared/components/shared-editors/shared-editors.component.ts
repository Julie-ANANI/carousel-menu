import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Etherpad} from '../../../../models/etherpad';

type Editor = 'ETHERPAD' | 'TINY_MCE';

@Component({
  selector: 'app-shared-editors',
  templateUrl: './shared-editors.component.html'
})
export class SharedEditorsComponent implements OnInit {

  @Input() set text(value: string) {
    this._text = value;
  }

  @Input() isEditable = true;

  @Input() padHeight = '400px';

  @Input() tinymceHeight = '250px';

  @Output() textChange: EventEmitter<any> = new EventEmitter<any>();

  private _editor: Editor = 'ETHERPAD';

  private _etherpad: Etherpad = <Etherpad>{};

  private _text = '';

  constructor() { }

  ngOnInit() {
  }

  public onTextChange(value: any) {
    this.textChange.emit(value);
  }

  get editor(): Editor {
    return this._editor;
  }

  get etherpad(): Etherpad {
    return this._etherpad;
  }

  get text(): string {
    return this._text;
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {Etherpad} from '../../../../models/etherpad';

type Editor = 'ETHERPAD' | 'TINY_MCE' | '';

@Component({
  selector: 'app-shared-editors',
  templateUrl: './shared-editors.component.html',
  styleUrls: ['./shared-editors.component.scss']
})
export class SharedEditorsComponent implements OnInit {

  @Input() isEditable = true;

  @Input() editorHeight = '400px';

  editor: Editor = 'TINY_MCE';

  etherpad: Etherpad = <Etherpad>{};

  constructor() { }

  ngOnInit() {
  }

}

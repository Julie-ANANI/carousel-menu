/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, OnInit } from '@angular/core';
import * as _ from "lodash";

declare var tinymce: any;

@Component({
  selector: 'text-zone',
  templateUrl: 'shared-text-zone.component.html',
  styleUrls: ['shared-text-zone.component.styl']
})

export class SharedTextZoneComponent implements AfterViewInit, OnDestroy {

  @Input() readonly : boolean;
  @Input() data: string;


  @Input() elementId: String;
  @Output() onEditorKeyup = new EventEmitter<any>();


  constructor() { }

  editor;

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table'],
      width: 700,
      height: 250,
      statusbar: false,
      menubar: false,
      skin_url: 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
        });
      },
    });
    if(this.data && this.editor) {
      this.editor.insertContent(this.data);
    }
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

};

/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';

declare const tinymce: any;

@Component({
  selector: 'text-zone',
  templateUrl: 'shared-text-zone.component.html',
  styleUrls: ['shared-text-zone.component.scss']
})

export class SharedTextZoneComponent implements AfterViewInit, OnDestroy {

  @Input() readonly: boolean;
  @Input() data: string;


  @Input() elementId: String;
  @Output() onEditorKeyup = new EventEmitter<any>();

  private _contentHash: number;
  private editor: any;

  constructor() {
    this._contentHash = 0;
  }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table'],
      default_link_target: '_blank',
      width: 700,
      height: 250,
      statusbar: false,
      menubar: false,
      skin_url: '/assets/skins/lightgray', // Voir .angular-cli.json (apps > assets) : on importe les fichiers depuis le module (node_modules) "tinymce"
      setup: (editor: any) => {
        this.editor = editor;
        editor.on('Blur', () => {
          const actualHash = this._contentHash;
          const content = editor.getContent();
          this.contentHash();
          if (this._contentHash !== actualHash) {
            this.onEditorKeyup.emit({id: this.elementId, content: content});
          } else {
            console.log('There\'s nothing new to save');
          }
        });
      },
    });
    if(this.data && this.editor) {
      this.editor.insertContent(this.data);
      this.contentHash();
    }
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  private hashString(content: string): number {
    let hash = 0;
    let chr;
    if (content.length === 0) { return hash; }
    for (let i = 0; i < content.length; i++) {
      chr   = content.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  private contentHash() {
    if (this.editor) {
      const content = this.editor.getContent();
      this._contentHash = this.hashString(content);
    }
  }

}

/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, OnInit } from '@angular/core';

declare const tinymce: any;

@Component({
  selector: 'text-zone',
  templateUrl: 'shared-text-zone.component.html',
  styleUrls: ['shared-text-zone.component.scss']
})

export class SharedTextZoneComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() readonly: boolean;
  @Input() set data(value: string) {
    this._data = value;
    this._contentHash = this.hashString(value);
    if (this.editor) {
      this.editor.setContent(this._data);
    }
  }
  @Input() elementId: String;
  @Output() onTextChange = new EventEmitter<any>();

  private _contentHash: number;
  private _data: string;
  private editor: any;
  private _htmlId: string;

  constructor() {
    this._contentHash = 0;
  }

  ngOnInit() {
    this._htmlId = this.elementId.replace(/\s/g, '');
  }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this._htmlId,
      plugins: ['link', 'paste', 'table', 'lists', 'advlist'],
      default_link_target: '_blank',
      width: 600,
      height: 250,
      statusbar: false,
      menubar: false,
      paste_as_text: true,
      paste_auto_cleanup_on_paste: true,
      paste_remove_styles_if_webkit: true,
      paste_strip_class_attributes: true,
      paste_remove_spans: true,
      paste_remove_styles: true,
      paste_text_sticky: true,
      convert_fonts_to_spans: false,
      toolbar : 'undo redo | bold italic | bullist numlist | table | link',
      skin_url: '/assets/skins/lightgray', // Voir .angular-cli.json (apps > assets) : on importe les fichiers depuis le module (node_modules) "tinymce"
      setup: (editor: any) => {
        this.editor = editor;
        this._contentHash = this.hashString(this._data);
        editor.on('Blur', () => {
          const actualHash = this._contentHash;
          const content = editor.getContent();
          this._contentHash = this.hashString(content);
          if (this._contentHash !== actualHash) {
            this.onTextChange.emit({id: this.elementId, content: content});
          }
        });
      },
    });
    if (this._data && this.editor) {
      this.editor.setContent(this._data);
    }
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  private hashString(content: string): number {
    let hash = 0;
    let chr;
    if (!content || content.length === 0) { return hash; }
    for (let i = 0; i < content.length; i++) {
      chr   = content.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  public get htmlId(): string { return this._htmlId; }
  public get text(): string { return this._data; }

}

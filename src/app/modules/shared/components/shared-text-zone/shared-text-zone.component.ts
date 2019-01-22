import { Component, Inject, OnDestroy, AfterViewInit, EventEmitter, Input, Output, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const tinymce: any;

@Component({
  selector: 'app-text-zone',
  templateUrl: 'shared-text-zone.component.html',
  styleUrls: ['shared-text-zone.component.scss']
})

export class SharedTextZoneComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() readonly = false;
  @Input() set data(value: string) {
    this._text = value;
    this._contentHash = this.hashString(value);
    if (this.editor) {
      this.editor.setContent(this._text);
    }
  }
  @Input() elementId: String;
  @Output() onTextChange = new EventEmitter<any>();

  private _contentHash: number;
  private _text: string;
  private editor: any;
  private _htmlId: string;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {
    this._contentHash = 0;
  }

  ngOnInit() {
    this._htmlId = this.elementId.replace(/\s/g, '');
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      tinymce.init({
        selector: '#' + this._htmlId,
        plugins: ['link', 'paste', 'lists', 'advlist'], // Voir .angular-cli.json
        default_link_target: '_blank',
        width: 600,
        height: 250,
        statusbar: false,
        menubar: false,
        paste_as_text: true,
        paste_remove_styles_if_webkit: true,
        paste_retain_style_properties: 'none',
        toolbar : 'undo redo | bold italic underline | bullist numlist | link',
        skin_url: '/assets/skins/lightgray', // Voir .angular-cli.json
        setup: (editor: any) => {
          this.editor = editor;
          this._contentHash = this.hashString(this._text);
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
      if (this._text && this.editor) {
        this.editor.setContent(this._text);
      }
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      tinymce.remove(this.editor);
    }
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

  public get text(): string { return this._text; }

  public set text(value: string) {
    this._text = value; // This is in case tinymce fails, then we will be able to use the textarea
    this.onTextChange.emit({id: this.elementId, content: value});
  }

}

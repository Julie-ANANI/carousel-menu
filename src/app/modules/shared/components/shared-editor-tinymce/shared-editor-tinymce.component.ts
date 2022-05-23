import { Component, Inject, OnDestroy, AfterViewInit, EventEmitter, Input, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwellrtBackend } from "../../../swellrt-client/services/swellrt-backend";
import {rtlLanguages} from "../../../../utils/rtlLanguages";

declare const tinymce: any;
declare let swellrt: any;

interface VariableMapping {
  FIRSTNAME: string;
  LASTNAME: string;
  TITLE: string;
  COMPANY_NAME: string;
  CLIENT_NAME: string;
}

@Component({
  selector: 'app-shared-editor-tinymce',
  templateUrl: 'shared-editor-tinymce.component.html'
})

export class SharedEditorTinymceComponent implements AfterViewInit, OnDestroy {

  @Input() set variableMapping(value: VariableMapping) {
    this._variableMapping = value;
  }

  @Input() height = '250px';

  @Input() hideToolbar = false;

  @Input() useVariables = false;

  @Input() set lang(value: string) {
    this._lang = value;
    if (isPlatformBrowser(this.platformId)) {
      tinymce.remove(this._editor);
      this.initEditor();
    }
  }

  private _lang = 'en';

  @Input() set readonly(value: boolean) {
    this._readonly = value;
    this._isLoading = !this._readonly;
  }

  @Input() set data(value: string) {
    this._contentHash = SharedEditorTinymceComponent.hashString(value);
    if (this._editor && !this.useVariables && !this._isSaving) {
      this._setContent(value);
    }
    this._text = value;
    this._isSaving = false;
  }

  @Output() onTextChange: EventEmitter<any> = new EventEmitter<any>();

  private _contentHash = 0;

  private _text = '';

  private _isSaving = false;

  private _editor: any = null;

  private _htmlId = Math.random().toString(36).substr(2,10);

  private _sharedDocument: any;

  private _sharedEditor: any;

  private _sharedText = '';

  private _variableMapping: VariableMapping = {
    FIRSTNAME: 'Prénom',
    LASTNAME: 'Nom',
    TITLE: 'Nom de l\'inno',
    COMPANY_NAME: 'Nom de l\'entreprise',
    CLIENT_NAME: 'Nom du client'
  };

  private _isLoading = true;

  private _readonly = false;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _swellRTBackend: SwellrtBackend) { }

  private static hashString(content: string): number {
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

  private static _htmlToString(htmlContent: string) {
    const regex: RegExp = new RegExp(/<span style=\"[\w; :#-]*\" contenteditable=\"[\w]*\" data-original-variable=\"([A-Z_]*)\">.*<\/span>/, 'g');
    return htmlContent.replace(regex, '*|$1|*');
  }

  private _setContent(content: string) {
    this._editor.setContent(content);
    // this.editor.focus();
  }

  _configEditor(name: string) {
    // clean previous editor state
    this._sharedEditor.clean();
    if (!name) {
      // create a new text
      this._sharedText = swellrt.Text.create(this._text);
      //isLocal = true;
      //configButton("saveBtn","Save...");
    } else {
      this._sharedText = this._sharedDocument.get('documents.' + name);
      //isLocal = false;
      //configButton("saveBtn","Save", true);
      //revisionsText = text.getPlaybackTextFor(swell.TextWeb.REV_HISTORY);
      //renderRevisionList();
    }
    this._sharedEditor.set(this._sharedText);
    this._sharedEditor.edit(true);
  }

  public autoSaveRT() {
    // Add text document to the collaborative object
    // Be careful! text var is still the old reference
    this._sharedDocument.node('documents').put('text', this._sharedText);
    // Set up the editor with the new text object
    this._configEditor('text');
  }

  public insertTextAtCursor(text: string) {
    tinymce.activeEditor.execCommand('mceInsertContent', false, text);
  }

  public startCollaborativeEditor() {
    this._swellRTBackend.openDocument( 'id-document' )
      .then(_object => {
        this._sharedDocument = _object;
        if (!this._sharedDocument.node('documents')) {
          // Create a live map
          this._sharedDocument.put('documents', swellrt.Map.create());
          // Make public after initialization
          this._sharedDocument.setPublic(true);
        }

        swellrt.Editor.configure({
          traceUserAgent: true,
          logPanel: document.getElementById("log")
        });

        const editorElement = document.getElementById("editor");
        this._sharedEditor = swellrt.Editor.create(editorElement);

        this._sharedEditor.setSelectionHandler((range: any, _editor: any, _selection: any) => {
          console.log('selection changed ' + range);
        });

        this._configEditor(null);

        this.autoSaveRT();
      }, err => {
        console.error(err);
      });
  }

  get htmlId(): string {
    return this._htmlId;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value; // This is in case tinymce fails, then we will be able to use the textarea
    this.onTextChange.emit({content: value});
  }

  get readonly(): boolean {
    return this._readonly;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get editor(): any {
    return this._editor;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  get sharedEditor(): any {
    return this._sharedEditor;
  }

  get variableMapping(): VariableMapping {
    return this._variableMapping;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && !this._readonly) {
      this.initEditor();
    }
  }

  initEditor() {
    this._isLoading = true;
    tinymce.init({
      selector: `[id="${this._htmlId}"]`,
      theme: "silver",
      directionality: (rtlLanguages.includes(this.lang))? 'rtl':'ltr',
      plugins: ['link', 'lists', 'advlist', 'code', 'searchreplace', 'wordcount', 'autoresize', 'fontsizeselect'], // Voir .angular-cli.json
      variable_valid: ["TITLE", "FIRSTNAME", "LASTNAME", "COMPANY_NAME", "CLIENT_NAME"],
      variable_mapper: this._variableMapping,
      default_link_target: '_blank',
      width: "inherit",
      height: this.height,
      statusbar: true,
      menubar: false,
      elementpath: false,
      branding: false,
      paste_as_text: true,
      paste_remove_styles_if_webkit: true,
      paste_block_drop: false,
      paste_data_images: true,
      fontsize_formats: "8pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
      toolbar : !this.hideToolbar && 'undo redo | styleselect | fontsizeselect | bold italic underline forecolor casechange' +
        '| bullist numlist | link | code ',
      content_style: 'body { font-size: 16px; }',
      setup: (editor: any) => {
        this._editor = editor;
        this._contentHash = SharedEditorTinymceComponent.hashString(this._text);
        /**
         * Why we use 'change' event as a trigger to send modified context?
         * Before we used 'MouseLeave' event, but sometimes, this trigger doesn't work, the modification will be missing
         * So we use 'change' event as a trigger, send context as soon as the users make changes
         */
        editor.on('change', ()=>{
          const actualHash = this._contentHash;
          const content = SharedEditorTinymceComponent._htmlToString(editor.getContent());
          this._contentHash = SharedEditorTinymceComponent.hashString(content);
          if (this._contentHash !== actualHash) {
            this._isSaving = true;
            this.onTextChange.emit({content: content});
          }
        })
      }
    });
    if (this._text && this._editor) {
      this._setContent(this._text);
    }
    setTimeout(() => {
      this._isLoading = false;
    }, 400);
  }

  get lang(): string {
    return this._lang;
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      tinymce.remove(this._editor);
    }
  }
}

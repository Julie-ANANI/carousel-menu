import { Component, Inject, OnDestroy, AfterViewInit, EventEmitter, Input, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwellrtBackend } from "../../../swellrt-client/services/swellrt-backend";

declare const tinymce: any;
declare let swellrt: any;

@Component({
  selector: 'app-text-zone',
  templateUrl: 'shared-text-zone.component.html',
  styleUrls: ['shared-text-zone.component.scss']
})

export class SharedTextZoneComponent implements AfterViewInit, OnDestroy {

  @Input() readonly = false;

  @Input() hideToolbar = false;

  @Input() useVariables = false;

  @Input() set data(value: string) {
    this._text = value;
    this._contentHash = SharedTextZoneComponent.hashString(value);
    if (this.editor) {
      this.editor.setContent(this._text);
    }
  }

  @Input() set variableMapping(value: any) {
    this._variableMapping = value;
  }

  @Input() zoneHeight: string = '250';

  @Output() onTextChange = new EventEmitter<any>();

  private _contentHash: number;

  private _text: string;

  private editor: any;

  private _htmlId: string = Math.random().toString(36).substr(2,10);

  private _sharedDocument: any;
  private _sharedEditor: any;
  private _sharedText: any;
  //private _name: string;

  private _variableMapping: any = {
    FIRSTNAME: 'Prénom',
    LASTNAME: 'Nom',
    TITLE: 'Nom de l\'inno',
    COMPANY_NAME: 'Nom de l\'entreprise',
    CLIENT_NAME: 'Nom du client'
  };

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _swellRTBackend: SwellrtBackend) {
    this._contentHash = 0;
  }

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

  ngAfterViewInit() {
    const plugins = ['link', 'paste', 'lists', 'advlist', 'textcolor'];
    if (this.useVariables) {
      plugins.push('variable');
    }
    if (isPlatformBrowser(this.platformId) && !this.readonly) {
      tinymce.init({
        selector: '#' + this._htmlId,
        plugins: plugins, // Voir .angular-cli.json
        variable_valid: ["TITLE", "FIRSTNAME", "LASTNAME", "COMPANY_NAME", "CLIENT_NAME"],
        variable_mapper: this._variableMapping,
        default_link_target: '_blank',
        width: "inherit",
        height: this.zoneHeight,
        statusbar: false,
        menubar: false,
        paste_as_text: true,
        paste_remove_styles_if_webkit: true,
        // paste_webkit_styles: "color font-size font-weight",
        // paste_retain_style_properties: "color font-size font-weight",
        paste_retain_style_properties: 'none',
        fontsize_formats: "8pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
        toolbar : !this.hideToolbar && 'undo redo | fontsizeselect | bold italic underline forecolor | bullist numlist | link',
        skin_url: '/assets/skins/lightgray', // Voir .angular-cli.json
        setup: (editor: any) => {
          this.editor = editor;
          this._contentHash = SharedTextZoneComponent.hashString(this._text);
          editor
            .on('MouseLeave', () => {
              //When the user leaves the tinyMCE box, we save the content
              const actualHash = this._contentHash;
              const content = this._htmlToString(editor.getContent());
              this._contentHash = SharedTextZoneComponent.hashString(content);
              if (this._contentHash !== actualHash) {
                this.onTextChange.emit({content: content});
              }
              /*if(this._sharedEditor) {
                this._sharedEditor.set('text', this._text);
              }
              console.log("Goodbye motherfucker!");*/
            });
        },
      });
      if (this._text && this.editor) {
        this.editor.setContent(this._text);
      }
    }
  }

  private _htmlToString(htmlContent: string) {
    const regex: RegExp = new RegExp(/<span style=\"[\w; :#-]*\" contenteditable=\"[\w]*\" data-original-variable=\"([A-Z_]*)\">.*<\/span>/, 'g');
    return htmlContent.replace(regex, '*|$1|*');
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




    // this._swellRTBackend.openDocument( this.elementId.toString() )
    //   .then(result=> {
    //     if (result) {
    //       this._sharedDocument = result;
    //       if (!this._sharedDocument.node('documents')) {
    //         // Create a live map
    //         this._sharedDocument.put('documents', swellrt.Map.create());
    //         // Make public after initialization
    //         this._sharedDocument.setPublic(true);
    //       }
    //
    //       // Configure the actual editor
    //       this._sharedEditor = swellrt.Editor.create(document.getElementById("editor"));
    //       this._sharedEditor.setSelectionHandler((range, editor, selection) => {
    //         console.log('selection changed '+ range);
    //       });
    //
    //       //Configure function
    //       // clean previous editor state
    //       this._sharedEditor.clean();
    //       if (!this._name) {
    //         // create a new text
    //         this._sharedtext = swellrt.Text.create("Write here your document. This text is not stored yet!");
    //         /*isLocal = true;
    //         configButton("saveBtn","Save...");*/
    //       } else {
    //         this._sharedtext = this._sharedDocument.get('documents.txt');
    //         /*isLocal = false;
    //         configButton("saveBtn","Save", true);
    //         revisionsText = text.getPlaybackTextFor(swell.TextWeb.REV_HISTORY);
    //         renderRevisionList();*/
    //       }
    //       // Show the text in the editor,
    //       // edit mode is disabled by default
    //       this._sharedEditor.set(this._sharedtext);
    //       // Show title for new document
    //       //configTitle(name);
    //       // Show Edit button
    //       //configButton("editBtn", "Edit On");
    //       this._sharedEditor.edit(true);
    //       //////////
    //
    //     }
    //   }, err => {
    //     console.error(err);
    //   });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      tinymce.remove(this.editor);
    }
  }

  public get htmlId(): string {
    return this._htmlId;
  }

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    this._text = value; // This is in case tinymce fails, then we will be able to use the textarea
    this.onTextChange.emit({content: value});
  }

}

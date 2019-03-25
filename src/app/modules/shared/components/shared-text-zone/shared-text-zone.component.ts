import { Component, Inject, OnDestroy, AfterViewInit, EventEmitter, Input, Output, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwellrtBackend } from "../../../swellrt-client/services/swellrt-backend";

declare const tinymce: any;
declare let swellrt: any

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

  private _sharedDocument: any;
  private _sharedEditor: any;
  private _sharedText: any;
  //private _name: string;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _swellRTBackend: SwellrtBackend
  ) {
    this._contentHash = 0;
  }

  ngOnInit() {
    this._htmlId = this.elementId.replace(/\s/g, '');
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && !this.readonly) {
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
          editor
            .on('Blur', () => {
              const actualHash = this._contentHash;
              const content = editor.getContent();
              this._contentHash = this.hashString(content);
              if (this._contentHash !== actualHash) {
                this.onTextChange.emit({id: this.elementId, content: content});
              }
              /*if(this._sharedEditor) {
                this._sharedEditor.set('text', this._text);
              }
              console.log("Goodbye motherfucker!");*/
            })
            .on('click', () => {
              //this.startCollaborativeEditor();
            })
        },
      });
      if (this._text && this.editor) {
        this.editor.setContent(this._text);
      }
    }
  }

  _configEditor(name) {
    // clean previous editor state
    this._sharedEditor.clean();
    if (!name) {
      // create a new text
      this._sharedText = swellrt.Text.create(this._text);
      //isLocal = true;
      //configButton("saveBtn","Save...");
    } else {
      this._sharedText = this._sharedDocument.get('documents.'+name);
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

  public startCollaborativeEditor() {
    this._swellRTBackend.openDocument( this.elementId.toString() )
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

        let editorElement = document.getElementById("editor");
        this._sharedEditor = swellrt.Editor.create(editorElement);

        this._sharedEditor.setSelectionHandler((range, editor, selection) => {
          console.log('selection changed '+ range);
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

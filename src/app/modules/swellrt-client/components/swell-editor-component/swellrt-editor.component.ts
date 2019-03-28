import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../../../services/auth/auth.service";
import {SwellrtBackend} from "../../services/swellrt-backend";

declare let swellrt;

@Component({
  selector: 'swellrt-editor',
  templateUrl: './swellrt-editor.component.html',
  styleUrls: ['./swellrt-editor.component.scss']
})

export class SwellRTEditorComponent implements OnInit {

  private _editor = null;
  private _document = null;
  private _text = null;
  private _revisionsText = null;
  private _isLocal = false;
  private _revList = null;


  private _documentList = [];

  constructor(private _authService: AuthService,
              private _swellRTBackend: SwellrtBackend) {}

  ngOnInit(): void {
    console.log(this._authService);
    console.log(this._swellRTBackend);
    console.log(swellrt);

    this._swellRTBackend.openDocument("testId+juan" )
      .then(_document => {
        this._document = _document;

        if(this._document) {
          if (!this._document.node('documents')) {
            // Create a live map
            this._document.put('documents', swellrt.Map.create());
            // Make public after initialization
            this._document.setPublic(true);
          }

          swellrt.Editor.configure({
            traceUserAgent: true,
            logPanel: document.getElementById("log")
          });


          this._editor = swellrt.Editor.create(document.getElementById("editor"));
          this._editor.setSelectionHandler((range, editor, selection) => {
            console.log('selection changed '+ range);
          });

          this.configureEditor(null);

          let keys = this._document.node('documents').keys();
          this._documentList = keys;
          console.log(this._documentList);

          //this.renderDocumentList();
          // Listen for changes in the set of documents
          // update the displayed list.
          let that = this;
          this._document.node('documents').addListener(function(e) {
            that.renderDocumentList();
          });
        }

      }, err => {
        console.error(err);
      });


  }

  public renderDocumentList() {
    let that = this;
    let documentList = document.getElementById("documentList");
    documentList.innerHTML = "";
    let keys = this._document.node('documents').keys();
    for (let i = 0; i < keys.length; i++) {
      let name = keys[i];
      let li = document.createElement("li");
      li.classList.add("list-group-item");
      documentList.appendChild(li);
      let title = document.createElement("span");
      title.innerHTML = name;
      li.appendChild(title);
      let iconPencil = document.createElement("span");
      iconPencil.className = "btnInline glyphicon glyphicon-pencil pull-right";
      iconPencil.addEventListener("click", function(name) {
        that.configureEditor(name);
      }.bind(this, name));
      li.appendChild(iconPencil);
      let iconTrash = document.createElement("span");
      iconTrash.className = "btnInline glyphicon glyphicon-trash pull-right";
      /*iconTrash.addEventListener("click", function(name) {
        that.removeDocument(name);
      }.bind(this, name));*/
      li.appendChild(iconTrash);
    }
  }

  public saveDocument() {
    if (!this._isLocal)
      return;
    const name = window.prompt("Please, set a name:","");
    if (!name || name.length == 0)
      return;
    // Add text document to the collaborative object
    // Be careful! text var is still the old reference
    this._document.node('documents').put(name, this._text);
    // Set up the editor with the new text object
    this.configureEditor(name);
  }


  public configureEditor(name: string) {
    this._editor.clean();

    if (!name) {
      // create a new text
      this._text = swellrt.Text.create("Write here your document. This text is not stored yet!");
      this._isLocal = true;
      this.configButton("saveBtn","Save...", false);
    } else {
      this._text = this._document.get('documents.'+name);
      this._isLocal = false;
      this.configButton("saveBtn","Save", true);
      this._revisionsText = this._text.getPlaybackTextFor(swellrt.TextWeb.REV_HISTORY);
      console.log(this._revisionsText);
      this.renderRevisionList();
    }
    // Show the text in the editor,
    // edit mode is disabled by default
    this._editor.set(this._text);
    // Show title for new document
    //configTitle(name);
    // Show Edit button
    this.configButton("editBtn", "Edit On", false);

  }

  public renderRevisionList() {
    this._revList = []; // global
    let revIterator = this._revisionsText.getHistoryIterator();

    let loadRevisions = (onFinish) => {
      revIterator.prev(r => {
        if (r) {
          this._revList.push(r);
          loadRevisions(revIterator);
        } else {
          renderRevisions();
        }
      });
    };

    let renderRevisions = () => {
      let revListElement = document.getElementById("revlist");
      revListElement.innerHTML = "<span>Latest</span>";
      for (let i in this._revList) {
        let rev = this._revList[i];
        let div = document.createElement("div");
        div.id = rev.appliedAtVersion;
        let dt = new Date(rev.time);
        div.innerHTML = "<span>" + dt.toLocaleDateString() + " " + dt.toLocaleTimeString() + "</span>";
        // div.innerHTML += "<br><span>"+ rev.author +"</span>";
        revListElement.appendChild(div);
      }
    };

    loadRevisions(null);
  }


  public configButton(id, value, hide) {
    let btn = document.getElementById(id);
    if (value)
      btn['value']= value;
    if (hide)
      btn.classList.add("hidden");
    else
      btn.classList.remove("hidden");
  }


  public editDocument() {
    if (!this._editor.hasDocument()) return;
    if (this._editor.isEditing()) {
      this._editor.edit(false);
      this.configButton("editBtn", "Edit On", false);
    } else {
      this._editor.edit(true);
      this.configButton("editBtn", "Edit Off", false);
    }
  }

  get editor() {
    return this._editor;
  }

  get documentList() {
    return this._documentList;
  }
}

import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import {FileUploader, FilterFunction, FileItem, ParsedResponseHeaders} from "ng2-file-upload";

const base_api_url = 'http://localhost:3000/api/media';

@Component({
  selector: 'app-shared-upload-zone-photo',
  templateUrl: './shared-upload-zone-photo.component.html',
  styleUrls: ['./shared-upload-zone-photo.component.styl']
})

export class SharedUploadZonePhotoComponent implements OnInit{

  private _filters: Array<FilterFunction>;
  private _uploader: FileUploader;

  @Input() public mediaContainer: any;
  @Input() public type: any;
  // @Output() public cbFn: any;
  @Output() public cbFn: EventEmitter <any> = new EventEmitter();


  ngOnInit() {
    this._filters = Array<FilterFunction>();
    //this._createFilter(this.type);
    this._uploader = new FileUploader({
      url: base_api_url,
      autoUpload: true,
      filters: this._filters,
      maxFileSize: 1024 * 1024,
      additionalParameter: {
        'test': 'testParam'
      }
    });

    this._uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      if(status !== 200) {
        console.error("Fuck!");
      } else {
        try{
          const id = JSON.parse(response);
          //Call back to the media
          this.cbFn.emit(id);
        } catch(ex) {
          console.error(`There's an error: ${ex}`);
        }
      }
    }
  }

  private _createFilter(type: string): any {
    switch(type) {
      case('images'):
        const imagesFilters = ['gif', 'jpeg', 'jpg', 'png'];
        for (const filterName of imagesFilters) {
          let filt = {
            name: filterName,
            fn: (item: any): boolean => {
              let fileExt = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();
              //return !(this.allowedFileTypes.indexOf(fileExt) === -1);
              return fileExt === filterName;
            }
          };
          this._filters.push(filt);
        }
        break;
      case('documents'):
        break;
      case('videos'):
        break;
      default:

    }
  }

  constructor() {  }

  get uploader() {
    return this._uploader;
  }

  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

}

import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { FileUploader, FilterFunction, FileItem, ParsedResponseHeaders, FileUploaderOptions } from 'ng2-file-upload';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-shared-upload-zone-photo',
  templateUrl: './shared-upload-zone-photo.component.html',
  styleUrls: ['./shared-upload-zone-photo.component.scss']
})

export class SharedUploadZonePhotoComponent implements OnInit {

  private _filters: Array<FilterFunction>;
  private _uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  // public hasAnotherDropZoneOver = false;
  public loading = false;

  @Input() public type: any;
  @Output() public cbFn: EventEmitter <any> = new EventEmitter();
  @ViewChild('fileInput') fileInput;


  ngOnInit() {
    this._filters = Array<FilterFunction>();
    // this._createFilter(this.type);
    this._uploader = new FileUploader({
      url: environment.apiUrl + '/media',
      autoUpload: true,
      filters: this._filters,
      // maxFileSize: 1024 * 1024,
      additionalParameter: {} // à transmettre au serveur au moment de la sauvegarde
    });
    const uo: FileUploaderOptions = {};
    uo.headers = [{ name: 'api-token', value : 'umi-front-application,TXnKAVHh0xpiFlC8D01S3e8ZkD45VIDJ' } ];
    this._uploader.setOptions(uo);

    this._uploader.onBeforeUploadItem = (item: FileItem): any => {
      this.loading = true;
    };

    this._uploader.onErrorItem = (item: FileItem, response: string, status: number) => {
      this._notificationsService.error('ERROR.ERROR', response);
      this.loading = false;
    };

    this._uploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      if (status !== 200) {
        console.error(response);
      } else {
        try {
          const image = JSON.parse(response);
          this.loading = false;
          // Call back to the media
          this.cbFn.emit(image);
        } catch (ex) {
          console.error(`There's an error: ${ex}`);
        }
      }
    }
  }

  /*private _createFilter(type: string): any {
    switch (type) {
      case('images'):
        const imagesFilters = ['gif', 'jpeg', 'jpg', 'png'];
        for (const filterName of imagesFilters) {
          const filt = {
            name: filterName,
            fn: (item: any): boolean => {
              const fileExt = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();
              // return !(this.allowedFileTypes.indexOf(fileExt) === -1);
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
  }*/

  constructor(private _notificationsService: TranslateNotificationsService) {  }

  get uploader() {
    return this._uploader;
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  /*public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }*/

}

import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent } from 'ngx-file-drop';
import { Http } from '../../../../services/http.service';
// import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-shared-upload-zone-photo',
  templateUrl: './shared-upload-zone-photo.component.html',
  styleUrls: ['./shared-upload-zone-photo.component.scss']
})

export class SharedUploadZonePhotoComponent {

  public hasBaseDropZoneOver = false;
  public loading = false;

  @Input() uri: string;

  @Output() public cbFn: EventEmitter <any> = new EventEmitter();

  @ViewChild('fileInput') fileInput: any;

  constructor(// private notificationsService: TranslateNotificationsService,
              private http: Http) {}

  public dropped(event: UploadEvent) {
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

           this.http.upload(environment.apiUrl + this.uri, file)
           .subscribe((data: any) => {
            // Sanitized logo returned from backend
             console.log(data);
          });
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any) {
    console.log('fileOver ' + event);
  }

  public fileLeave(event: any) {
    console.log('fileLeave ' + event);
  }


  /*
  ngOnInit() {

    this._uploader = new FileUploader({
      url: environment.apiUrl + this.uri,
      autoUpload: true,
      // maxFileSize: 1024 * 1024,
      additionalParameter: {} // à transmettre au serveur au moment de la sauvegarde
    });

    const uo: FileUploaderOptions = {};

    uo.headers = [{ name: 'api-token', value : 'umi-front-application,TXnKAVHh0xpiFlC8D01S3e8ZkD45VIDJ' } ];

    this._uploader.setOptions(uo);

    this._uploader.onBeforeUploadItem = (_: FileItem): void => {
      this.loading = true;
    };

    this._uploader.onErrorItem = (_item: FileItem, response: string, _status: number) => {
      this.notificationsService.error('ERROR.ERROR', response);
      this.loading = false;
    };

    this._uploader.onCompleteItem = (_item: FileItem, response: string, status: number, _header: ParsedResponseHeaders) => {
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
  */

}

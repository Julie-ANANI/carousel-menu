import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile } from 'ngx-file-drop';
import { Http } from '../../../../services/http';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-shared-upload-zone-photo',
  templateUrl: './shared-upload-zone-photo.component.html',
  styleUrls: ['./shared-upload-zone-photo.component.scss']
})

export class SharedUploadZonePhotoComponent implements OnInit {

  private _files: Array<UploadFile> = [];
  public hasBaseDropZoneOver = false;
  public loading = false;

  @Input() uri: string;

  @Output() public cbFn: EventEmitter <any> = new EventEmitter();

  @ViewChild('fileInput') fileInput: any;

  constructor(private notificationsService: TranslateNotificationsService,
              private http: Http) {}

  public dropped(event: UploadEvent) {
    this._files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

           // You could upload it like this:
           const formData = new FormData();
           formData.append('logo', file, relativePath);

           // Headers
           const headers = new HttpHeaders({
            'api-token': 'umi-front-application,TXnKAVHh0xpiFlC8D01S3e8ZkD45VIDJ'
          });

           this.http.post(environment.apiUrl + this.uri, formData, { headers: headers, responseType: 'application/json' })
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

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}

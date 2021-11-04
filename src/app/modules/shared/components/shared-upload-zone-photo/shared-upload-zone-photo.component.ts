import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { FileSystemFileEntry } from 'ngx-file-drop';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../services/error/error-front.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-shared-upload-zone-photo',
  templateUrl: './shared-upload-zone-photo.component.html'
})

export class SharedUploadZonePhotoComponent {

  /**
   * make it false to not upload to the cloudinary
   * and cbFn will emit the actual file.
   * No need to provide uri.
   */
  @Input() uploadCloudinary = true;

  @Input() uri = '';

  @Output() cbFn: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('fileInput',  { read: ElementRef, static: true }) fileInput: any;

  private _isUploading = false;

  private _isWrongFormat = false;

  private _isWrongSize = false;

  constructor(private _translateNotificationsService: TranslateNotificationsService,
              private _httpClient: HttpClient) { }

  public dropped(event: any) {
    if (!this._isUploading) {
      this._isWrongFormat = false;
      this._isWrongSize = false;

      if (event.files) {
        this._isUploading = true;
        for (const droppedFile of event.files) {
          // Is it a file?
          if (droppedFile.fileEntry && droppedFile.fileEntry.isFile) {
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
            fileEntry.file(this.uploadFile);
          } else {
            // It was a directory (empty directories are added, otherwise only files)
            this._isUploading = false;
            this._isWrongFormat = true;
          }
        }
      } else if (event.target && event.target.files) {
        this._isUploading = true;
        for (const file of event.target.files) {
          this.uploadFile(file);
        }
      }
    }
  }


  private uploadFile = (file: File) => {
    const _type = file.type.split('/');

    if (!this._isWrongFormat && (_type[1] === 'jpeg' || _type[1] === 'jpg')) {
      if (file.size > 5242881) {
        this._isUploading = false;
        this._isWrongSize = true;
      } else {

        if (this.uploadCloudinary) {
          const _formData = new FormData();
          _formData.append('file', file, file.name);
          this._httpClient.post(this.uri, _formData).pipe(first()).subscribe((data: any) => {
            // Sanitized image returned from backend.
            this.cbFn.emit(data);
            this._isUploading = false;
          }, (err: HttpErrorResponse) => {
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
            this._isUploading = false;
            console.error(err.message);
          });
        } else {
          this.cbFn.emit(file);
          this._isUploading = false;
        }

      }
    } else {
      this._isUploading = false;
      this._isWrongFormat = true;
    }
  }

  get isUploading(): boolean {
    return this._isUploading;
  }

  get isWrongFormat(): boolean {
    return this._isWrongFormat;
  }

  get isWrongSize(): boolean {
    return this._isWrongSize;
  }

}

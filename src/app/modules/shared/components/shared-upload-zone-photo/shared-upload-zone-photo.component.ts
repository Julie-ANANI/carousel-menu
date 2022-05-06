import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { FileSystemFileEntry } from 'ngx-file-drop';
import {HttpErrorResponse} from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import {ErrorFrontService} from '../../../../services/error/error-front.service';
import {first} from 'rxjs/operators';
import {MediaService} from '../../../../services/media/media.service';

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

  @Input() mediaId: string = null;

  @Output() cbFn: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('fileInput',  { read: ElementRef, static: true }) fileInput: any;

  private _isUploading = false;

  private _isWrongFormat = false;

  private _isWrongSize = false;

  constructor(private _translateNotificationsService: TranslateNotificationsService,
              private _mediaService: MediaService) { }

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
      if (file.size > 5242880) {
        this._isUploading = false;
        this._isWrongSize = true;
      } else {
        if (this.uploadCloudinary) {
          const _formData = new FormData();
          _formData.set('file', file, file.name);
          let promise = null;
          if (this.mediaId) {
            promise = this._mediaService.replace(_formData, this.mediaId).pipe(first());
          } else {
            promise = this._mediaService.upload(this.uri, _formData).pipe(first());
          }
          promise.subscribe((data: any) => {
            // Sanitized image returned from backend.
            this.cbFn.emit(data);
            this._isUploading = false;
          }, (err: HttpErrorResponse) => {
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
            this._isUploading = false;
            console.error(err);
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

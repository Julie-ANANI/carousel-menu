import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { HttpClient } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-shared-upload-zone-photo',
  templateUrl: './shared-upload-zone-photo.component.html',
  styleUrls: ['./shared-upload-zone-photo.component.scss']
})

export class SharedUploadZonePhotoComponent {

  @Input() uri: string;

  @Output() cbFn: EventEmitter <any> = new EventEmitter();

  @ViewChild('fileInput') fileInput: any;

  loading = false;

  constructor(private _translateNotificationsService: TranslateNotificationsService,
              private _httpClient: HttpClient) { }


  public dropped(event: any) {
    if (this.loading === false) {
      if (event.files) {
        this.loading = true;

        for (const droppedFile of event.files) {
          // Is it a file?
          if (droppedFile.fileEntry && droppedFile.fileEntry.isFile) {
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
            fileEntry.file(this.uploadFile);
          } else {
            // It was a directory (empty directories are added, otherwise only files)
            this.loading = false;
          }
        }
      } else if (event.target.files) {
        this.loading = true;

        for (const file of event.target.files) {
          this.uploadFile(file);
        }

      }
    }
  }


  private uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    this._httpClient.post(this.uri, formData).subscribe((data: any) => {
      // Sanitized logo returned from backend.
      this.loading = false;
      this.cbFn.emit(data);
      }, () => {
      this.loading = false;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }

}

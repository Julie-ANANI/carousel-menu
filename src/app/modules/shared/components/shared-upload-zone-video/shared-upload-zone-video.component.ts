import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { Http, Response } from '../../../../services/http';
import { videoDomainRegEx, videoIdRegEx } from '../../../../utils/regex';
import { DomSanitizer } from '@angular/platform-browser';
import { Video } from '../../../../models/media';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-shared-upload-zone-video',
  templateUrl: './shared-upload-zone-video.component.html',
  styleUrls: ['./shared-upload-zone-video.component.scss']
})
export class SharedUploadZoneVideoComponent implements OnInit {

  private _videoUrlInput: string;
  private _videoParameters: string[];

  @Output() public cbFn: EventEmitter<any> = new EventEmitter();

  constructor(private _http: Http) {
  }

  ngOnInit() {
    this._videoParameters = ['showinfo=0', 'color=white', 'rel=0', 'autohide=1', 'playsinline=1', 'modestbranding=1', 'iv_load_policy=3'];
  }

  addVideo() {
    const videoProvider = videoDomainRegEx.exec(this._videoUrlInput)[0]; // vimeo || youtube
    const givenUrl = this._videoUrlInput; // URL donnée par l'utilisateur
    this._videoUrlInput = ''; // On vide le formulaire


    if (videoProvider) {
      const videoKey = videoIdRegEx.exec(givenUrl)[1] || videoIdRegEx.exec(givenUrl)[2]; // ID de la vidéo chez le provider
      let returnValue: Video;
      switch (videoProvider) {
        case 'vimeo': {
          const embeddableUrl = 'https://player.vimeo.com/video/' + videoKey + this._getUrlArgs();
          returnValue = {
            url: givenUrl,
            public_id: videoKey,
            embeddableUrl: embeddableUrl,
            provider: 'vimeo',
            thumbnail: ''
          };
        } break;
        default: {
          const embeddableUrl = 'https://www.youtube.com/embed/' + videoKey + this._getUrlArgs();
          returnValue = {
            url: givenUrl,
            public_id: videoKey,
            embeddableUrl: embeddableUrl,
            provider: 'youtube',
            thumbnail: 'https://i.ytimg.com/vi/' + videoKey + '/hqdefault.jpg'
          };
        }
      }
      this.cbFn.emit(returnValue);
    }
  }

  private _getUrlArgs(): string { // Transform params to a string ?options=value&....
    let paramsString = '?';
    for (const parameters of this._videoParameters) {
      paramsString += parameters + '&';
    }
    paramsString = paramsString.slice(0, -1); // Remove last &
    return paramsString;
  }

  get videoUrlInput(): string {
    return this._videoUrlInput;
  }

  set videoUrlInput(value: string) {
    this._videoUrlInput = value;
  }
}

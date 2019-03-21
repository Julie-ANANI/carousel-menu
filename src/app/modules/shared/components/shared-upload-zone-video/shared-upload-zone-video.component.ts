import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { videoDomainRegEx, vimeoVideoId, youtubeVideoId } from '../../../../utils/regex';
import { environment } from '../../../../../environments/environment';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-shared-upload-zone-video',
  templateUrl: './shared-upload-zone-video.component.html',
  styleUrls: ['./shared-upload-zone-video.component.scss']
})

export class SharedUploadZoneVideoComponent implements OnInit {

  private _videoUrlInput: string;

  private _videoParameters: Array<string>;

  @Output() public cbFn: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this._videoParameters = [
      'showinfo=0',
      'color=white',
      'rel=0',
      'autohide=1',
      'playsinline=1',
      'modestbranding=1',
      'iv_load_policy=3',
      'origin=' + environment.clientUrl
    ];
  }

  addVideo(event: Event): void {
    event.preventDefault();

    const videoProviderReg = videoDomainRegEx.exec(this._videoUrlInput);

    const videoProvider = videoProviderReg ? videoProviderReg[0] : null; // vimeo || youtube

    const givenUrl = this._videoUrlInput; // URL donnée par l'utilisateur

    this._videoUrlInput = ''; // On vide le formulaire


    if (videoProvider) {
      switch (videoProvider) {
        case 'vimeo': {
          const videoKey = vimeoVideoId.exec(givenUrl)[0]; // ID de la vidéo chez le provider
          const embeddableUrl = 'https://player.vimeo.com/video/' + videoKey + this._getUrlArgs();
          this.cbFn.emit({
            url: givenUrl,
            public_id: videoKey,
            embeddableUrl: embeddableUrl,
            provider: 'vimeo',
            thumbnail: ''
          });
        } break;
        case 'youtube': {
          const videoKey = youtubeVideoId.exec(givenUrl)[1]; // ID de la vidéo chez le provider
          const embeddableUrl = 'https://www.youtube.com/embed/' + videoKey + this._getUrlArgs();
          this.cbFn.emit({
            url: givenUrl,
            public_id: videoKey,
            embeddableUrl: embeddableUrl,
            provider: 'youtube',
            thumbnail: 'https://i.ytimg.com/vi/' + videoKey + '/hqdefault.jpg'
          });
        }
      }
    } else {
      console.error(`${givenUrl} is not a valid video input`);
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

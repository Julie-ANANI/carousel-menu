import { Component, Input, OnInit } from '@angular/core';
import { Http, Response } from '../../../../services/http';
import { videoDomainRegEx, videoIdRegEx } from '../../../../utils/regex';
import { DomSanitizer } from '@angular/platform-browser';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-shared-upload-zone-video',
  templateUrl: './shared-upload-zone-video.component.html',
  styleUrls: ['./shared-upload-zone-video.component.styl']
})
export class SharedUploadZoneVideoComponent implements OnInit {

  @Input() public mediaContainer: any;

  private _videoUrlInput = '';
  private videoParameters: any;

  constructor(private _sanitize: DomSanitizer,
              private _http: Http) { }

  ngOnInit() {
    this.videoParameters = ['showinfo=0', 'color=white', 'rel=0', 'autohide=1', 'playsinline=1', 'modestbranding=1', 'iv_load_policy=3'];
  }


  addVideo() {
    const url = this.normalizeUrl(this._videoUrlInput) + this.getParams(); // Normalize the URL
    this._videoUrlInput = '';

    for (const media of this.mediaContainer) { // verification that video isn't already existing
      if (media.type === 'VIDEO' && media.url === url) {
        return new Error ('VIDEO_ALREADY_ADDED');
      }
    }

    for (const media of this.mediaContainer) { // Else, reset all media to not primary
      media.isPrimary = false;
    }

    this.mediaContainer.push({
      url: this._sanitize.bypassSecurityTrustResourceUrl(url),
      type: 'VIDEO',
      thumbnail: null,
      isPrimary: true // add the video as a primary media (video is more important that photo cf Adrien)
    });

    this.updateThumbnail(url, this.mediaContainer[this.mediaContainer.length - 1]);
  }

  normalizeUrl(url: string): string {
    const videoKey = videoIdRegEx.exec(url)[1] || videoIdRegEx.exec(url)[2];
    return (videoDomainRegEx.exec(url)[0] === 'vimeo' ? 'https://player.vimeo.com/video/' : 'https://www.youtube.com/embed/') + videoKey;
  }

  updateThumbnail(url: string, videoObj: any) {

    if (!videoDomainRegEx.test(url)) {
      console.error('NOT_VALID_VIDEO_URL');
      return new Error('NOT_VALID_VIDEO_URL');
    }
    else {
      if (videoDomainRegEx.exec(url)[0] === 'youtube') {
        const videoKey = videoIdRegEx.exec(url)[1] || videoIdRegEx.exec(url)[2];
        videoObj.thumbnail = 'https://i.ytimg.com/vi/' + videoKey + '/hqdefault.jpg';
      }
      else if (videoDomainRegEx.exec(url)[0] === 'vimeo') {
        const videoKey = videoIdRegEx.exec(url)[1] || videoIdRegEx.exec(url)[2];
        this._http.get('https://vimeo.com/api/v2/video/' + videoKey + '.json')
          .map((res: Response) => res)
          .catch((error: Response) => { console.log(error); return Observable.throw(error) })
          .subscribe(res => {
            console.log(JSON.parse(res._body)[0]);
            const thumbSRClarge = JSON.parse(res._body)[0].thumbnail_large;
            const thumbSplit = thumbSRClarge.split(/\d{3}(?=.jpg)/);
            videoObj.thumbnail = thumbSplit[0] + '1280x720' + thumbSplit[1];
          });
      }
    }

  }

  getParams(): string { // Transform params to a string ?options=value&....
    let paramsString = '?';
    for (const parameters of this.videoParameters) {
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

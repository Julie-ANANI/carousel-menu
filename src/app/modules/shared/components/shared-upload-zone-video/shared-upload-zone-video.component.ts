import {Component, Output, OnInit, EventEmitter, Input} from '@angular/core';
import { videoDomainRegEx, vimeoVideoId, youtubeVideoId } from '../../../../utils/regex';
import { environment } from '../../../../../environments/environment';
import 'rxjs/add/operator/map';
import {first} from "rxjs/operators";
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {UmiusVideoInterface} from "@umius/umi-common-component";



@Component({
  selector: 'app-shared-upload-zone-video',
  templateUrl: './shared-upload-zone-video.component.html'
})

export class SharedUploadZoneVideoComponent implements OnInit {

  /***
   * when uploading to show the nice effect.
   */
  @Input() isUploading = false;

  @Input() innovationId: string

  @Input() activeInnovCardId: string

  @Input() mediaId: string = null;

  @Input() mediaIndex: number = null;

  @Output() public cbFn: EventEmitter<any> = new EventEmitter();

  private _videoUrlInput = '';

  private _videoParameters: Array<string> = [];

  private _isWrongFormat = false;

  constructor(//private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService) { }

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

    let video: UmiusVideoInterface = null;

    if (!this.isUploading) {
      this._isWrongFormat = false;
      const videoProviderReg = videoDomainRegEx.exec(this._videoUrlInput);
      const videoProvider = videoProviderReg ? videoProviderReg[0] : null; // vimeo || youtube
      const givenUrl = this._videoUrlInput; // URL donnée par l'utilisateur
      this._videoUrlInput = ''; // On vide le formulaire
      let params = givenUrl.split('?');
      if (params[1]) {
        params = params[1].split('&');
      }

      if (videoProvider) {
        this.isUploading = true;

        switch (videoProvider) {
          case 'vimeo': {
            const videoKey = vimeoVideoId.exec(givenUrl)[0]; // ID de la vidéo chez le provider
            const embeddableUrl = 'https://player.vimeo.com/video/' + videoKey + this._getUrlArgs(params);
            video = {
              url: givenUrl,
              public_id: videoKey,
              embeddableUrl: embeddableUrl,
              provider: 'vimeo',
              thumbnail: ''
            };
          }
          break;
          case 'youtube': {
            const videoKey = youtubeVideoId.exec(givenUrl)[1]; // ID de la vidéo chez le provider
            const embeddableUrl = 'https://www.youtube.com/embed/' + videoKey + this._getUrlArgs(params);
            video = {
              url: givenUrl,
              public_id: videoKey,
              embeddableUrl: embeddableUrl,
              provider: 'youtube',
              thumbnail: 'https://i.ytimg.com/vi/' + videoKey + '/hqdefault.jpg'
            };
          }
          break;
        }

        if (this.mediaId) {
          this._innovationService.updateVideo(this.innovationId,
            this.activeInnovCardId, this.mediaId, video)
            .pipe(first())
            .subscribe((file) => {
              console.log('received file 104 video', file)
              this.cbFn.emit(file);
              this.isUploading = false;
            });
        } else {
          this._innovationService.addNewMediaVideoToInnovationCard(this.innovationId,
            this.activeInnovCardId, video)
            .pipe(first())
            .subscribe((file) => {
              console.log('Im actually here')
              this.cbFn.emit(file);
              // this.isUploading = false; // ?????
            });
        }

      } else {
        this._isWrongFormat = true;
        this.isUploading = false;
      }
    }
  }

  private _getUrlArgs(urlParams: Array<string>): string { // Transform params to a string ?options=value&....
    let paramsString = '?';
    for (const parameters of urlParams) {
      paramsString += parameters + '&';
    }
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

  get isWrongFormat(): boolean {
    return this._isWrongFormat;
  }

}

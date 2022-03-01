import {Injectable} from '@angular/core';
import {UmiusMediaInterface} from '@umius/umi-common-component';

@Injectable({providedIn: 'root'})
export class MediaFrontService {

  constructor() { }

  /***
   * this function is for this type of url:
   * https://res.cloudinary.com/umi/image/upload/app/default-images/company-logo/guided-by-umi-light.svg
   * https://res.cloudinary.com/umi/image/upload/app/default-images/storyboard/executive-report.png
   * options are the cloudinary params.
   * https://cloudinary.com/documentation/image_transformations
   * @param src
   * @param width pass '' to not include width
   * @param height pass '' to not include height
   * @param options ex: ['c_fill', 'f_auto']
   */
  public static customDefaultImageSrc(src: string, width = '', height = '', options?: Array<string>): string {
    let _prefix = `https://res.cloudinary.com/umi/image/upload/f_auto,q_auto/app/default_images/`;

    if (width && height) {
      _prefix = `https://res.cloudinary.com/umi/image/upload/c_fill,f_auto,h_${height},q_auto,w_${width}/app/default-images/`;
    } else if (width) {
      _prefix = `https://res.cloudinary.com/umi/image/upload/c_fill,f_auto,q_auto,w_${width}/app/default-images/`;
    }

    if (options && options.length) {
      _prefix = `https://res.cloudinary.com/umi/image/upload/`;
      if (width && height) {
        _prefix += options.join(',') + `,h_${height},w_${width}/app/default-images/`;
      } else if (width) {
        _prefix += options.join(',') + `,w_${width}/app/default-images/`;
      } else {
        _prefix += options.join(',') + `,/app/default-images/`;
      }
    }

    return src ? src.replace(/^.*(\/default-images\/)/gi, _prefix) : '';
  }

  /**
   * empty image.
   * @param width - custom width
   * @param height - custom height
   */
  public static defaultMedia(width = '240', height = '159'): string {
    return `https://res.cloudinary.com/umi/image/upload/c_fill,h_${height},q_auto,w_${width}/app/default-images/icons/no-image.png`;
  }

  /**
   * @param media - if video then thumbnail | if photo then url.
   * @param width - custom width
   * @param height - custom height
   */
  public static getMedia(media: UmiusMediaInterface, width = '240', height = '159'): string {
    let _src = '';

    if (media && media.type && media.type === 'PHOTO') {
      _src = MediaFrontService.imageSrc(media, width, height);
    } else if (media && media.type && media.type === 'VIDEO') {
      _src = MediaFrontService.videoThumbnail(media);
    }

    return _src === '' ? MediaFrontService.defaultMedia(width, height) : _src;
  }

  /***
   * options are the cloudinary params.
   * https://cloudinary.com/documentation/image_transformations
   * @param media
   * @param width - custom width
   * @param height - custom height
   * @param options ex: ['c_fill', 'f_auto']
   */
  public static imageSrc(media: UmiusMediaInterface, width = '240', height = '159', options?: Array<string>): string {
    let _prefix = `https://res.cloudinary.com/umi/image/upload/c_fill,f_auto,g_center,h_${height},q_auto,w_${width}/`;
    const _suffix = '.jpg';

    if (options && options.length > 0) {
      _prefix = `https://res.cloudinary.com/umi/image/upload/`;
      _prefix += options.join(',') + `,h_${height},w_${width}/`;
    }

    return media && media.cloudinary && media.cloudinary.public_id ? _prefix + media.cloudinary.public_id + _suffix : '';
  }

  /**
   * @param media
   */
  public static videoThumbnail(media: UmiusMediaInterface): string {
    return media && media.video && media.video.thumbnail || '';
  }

}

import {Injectable} from '@angular/core';

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

    if (options && options.length > 0) {
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

}

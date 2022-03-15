import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({name: 'cleanHtml'})

export class DomSanitizerPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(html: string): SafeHtml {

    // ETHERPAD
    // --------
    if(!!html) {
      html = this.extractImgFromHref(html);
      html = this.extractVideoFromHref(html);
      html = this.addClassToImg(html);
      html = this.listInlineDisplayWorkAround(html);
    }
    // --------

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  /** ETHERPAD formatting workaround
   * Etherpad is not working well with html export of it's content.
   * In order to display it in a beautiful way for QUIZ and FRONT, we need to do some workaround for the moment.

   * ⚠️ The following functions should be added to QUIZ cleanHTML pipe as well
   * TODO - Add a common formatting in both app
   **/


  /**
   * Add a class to images in html to allow further formatting
   * @param html
   */
  addClassToImg(html: string) {
    return html.replace(/<img/gm, '<img class="img-editor"');
  }

  /**
   * Display list element inline
   * If not, list element will be broken and ugly
   */
  listInlineDisplayWorkAround(html: string) {
    const textAlignRegex = /<li><p style=["']text-align:(.*?)["']>/gm;
    const htmlToTransform = html;
    let m;

    while ((m = textAlignRegex.exec(htmlToTransform)) !== null) {
      if (m.index === textAlignRegex.lastIndex) {
        textAlignRegex.lastIndex++;
      }
      const alignTag = `<li><span style='text-align:${m[1]}'>`;
      html = html.replace(m[0], alignTag);
    }
    return html;
  }

  /**
   * Old etherpad images handling
   * Display <img> tags from <a> tags containing img url
   * @param html
   */
  extractImgFromHref(html: string) {
    const imgInHrefTagRegex = /<a[^>]*(http?s?:?\/\/[^"'<>]*\.(?:png|jpg|jpeg|gif|svg)).*?<\/a>/gm;
    const htmlToTransform = html;
    let m;

    while ((m = imgInHrefTagRegex.exec(htmlToTransform)) !== null) {
      if (m.index === imgInHrefTagRegex.lastIndex) {
        imgInHrefTagRegex.lastIndex++;
      }
      const imgTag = `<img class='img-editor' src="${m[1]}" alt="img">`;
      html = html.replace(m[0], imgTag);
    }
    return html;
  }

  /**
   * Display <video> from <a> tags containing video url
   * @constructor
   */
  extractVideoFromHref(html: string) {
    // Youtube doesn't authorize cross-platforms iframes
    // const youtubeInHrefTagRegex = /<a.*href="((?:(?:http|https)?:\/\/)?(?:www.youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)(?:[a-zA-Z0-9_-]{6,11}))" .*<\/a>/gm;
    const vimeoInHrefTagRegex = /<a[^>]*href="((?:http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\?.*?))" .*?<\/a>/gm;
    const htmlToTransform = html;
    let m;

    while ((m = vimeoInHrefTagRegex.exec(htmlToTransform)) !== null) {
      if (m.index === vimeoInHrefTagRegex.lastIndex) {
        vimeoInHrefTagRegex.lastIndex++;
      }
      const videoTag = `<iframe src="${m[1]}" width="100%" height="400px" frameborder="0" allowfullscreen=""></iframe>`;
      html = html.replace(m[0], videoTag);
    }
    return html;
  }
}

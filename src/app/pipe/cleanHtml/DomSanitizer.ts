import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({name: 'cleanHtml'})

export class DomSanitizerPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(html: string): SafeHtml {
    html = this.extractImgFromHref(html);
    html = this.extractVideoFromHref(html);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // Display <img> tags from <a> tags containing img url
  // Used for etherpad formatting
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

  // Display <video> from <a> tags containing video url
  // Used for etherpad formatting
  extractVideoFromHref(html: string) {
    // Youtube doesn't authorize cross-platforms iframes
    // const youtubeInHrefTagRegex = /<a.*href="((?:(?:http|https)?:\/\/)?(?:www.youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)(?:[a-zA-Z0-9_-]{6,11}))" .*<\/a>/gm;
    const vimeoInHrefTagRegex = /<a[^>]*href="((?:http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?))" .*?<\/a>/gm;
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

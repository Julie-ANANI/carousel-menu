import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({name: 'cleanHtml'})

export class DomSanitizerPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {}

  transform(html: string): SafeHtml {
    html = this.extractImgFromHref(html);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // Display <img> tags from <a> tags containing img url
  // Used for etherpad formatting
  extractImgFromHref(html: string) {
    const imgInHrefTagRegex = /<a.*href="(http?s?:?\/\/[^"']*\.(?:png|jpg|jpeg|gif|svg))" .*<\/a>/gm;
    let m;

    while ((m = imgInHrefTagRegex.exec(html)) !== null) {
      if (m.index === imgInHrefTagRegex.lastIndex) {
        imgInHrefTagRegex.lastIndex++;
      }
      const imgTag = `<img class='img-editor' src="${m[1]}" alt="img">`;
      html = html.replace(m[0], imgTag);
    }
    return html;
  }
}

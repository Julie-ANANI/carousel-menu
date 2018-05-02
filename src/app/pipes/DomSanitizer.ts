/**
 * Created by juandavidcruzgomez on 13/02/2018.
 */
import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';



@Pipe({name: 'cleanHtml'})
export class DomSanitizerPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {}

    transform(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

}

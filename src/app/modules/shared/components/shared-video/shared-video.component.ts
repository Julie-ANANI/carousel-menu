import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-video',
    templateUrl: 'shared-video.component.html'
})

export class SharedVideoComponent implements OnInit {

    @Input() media: any;
    public url: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {
        // that way we avoid loading the iframe with the parent component.
        this.url = this.sanitizeUrl(this.media.video.embeddableUrl);
    }

    sanitizeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

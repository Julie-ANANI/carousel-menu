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
        this.url = this.sanitizeUrl(this.media.url);
    }

    sanitizeUrl(url: string): SafeResourceUrl {
        const updated_url = url.replace("watch?v=", "embed/");
        return this.sanitizer.bypassSecurityTrustResourceUrl(updated_url);
    }
}

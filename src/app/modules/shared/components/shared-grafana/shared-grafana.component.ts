import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-shared-grafana',
  templateUrl: './shared-grafana.component.html'
})
export class SharedGrafanaComponent implements OnInit {

  @Input() set url(value: string) {
    this._panelUrl = this.dom.bypassSecurityTrustResourceUrl(`${environment.grafanaUrl}/d-solo/${value}&theme=light`)
  };

  private _panelUrl: SafeUrl;

  constructor(private dom: DomSanitizer) {
  }

  ngOnInit() {

  }

  get panelUrl(): SafeUrl {
    return this._panelUrl;
  }
}

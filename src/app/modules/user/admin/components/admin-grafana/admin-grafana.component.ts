import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-admin-grafana',
  templateUrl: './admin-grafana.component.html'
})
export class AdminGrafanaComponent implements OnInit {

  // TODO remove, for Hugo tests on dev
  private _testUrls = {
    local : [
      'O0jKtQUnk/test?from=now-6h&to=now&panelId=2',
      'O0jKtQUnk/test?from=now-12h&to=1650027834367&panelId=2',
      'O0jKtQUnk/test?from=now-24h&to=1650027834367&panelId=3',
      'O0jKtQUnk/test?from=1d&to=1650027834367&panelId=3',
      'kqgABQU7z/lea?from=1650958685791&to=now&panelId=2'
    ],
    dev : [
      'QxohoaKnz/base-de-donnees?orgId=1&from=1640991600000&to=1641077999000&panelId=9',
      'QxohoaKnz/base-de-donnees?orgId=1&from=1640991600000&to=1641077999000&panelId=4',
      'QxohoaKnz/base-de-donnees?orgId=1&from=1640991600000&to=1641077999000&panelId=15',
      'lsE0rmcnz/clearbit?orgId=1&from=1650937649794&to=1650959249794&panelId=6',
      'Ud0FOmc7k/pros-reconstruits?orgId=1&from=1650937685652&to=1650959285652&panelId=8'
    ]
  }

  constructor() { }

  ngOnInit(): void {

  }

  get testUrls(): string[] {
    return (environment.local)? this._testUrls.local:this._testUrls.dev;
  }
}

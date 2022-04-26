import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminGrafanaComponent} from './admin-grafana.component';
import {SharedGrafanaModule} from "../../../../shared/components/shared-grafana/shared-grafana.module";
import {AdminGrafanaRoutingModule} from "./admin-grafana-routing.module";


@NgModule({
  declarations: [AdminGrafanaComponent],
  imports: [
    CommonModule,
    SharedGrafanaModule,
    AdminGrafanaRoutingModule
  ],
  exports: [
    AdminGrafanaComponent
  ]
})
export class AdminGrafanaModule {
}

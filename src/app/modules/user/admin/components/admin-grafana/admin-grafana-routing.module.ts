import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGrafanaComponent} from "./admin-grafana.component";

export const routes: Routes = [
  {
    path: '',
    component: AdminGrafanaComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminGrafanaRoutingModule {
}

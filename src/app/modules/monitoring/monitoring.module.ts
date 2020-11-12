import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MonitoringRoutingModule } from './monitoring-routing.module';

import { MonitoringComponent } from './monitoring.component';

import { HeaderModule } from '../common/header/header.module';
import { FooterModule } from '../common/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MonitoringRoutingModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [
    MonitoringComponent,
  ],
})

export class MonitoringModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClientRoutingModule } from './client-routing.module';

import { ClientComponent } from './client.component';

import { ProjectModule } from './components/project/project.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ClientRoutingModule,
    ProjectModule,
  ],
  declarations: [
    ClientComponent,
  ]
})

export class ClientModule {}

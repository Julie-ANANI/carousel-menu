import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClientRoutingModule } from './client-routing.module';

import { ClientComponent } from './client.component';

import { ProjectModule } from './components/project/project.module';
import { WelcomeModule } from './components/welcome/welcome.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ClientRoutingModule,
    WelcomeModule,
    ProjectModule,
  ],
  declarations: [
    ClientComponent,
  ]
})

export class ClientModule {}

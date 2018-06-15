import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClientDiscoverDescriptionComponent } from './client-discover-description.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ClientDiscoverDescriptionComponent
  ],
  exports: [
    ClientDiscoverDescriptionComponent
  ]
})

export class ClientDiscoverDescriptionModule { }

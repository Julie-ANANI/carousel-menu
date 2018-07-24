// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedTextZoneComponent } from './shared-text-zone.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedTextZoneComponent
  ],
  exports: [
    SharedTextZoneComponent
  ]
})

export class SharedTextZoneModule { }

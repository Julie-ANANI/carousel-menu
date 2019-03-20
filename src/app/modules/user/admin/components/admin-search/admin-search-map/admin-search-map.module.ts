import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminSearchMapComponent } from './admin-search-map.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminSearchMapComponent
  ],
  providers: [
  ],
  entryComponents: [
    AdminSearchMapComponent
  ],
  exports: [
    AdminSearchMapComponent
  ]
})

export class AdminSearchMapModule {}

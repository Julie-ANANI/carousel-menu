import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdvsearchFormComponent } from './advsearch-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdvsearchFormComponent
  ],
  exports: [
    AdvsearchFormComponent
  ]
})

export class SidebarAdvsearchFormModule {}

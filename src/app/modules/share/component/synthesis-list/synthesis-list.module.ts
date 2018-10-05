import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SynthesisListComponent } from './synthesis-list.component';
import { RouterModule } from '@angular/router';
import { SharedLoaderModule } from '../../../shared/components/shared-loader/shared-loader.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedLoaderModule
  ],
  declarations: [
    SynthesisListComponent
  ],
  exports: [
    SynthesisListComponent
  ]
})

export class SynthesisListModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SynthesisListComponent } from './synthesis-list.component';
import { RouterModule } from '@angular/router';
import { SharedLoaderModule } from '../../../shared/components/shared-loader/shared-loader.module';
import { PaginationModule } from '../../../utility-components/pagination/pagination.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedLoaderModule,
    PaginationModule
  ],
  declarations: [
    SynthesisListComponent
  ],
  exports: [
    SynthesisListComponent
  ]
})

export class SynthesisListModule {}

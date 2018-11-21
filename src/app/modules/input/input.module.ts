import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipeModule } from '../../pipe/pipe.module';
import { CountryFlagComponent } from './component/country-flag/country-flag.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PipeModule
  ],
  declarations: [
    CountryFlagComponent
  ],
  exports: [
    CountryFlagComponent
  ]
})

export class InputModule {}

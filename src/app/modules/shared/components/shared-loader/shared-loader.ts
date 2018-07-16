// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedLoaderComponent } from './shared-loader.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedLoaderComponent
  ],
  exports: [
    SharedLoaderComponent
  ]
})

export class SharedLoader { }

// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { SharedImportProsComponent } from './shared-import-pros.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    SharedImportProsComponent
  ],
  exports: [
    SharedImportProsComponent
  ]
})

export class SharedImportProsModule { }

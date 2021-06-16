import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedDateSelectorComponent } from './shared-date-selector.component';

@NgModule({
  declarations: [SharedDateSelectorComponent],
  exports: [
    SharedDateSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class SharedDateSelectorModule {
}

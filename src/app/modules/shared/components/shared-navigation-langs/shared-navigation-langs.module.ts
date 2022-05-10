import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedNavigationLangsComponent } from './shared-navigation-langs.component';

@NgModule({
  declarations: [SharedNavigationLangsComponent],
  exports:[SharedNavigationLangsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedNavigationLangsModule { }

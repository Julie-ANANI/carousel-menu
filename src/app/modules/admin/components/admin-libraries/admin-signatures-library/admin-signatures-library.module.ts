import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminSignaturesLibraryComponent } from "./admin-signatures-library.component";
import { RouterModule } from "@angular/router";


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule
  ],
  declarations: [
    AdminSignaturesLibraryComponent
  ],
  exports: [
    AdminSignaturesLibraryComponent
  ]
})

export class AdminSignaturesLibraryModule {}

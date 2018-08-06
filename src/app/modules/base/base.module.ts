import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { LogoutPageComponent } from './components/logout-page/logout-page.component';
import { HeaderComponent } from './components/header/header.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    SharedLoaderModule,
    SidebarModule
  ],
  declarations: [
    LogoutPageComponent,
    HeaderComponent,
    NotFoundPageComponent
  ],
  exports: [
    HeaderComponent
  ]
})

export class BaseModule {}

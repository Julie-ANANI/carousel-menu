import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MessageTemplateComponent } from "./message-template.component";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    MessageTemplateComponent
  ],
  exports: [
    MessageTemplateComponent
  ]
})

export class MessageTemplateModule {}

import { NgModule } from "@angular/core";
import { SwellRTEditorComponent } from "./components/swell-editor-component/swellrt-editor.component";
import { CommonModule } from "@angular/common";


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SwellRTEditorComponent
  ],
  exports: [
    SwellRTEditorComponent
  ]
})


export class SwellRTEditorModule {}
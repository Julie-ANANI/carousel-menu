import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedWorldmapComponent } from './shared-worldmap.component';

import { SharedWorldmapService} from './services/shared-worldmap.service';
import { IndexService } from '../../../../services/index/index.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedWorldmapComponent
  ],
  providers: [
    SharedWorldmapService,
    IndexService
  ],
  entryComponents: [
    SharedWorldmapComponent
  ],
  exports: [
    SharedWorldmapComponent
  ]
})

export class SharedWorldmapModule {}

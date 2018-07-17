import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CharacterCountdown } from './pipes/CharacterCountdown';
import { DomSanitizerPipe } from './pipes/DomSanitizer';
import { FilterPipe } from './pipes/TableFilterPipe';
import { LimitsPipe } from './pipes/TableLimitsPipe';
import { DateFormatPipe } from './pipes/DateFormatPipe';
import { MultilingPipe } from './pipes/multiling.pipe';
import { ObjectKeysPipe } from './pipes/objectKeys.pipe';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { DiscoverSummaryPipe } from './pipes/DiscoverSummaryPipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CharacterCountdown,
    DomSanitizerPipe,
    FilterPipe,
    LimitsPipe,
    DateFormatPipe,
    MultilingPipe,
    ObjectKeysPipe,
    EllipsisPipe,
    DiscoverSummaryPipe
  ],
  exports: [
    CharacterCountdown,
    DomSanitizerPipe,
    FilterPipe,
    LimitsPipe,
    DateFormatPipe,
    MultilingPipe,
    ObjectKeysPipe,
    EllipsisPipe,
    DiscoverSummaryPipe
  ]
})

export class PipeModule {}

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
import { FormatText } from './pipes/FormatText';
import { ScrapeHTMLTags } from './pipes/ScrapeHTMLTags';


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
    DiscoverSummaryPipe,
    FormatText,
    ScrapeHTMLTags
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
    DiscoverSummaryPipe,
    FormatText,
    ScrapeHTMLTags
  ]
})

export class PipeModule {}

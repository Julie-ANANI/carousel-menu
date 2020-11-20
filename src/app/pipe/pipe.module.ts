import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterCountdown } from './pipes/CharacterCountdown';
import { FilterPipe } from './pipes/TableFilterPipe';
import { LimitsPipe } from './pipes/TableLimitsPipe';
import { MultilingPipe } from './pipes/multiling.pipe';
import { OrderByPipe } from './pipes/orderBy.pipe';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { FormatText } from './pipes/FormatText';
import { ScrapeHTMLTags } from './pipes/ScrapeHTMLTags';
import { FormatBytes } from './pipes/FormatBytes';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CharacterCountdown,
    FilterPipe,
    LimitsPipe,
    MultilingPipe,
    OrderByPipe,
    EllipsisPipe,
    FormatText,
    ScrapeHTMLTags,
    FormatBytes
  ],
  exports: [
    CharacterCountdown,
    FilterPipe,
    LimitsPipe,
    MultilingPipe,
    OrderByPipe,
    EllipsisPipe,
    FormatText,
    ScrapeHTMLTags,
    FormatBytes
  ]
})

export class PipeModule {}

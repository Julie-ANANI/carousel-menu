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
import { TranslateInPipe } from './pipes/translate-in.pipe';

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
    FormatBytes,
    TranslateInPipe
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
    FormatBytes,
    TranslateInPipe
  ]
})

export class PipeModule {}

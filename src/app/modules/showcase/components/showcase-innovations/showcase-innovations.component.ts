import { Component, Input } from '@angular/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../models/innovation';
import { TagStats } from '../../../../models/tag-stats';

@Component({
  selector: 'app-showcase-innovations',
  templateUrl: './showcase-innovations.component.html',
})

export class ShowcaseInnovationsComponent {

  @Input() totalInnovations: number;

  @Input() set tagsStats(value: Array<TagStats>) {
    const tags_id = value.map((st) => st.tag._id);
    if (tags_id.length > 0) {
      const config = {
        fields: 'created name principalMedia status',
        isPublic: '1',
        status: JSON.stringify({$in: ['EVALUATING', 'DONE']}),
        tags: JSON.stringify({ $in: tags_id }),
        sort: '{"created":-1}'
      };
      this.innovationService.getAll(config).subscribe((next) => {
        if (Array.isArray(next.result)) {
          this._innovations = next.result;
          this._topInnovations = next.result.slice(0, 6);
        }
      });
    } else {
      this._topInnovations = [];
    }
  }
  public openInnovationsModal = false;

  private _innovations: Array<Innovation> = [];
  private _topInnovations: Array<Innovation> = [];

  constructor(private innovationService: InnovationService) {}

  get innovations() {
    return this._innovations;
  }

  get topInnovations() {
    return this._topInnovations;
  }

}

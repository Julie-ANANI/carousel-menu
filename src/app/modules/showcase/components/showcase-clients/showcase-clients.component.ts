import { Component, Input } from '@angular/core';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TagStats } from '../../../../models/tag-stats';

@Component({
  selector: 'app-showcase-clients',
  templateUrl: './showcase-clients.component.html',
})

export class ShowcaseClientsComponent {

  @Input() set tagsStats(value: Array<TagStats>) {
    const tags_id = value.map((st) => st.tag._id);
    if (tags_id.length > 0) {
      const config = {
        fields: 'created owner',
        tags: JSON.stringify({ $in: tags_id })
      };
      this.innovationService.getAll(config).subscribe((next) => {
        if (Array.isArray(next.result)) {
          this._topClients = next.result.map((i) => i.owner.companyName);
        }
      });
    } else {
      this._topClients = [];
    }
  }

  private _topClients: Array<string> = [];

  constructor(private innovationService: InnovationService) {}

  get topClients() {
    return this._topClients;
  }

}

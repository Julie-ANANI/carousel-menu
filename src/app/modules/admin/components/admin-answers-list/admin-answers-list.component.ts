import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { Answer } from '../../../../models/answer';

@Component({
  selector: 'app-admin-answers-list',
  templateUrl: './admin-answers-list.component.html',
  styleUrls: ['./admin-answers-list.component.scss']
})
export class AdminAnswersListComponent implements OnInit {

  @Input() answers: Array<Answer>;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(_campaignService: CampaignService) {}

  ngOnInit(): void {
  }

  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

  public buildImageUrl(country: any): string {
    if (country && country.notation) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country.notation}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }
}

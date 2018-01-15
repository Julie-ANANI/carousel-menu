import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CampaignService } from '../../../../services/campaign/campaign.service';

@Component({
  selector: 'app-admin-answers-list',
  templateUrl: './admin-answers-list.component.html',
  styleUrls: ['./admin-answers-list.component.scss']
})
export class AdminAnswersListComponent implements OnInit {

  @Input() answers;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(_campaignService: CampaignService) {}

  ngOnInit(): void {
  }
  
  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

  public buildImageUrl(country: string): string {
    if (country) return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';

@Component({
  selector: 'app-shared-search-mail',
  templateUrl: './shared-search-mail.component.html',
  styleUrls: ['./shared-search-mail.component.scss']
})
export class SharedSearchMailComponent implements OnInit {
  
  constructor(private _searchService: SearchService) {}

  ngOnInit(): void {
  }

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }
}

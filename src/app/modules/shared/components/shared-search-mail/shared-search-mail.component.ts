import { Component } from '@angular/core';

@Component({
  selector: 'app-shared-search-mail',
  templateUrl: './shared-search-mail.component.html',
  styleUrls: ['./shared-search-mail.component.scss']
})
export class SharedSearchMailComponent {

  constructor() {}

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }
}

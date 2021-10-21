import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-template-2',
  templateUrl: './message-template-2.component.html',
  styleUrls: ['./message-template-2.component.scss']
})

export class MessageTemplate2Component {

  @Input() srcImage = 'https://res.cloudinary.com/umi/image/upload/app/default-images/bot/info.svg';

  @Input() animation = false;

  constructor() { }

}

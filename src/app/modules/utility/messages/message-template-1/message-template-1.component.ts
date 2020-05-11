import { Component, Input } from '@angular/core';

@Component({
  selector: 'message-template-1',
  templateUrl: './message-template-1.component.html',
  styleUrls: ['./message-template-1.component.scss']
})

export class MessageTemplate1Component {

  @Input() srcImage = 'https://res.cloudinary.com/umi/image/upload/app/default-images/bot/info.svg';

  @Input() widthMax = '273px';

  @Input() backgroundColor = '#4F5D6B';

  constructor() { }

}

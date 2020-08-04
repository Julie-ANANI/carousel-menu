import { Component, Input } from '@angular/core';

@Component({
  selector: 'message-template',
  templateUrl: './message-template.component.html',
  styleUrls: ['./message-template.component.scss']
})

export class MessageTemplateComponent {

  @Input() srcImage = 'https://res.cloudinary.com/umi/image/upload/app/default-images/bot/info.svg';

  @Input() widthMax = '273px';

  @Input() backgroundColor = '#4F5D6B';

  @Input() isFetching = false;

  constructor() { }

}

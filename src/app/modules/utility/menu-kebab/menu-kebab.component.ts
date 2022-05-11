import {Component, Input} from '@angular/core';
import {Innovation} from '../../../models/innovation';
import {RouteFrontService} from '../../../services/route/route-front.service';
import {InnovCard} from '../../../models/innov-card';
import {InnovationFrontService} from '../../../services/innovation/innovation-front.service';
import {RolesFrontService} from '../../../services/roles/roles-front.service';

@Component({
  selector: 'app-menu-kebab',
  templateUrl: './menu-kebab.html',
  styleUrls: ['./menu-kebab.scss']
})
export class MenuKebabComponent {

  @Input() items = [
    'french',
    'english',
    'spanish',
    'german',
    'dutch',
  ];

  @Input() color = '#EFEFEF';
  @Input() btnViewColor = '#4F5D6B';
  @Input() textColor = '#00B0FF';
  @Input() isActive = false;


}

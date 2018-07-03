import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../../../models/user.model';

@Component({
  selector: 'app-sidebar-collaborator',
  templateUrl: './sidebar-collaborator.component.html',
  styleUrls: ['./sidebar-collaborator.component.scss'],
  animations: [
    trigger('sidebarAnimate', [
      state('inactive', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('inactive <=> active', animate('700ms ease-in-out'))
    ])
  ]
})

export class SidebarCollaboratorComponent implements OnInit {

  @Input() animate_state: string;

  @Input() addedCollaborator: Array<User>;

  @Output() closeSidebar = new EventEmitter<string>();

  formData: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.animate_state = 'inactive';

    this.formData = this.formBuilder.group({
      collaboratorEmail: ['', [Validators.required, Validators.email]]
    });

  }

  toggleState() {
    this.animate_state = 'inactive';
    this.closeSidebar.emit(this.animate_state);
    this.formData.reset();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.formData.get('collaboratorEmail').value);
  }

}

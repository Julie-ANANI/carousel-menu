import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.styl']
})
export class AdminUsersComponent implements OnInit {

  public users: any = []; // TODO private
  public dataLoaded = false;

  constructor(private _userService: UserService,
              private _titleService: Title) {}

  ngOnInit(): void {
    this._userService.getAll().subscribe(users => {
      this.users = users;
      this.dataLoaded = true;
      this._titleService.setTitle('Users'); // TODO transalte
    });
  }

}

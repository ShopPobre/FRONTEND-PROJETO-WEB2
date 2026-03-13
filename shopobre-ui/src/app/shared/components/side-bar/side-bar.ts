import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
})
export class SideBar {

  constructor(
    private userService: UserService
  ) {}

  logout () {
    this.userService.logout();
  }

}

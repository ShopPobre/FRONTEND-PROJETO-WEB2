import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule],
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

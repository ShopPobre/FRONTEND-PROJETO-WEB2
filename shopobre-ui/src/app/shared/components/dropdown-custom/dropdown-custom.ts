import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-dropdown-custom',
  imports: [],
  templateUrl: './dropdown-custom.html',
  styleUrl: './dropdown-custom.scss',
})
export class DropdownCustom {

  isDropdownOpen = false;

  constructor(
    private readonly userService: UserService
  ) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.userService.logout();
  }

}

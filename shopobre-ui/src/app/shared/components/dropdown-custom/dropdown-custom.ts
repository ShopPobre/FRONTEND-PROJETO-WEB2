import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-dropdown-custom',
  imports: [RouterLink],
  templateUrl: './dropdown-custom.html',
  styleUrl: './dropdown-custom.scss',
})
export class DropdownCustom {

  isDropdownOpen = false;
  @Output() accountClick = new EventEmitter<void>();
  @Output() addressClick = new EventEmitter<void>();

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

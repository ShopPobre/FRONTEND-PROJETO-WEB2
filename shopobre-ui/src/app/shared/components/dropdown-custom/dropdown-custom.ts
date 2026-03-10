import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdown-custom',
  imports: [],
  templateUrl: './dropdown-custom.html',
  styleUrl: './dropdown-custom.scss',
})
export class DropdownCustom {

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}

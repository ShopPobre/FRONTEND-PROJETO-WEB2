import { Component } from '@angular/core';

@Component({
  selector: 'app-top-nav-bar',
  imports: [],
  templateUrl: './top-nav-bar.html',
  styleUrl: './top-nav-bar.scss',
})
export class TopNavBar {

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-top-nav-bar',
  imports: [],
  templateUrl: './top-nav-bar.html',
  styleUrl: './top-nav-bar.scss',
})
export class TopNavBar {

  @Output() btnClick = new EventEmitter<void>(); 

 
}

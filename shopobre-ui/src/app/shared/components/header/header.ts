import { Component, EventEmitter, inject, input, Input, Output, signal } from '@angular/core';
import { Button } from '../button/button';
import { SearchInput } from '../search-input/search-input';
import { DropdownCustom } from '../dropdown-custom/dropdown-custom';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [Button, SearchInput, DropdownCustom],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  isRegister= input(false);
  labelButton = signal("Pesquisar");
  placeholder = signal("Macbook m4");
  text = input('');
  private router = inject(Router);

  @Output() btnClick = new EventEmitter<void>();


  navegarAccount(){
    this.router.navigate(['account'])
  }
  
  navegarAddress(){
    this.router.navigate(['address'])
  }

}

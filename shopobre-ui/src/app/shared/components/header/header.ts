import { Component, input, Input, signal } from '@angular/core';
import { Button } from '../button/button';
import { SearchInput } from '../search-input/search-input';
import { DropdownCustom } from '../dropdown-custom/dropdown-custom';

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

}

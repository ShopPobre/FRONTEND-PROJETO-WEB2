import { Component, input, Input, signal } from '@angular/core';
import { Button } from '../button/button';
import { SearchInput } from '../search-input/search-input';

@Component({
  selector: 'app-header',
  imports: [Button, SearchInput],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  labelButton = signal("Pesquisar");
  placeholder = signal("Macbook m4");
  text =  input.required<string>();

}

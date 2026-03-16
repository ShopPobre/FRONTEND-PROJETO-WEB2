import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { Button } from '../button/button';
import { SearchInput } from '../search-input/search-input';
import { DropdownCustom } from '../dropdown-custom/dropdown-custom';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [Button, SearchInput, DropdownCustom, RouterLink],
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

  cartCount = inject(CartService).count;

  private readonly searchTerm = signal('');

  readonly categoryLinks = [
    { label: 'Ofertas do dia', slug: 'ofertas-do-dia' },
    { label: 'Mais vendidos', slug: 'mais-vendidos' },
    { label: 'Games', slug: 'games' },
    { label: 'Livros', slug: 'livros' },
    { label: 'Casa', slug: 'casa' },
    { label: 'Eletrônicos', slug: 'eletronicos' },
    { label: 'Brinquedos e Jogos', slug: 'brinquedos-jogos' },
    { label: 'Computadores', slug: 'computadores' },
    { label: 'Moda', slug: 'moda' },
    { label: 'Beleza', slug: 'beleza' },
    { label: 'Mercado', slug: 'mercado' },
  ];

  navegarAccount(){
    this.router.navigate(['account'])
  }
  
  navegarAddress(){
    this.router.navigate(['address'])
  }

  onSearchInputChange(value: string): void {
    this.searchTerm.set(value);
  }

  onSearchClick(): void {
    const term = this.searchTerm().trim();
    if (!term) {
      return;
    }
    this.router.navigate(['/search'], {
      queryParams: { q: term },
    });
  }

}

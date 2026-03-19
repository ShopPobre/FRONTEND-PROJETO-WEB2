import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-table-header',
  imports: [],
  templateUrl: './table-header.html',
  styleUrl: './table-header.scss',
})
export class TableHeader {

  title = input('Product Name');
  label = input.required<string>();
  isOrder = input(true);

}

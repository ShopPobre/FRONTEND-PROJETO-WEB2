import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-header',
  imports: [],
  templateUrl: './table-header.html',
  styleUrl: './table-header.scss',
})
export class TableHeader {

  label = input.required<string>();

}

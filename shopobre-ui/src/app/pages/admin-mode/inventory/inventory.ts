import { Component, inject } from '@angular/core';
import { SideBar } from '../../../shared/components/side-bar/side-bar';
import { Router } from '@angular/router';
import { TopNavBar } from '../../../shared/components/top-nav-bar/top-nav-bar';
import { ControlActions } from '../../../shared/components/control-actions/control-actions';
import { InventoryList } from '../../../shared/components/inventory-list/inventory-list';

@Component({
  selector: 'app-inventory',
  imports: [SideBar, TopNavBar, ControlActions, InventoryList],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class Inventory {

  private router = inject(Router);

  navegarEdit(inventoryId: number) {
    this.router.navigate(['admin/inventory/edit', inventoryId]);
  }

}

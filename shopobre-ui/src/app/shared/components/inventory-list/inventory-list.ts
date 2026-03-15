import { Component, OnInit, output, signal } from '@angular/core';
import { InventoryResponseDTO } from '../../../core/models/inventory.model';
import { TableHeader } from '../table-header/table-header';
import { InventoryService } from '../../../core/services/inventory.service';
import { SwalService } from '../../../core/services/swal.service';
import { InventoryListCard } from '../inventory-list-card/inventory-list-card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-list',
  imports: [TableHeader, InventoryListCard],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss',
})
export class InventoryList implements OnInit {
  editClick = output<number>();
  inventories = signal<InventoryResponseDTO[]>([]);
  isLoading = signal(false);

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  private loadInventory() {
    this.inventoryService.getAll().subscribe({
      next: (response: any) => {
        this.inventories.set(response.data ?? response);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}

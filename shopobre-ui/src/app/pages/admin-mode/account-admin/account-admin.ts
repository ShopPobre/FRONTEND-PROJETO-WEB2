import { Component, inject } from '@angular/core';
import { SideBar } from '../../../shared/components/side-bar/side-bar';
import { AccountForm } from '../../../shared/components/account-form/account-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-admin',
  imports: [SideBar, AccountForm],
  templateUrl: './account-admin.html',
  styleUrl: './account-admin.scss',
})
export class AccountAdmin {

  private router = inject(Router);

  navegar() {
    this.router.navigate(['admin/products']);
  }

}

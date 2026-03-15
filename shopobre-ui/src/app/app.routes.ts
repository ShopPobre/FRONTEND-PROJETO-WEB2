import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Account } from './pages/account/account';
import { Address } from './pages/address/address';
import { Product } from './pages/admin-mode/product/product';
import { AddProduct } from './pages/admin-mode/add-product/add-product';
import { Home } from './pages/home/home';
import { authGuard } from './core/guards/auth-guard';
import { AccountAdmin } from './pages/admin-mode/account-admin/account-admin';
import { EditProduct } from './pages/admin-mode/edit-product/edit-product';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  { path: 'account', component: Account, canActivate: [authGuard] },
  { path: 'address', component: Address, canActivate: [authGuard] },

  // ADMIN
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'products', component: Product },
      { path: 'products/add', component: AddProduct },
      { path: 'products/edit/:id', component: EditProduct },
      { path: 'account', component: AccountAdmin },
    ],
  },

  { path: 'home', component: Home },
];

import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Account } from './pages/account/account';
import { Address } from './pages/address/address';
import { Product } from './pages/admin-mode/product/product';
import { AddProduct } from './pages/admin-mode/add-product/add-product';
import { Home } from './pages/home/home';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  { path: 'account', component: Account, canActivate: [authGuard] },
  { path: 'address', component: Address, canActivate: [authGuard] },

  // ADMIN
  {
    path: 'products',
    component: Product,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'products/add',
    component: AddProduct,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },

  { path: 'home', component: Home },
];

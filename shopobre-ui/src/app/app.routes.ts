import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Account } from './pages/account/account';
import { Address } from './pages/address/address';
import { Product } from './pages/admin-mode/product/product';
import { AddProduct } from './pages/admin-mode/add-product/add-product';
import { Home } from './pages/home/home';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'signup', component: Signup},
    { path: 'account', component: Account},
    { path: 'address', component: Address},

    //MODO ADMIN
    { path: 'admin/product', component: Product},
    { path: 'admin/product/add', component: AddProduct},
    { path: 'home', component: Home}
];

import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Account } from './pages/account/account';
import { Address } from './pages/address/address';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'signup', component: Signup},
    { path: 'account', component: Account},
    { path: 'address', component: Address}
];

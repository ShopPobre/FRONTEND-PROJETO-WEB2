import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { AccountForm } from '../../shared/components/account-form/account-form';

@Component({
  selector: 'app-account',
  imports: [Header, AccountForm],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {

}
